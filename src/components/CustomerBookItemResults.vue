<template>
  <div>
    <v-layout align-center fill-height justify-center v-if="$attrs.loading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="my-5">
      </v-progress-circular>
    </v-layout>

    <v-overlay opacity="0.8" :value="false"></v-overlay>
    <div v-if="$attrs.items.length > 0">
      <div v-for="(item, itemIndex) in $attrs.items" :key="itemIndex">

        <v-card color="black" dark tile>
          <v-card-title class="body-2">
            {{item[0].item_name}}
            <v-spacer/>
            <a style="text-decoration: underline" class="white--text">
              Add new - {{item[0].item_name}}
            </a>
          </v-card-title>

          <v-card-text class="pa-0">
            <v-simple-table light>
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.value">{{header.text}}</th>
                </tr>
              </thead>

              <tbody>
              <!-- Items row -->
              <tr v-for="(subitem, subitemIndex) in item" :key="subitemIndex"
                  :style="rowActionBackgroundColor(subitem.id, editedItemId, deletedItemId)">

                <td style="width: 10%">
                  <v-text-field v-model="subitem.item_price" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black" prefix="₹">
                  </v-text-field>
                  <span v-else>{{subitem.item_price}}</span>
                </td>

                <td style="width: 12%">
                  <v-text-field v-model="subitem.packaging" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black" suffix="/gm">
                  </v-text-field>
                  <span v-else>
                    {{parseFloat(subitem.packaging, 10) < 1000 ? subitem.packaging + ' gm' :
                    parseFloat(subitem.packaging, 10) / 1000  + ' kg'}}
                  </span>
                </td>

                <td style="width: 8%">
                  <v-text-field v-model="subitem.no_of_items" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black">
                  </v-text-field>
                  <span v-else>{{subitem.no_of_items}}</span>
                </td>

                <td style="width: 12%">
                  <v-text-field v-model="subitem.price_per_kg" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black" suffix="/gm">
                  </v-text-field>
                  <span v-else>{{subitem.price_per_kg}}/kg</span>
                </td>

                <td style="width: 10%">
                  <v-text-field v-model="subitem.item_hsn" v-if="subitem.id === editedItemId" solo
                                outlined dense hide-details color="black">
                  </v-text-field>
                  <span v-else>{{subitem.item_hsn}}</span>
                </td>

                <td style="width: 12%">
                  <v-text-field v-model="subitem.item_amount" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black" prefix="₹">
                  </v-text-field>
                  <span v-else>{{subitem.item_amount}}</span>
                </td>

                <td>{{subitem.financial_year}}</td>

                <td>{{calendarDate(subitem.order_date)}}</td>

                <td>{{subitem.user.first_name}}</td>

                <td>{{subitem.company.name}}</td>
                <td>
                  <a style="text-decoration: underline"
                     @click="$router.push({ name: 'viewInvoice', params: { id: subitem.invoice_id}})">
                    View
                  </a>
                </td>

                <td>
                  <v-btn outlined tile elevation="0" small color="success" class="ma-2"
                         v-if="subitem.id !== editedItemId && subitem.id !== deletedItemId"
                         @click="editButtonClicked(subitem.id)">
                    Edit
                  </v-btn>

                  <v-btn tile elevation="0" small color="primary" class="ma-2"
                         @click="saveOrderedItem(subitem, subitem.price_per_kg, subitem.packaging)"
                         v-if="subitem.id === editedItemId && subitem.id !== deletedItemId">
                    Save
                  </v-btn>

                  <v-btn tile elevation="0" small color="primary" class="ma-2"
                         @click="deleteOrderedItem(subitem.id, itemIndex, subitemIndex)"
                         v-if="subitem.id !== editedItemId && subitem.id === deletedItemId">
                    Delete
                  </v-btn>

                  <v-btn outlined tile elevation="0" small color="error" class="ma-2"
                         v-if="subitem.id !== deletedItemId && subitem.id !== editedItemId"
                         @click="deleteButtonClicked(subitem.id)">
                    Delete
                  </v-btn>
                  <v-btn tile elevation="0" small color="black" dark class="ma-2"
                         v-if="subitem.id === editedItemId || subitem.id === deletedItemId"
                         @click="setEditAndDeleteButtonInitialState">
                    Cancel
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <h2 v-else class="py-5 black--text subtitle-1 text-center">
      No items found
    </h2>

    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" bottom right>
      {{ toastMessage }}
      <v-btn dark depressed text @click="showToast = false">Close</v-btn>
    </v-snackbar>

  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Price(₹)'
        },
        {
          text: 'Packaging'
        },
        {
          text: 'Qty'
        },
        {
          text: 'Price(₹)/kg'
        },
        {
          text: 'HSN'
        },
        {
          text: 'Amount'
        },
        {
          text: 'FY'
        },
        {
          text: 'Order date'
        },
        {
          text: 'Created by'
        },
        {
          text: 'Company'
        },
        {
          text: 'Invoice'
        },
        {
          text: 'Actions'
        }
      ],
      editedItemId: null,
      isEditButtonClicked: false,
      deletedItemId: null,
      isDeleteButtonClicked: false,
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
    };
  },
  methods: {
    editButtonClicked(subitemId) {
      this.editedItemId = subitemId;
      console.log(this.editedItemId);
    },
    deleteButtonClicked(subitemId) {
      this.deletedItemId = subitemId;
      console.log(this.deletedItemId);
    },
    setEditAndDeleteButtonInitialState() {
      this.editedItemId = null;
      this.deletedItemId = null;
    },
    rowActionBackgroundColor(subitemId, editedItemId, deletedItemId) {
      let resultColor;
      if (subitemId === editedItemId) {
        resultColor = { backgroundColor: '#4CAF50' };
      } else if (subitemId === deletedItemId) {
        resultColor = { backgroundColor: '#FF5252' };
      } else {
        resultColor = {};
      }

      return resultColor;
    },
    deleteOrderedItem(subitemId, itemIndex, subitemIndex) {
      const vm = this;

      vm.$http.delete(process.env.VUE_APP_REST_URL + '/ordered_items/' + subitemId,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((response) => {
          // Remove item from list on successful deletion
          if (vm.$attrs.items[itemIndex].length === 1) {
            vm.$attrs.items.splice(itemIndex, 1);
          } else {
            vm.$attrs.items[itemIndex].splice(subitemIndex, 1);
          }

          // Show success toast
          vm.showToast = true;
          vm.toastMessage = 'Successfully deleted item';
          vm.toastColor = 'success';
        }, (response) => {
        });
    },
    saveOrderedItem(subitem, pricePerKg, packaging) {
      const vm = this;

      vm.$http.patch(process.env.VUE_APP_REST_URL + '/ordered_items/' + subitem.id,
        {
          item_price: parseFloat(subitem.item_price),
          packaging: parseFloat(subitem.packaging),
          no_of_items: parseFloat(subitem.no_of_items),
          price_per_kg: parseFloat(subitem.price_per_kg),
          item_hsn: subitem.item_hsn,
          item_amount: parseFloat(subitem.item_amount),
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((response) => {
          vm.editedItemId = null;

          // Show success toast
          vm.showToast = true;
          vm.toastMessage = 'Successfully updated item';
          vm.toastColor = 'success';
        }, (response) => {
        });
    }
  }
};
</script>
