<template>
  <div>
    <v-layout align-center fill-height justify-center v-if="$attrs.loading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="my-5">
      </v-progress-circular>
    </v-layout>

    <!-- Add new item form -->
    <v-overlay opacity="0.8" :value="showAddNewItemForm">
      <v-layout align-center justify-center fill-height wrap>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card flat light tile width="500px">
            <v-card-title class="text-center">Add new item</v-card-title>
            <v-card-text>

              <v-container>
                <v-layout wrap>

                  <v-flex sm8 md8>
                    <v-text-field v-model="newSubitem.item_name" :rules="[rules.required]"
                                  label="Name" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm4 md4>
                    <v-text-field v-model="newSubitem.item_price" type="number"
                                  label="Price" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm6 md6>
                    <v-text-field v-model="newSubitem.packaging" type="number" :rules="[rules.required]"
                                  label="Packaging" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm6 md6>
                    <v-text-field v-model="newSubitem.no_of_items" type="number"
                                  label="No of items" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm6 md6>
                    <v-text-field v-model="newSubitem.price_per_kg" type="number" :rules="[rules.required]"
                                  label="Price/kg" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm6 md6>
                    <v-text-field v-model="newSubitem.item_hsn"
                                  label="HSN" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex sm6 md6>
                    <v-text-field v-model="newSubitem.item_amount" type="number"
                                  label="Amount" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" depressed width="49%"
                     @click.native="showAddNewItemForm = false">Cancel</v-btn>
              <v-btn color="primary" depressed width="50%"
                     @click.native="createNewItem(true)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-layout>
    </v-overlay>
    <!-- Add new item form -->

    <v-btn block tile color="gray" dark @click="addNewSubitemForItem(null)" v-if="!$attrs['hide-add-btn']">
      Add new item
    </v-btn>
    <div v-if="$attrs.items.length > 0">
      <div v-for="(item, itemIndex) in $attrs.items" :key="itemIndex">

        <v-card color="black" dark tile>
          <v-card-title class="body-2">
            {{item[0].item_name}}
            <v-spacer/>
            <a style="text-decoration: underline" class="white--text"
               @click="addNewSubitemForItem(itemIndex)" v-if="!$attrs['hide-add-btn']">
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

                <td>
                  <span v-if="subitem.company">{{subitem.company.name}}</span>
                </td>

                <td>
                  <router-link :to="{ name: 'viewInvoice', params: { id: subitem.invoice_id}}"
                               target="_blank" v-if="subitem.invoice_id">View
                  </router-link>
                </td>

                <td>
                  <v-btn outlined tile elevation="0" small color="success" class="ma-2"
                         v-if="subitem.id !== editedItemId && subitem.id !== deletedItemId"
                         @click="editButtonClicked(subitem.id)">
                    Edit
                  </v-btn>

                  <v-btn tile elevation="0" small color="primary" class="ma-2"
                         @click="saveOrderedItem(subitem)"
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
      rules: {
        required: (value) => !!value || 'Required.'
      },
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      newSubitem: {},
      valid: false,
      showAddNewItemForm: false
    };
  },
  methods: {
    editButtonClicked(subitemId) {
      this.editedItemId = subitemId;
      console.log(this.$attrs);
    },
    deleteButtonClicked(subitemId) {
      this.deletedItemId = subitemId;
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
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        });
    },
    saveOrderedItem(subitem) {
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
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        });
    },
    addNewSubitemForItem(itemIndex) {
      // Copy item name & key from the current item
      const currentDate = new Date();

      this.newSubitem = {
        item_name: null,
        name_key: null,
        item_price: 0,
        packaging: 0,
        no_of_items: 0,
        price_per_kg: 0,
        item_hsn: '',
        item_amount: 0,
        order_date: currentDate.toISOString().split('T')[0],
        user_id: this.userDetails().id,
        customer_id: this.$attrs.customer_id,
        invoice_id: null,
        parent_item_index: null
      };

      if (itemIndex !== undefined && itemIndex !== null) {
        this.newSubitem.item_name = this.$attrs.items[itemIndex][0].item_name;
        this.newSubitem.name_key = this.$attrs.items[itemIndex][0].name_key;
        this.newSubitem.parent_item_index = itemIndex;
      }

      this.showAddNewItemForm = true;
    },
    createNewItem() {
      const vm = this;
      if (this.$refs.form.validate()) {
        vm.$http.post(process.env.VUE_APP_REST_URL + '/ordered_items',
          {
            item_name: vm.newSubitem.item_name,
            name_key: vm.newSubitem.item_name.replace(/\s/g, '').toLowerCase(),
            item_price: parseFloat(vm.newSubitem.item_price),
            packaging: parseFloat(vm.newSubitem.packaging),
            no_of_items: parseInt(vm.newSubitem.no_of_items, 10),
            price_per_kg: parseFloat(vm.newSubitem.price_per_kg),
            item_hsn: vm.newSubitem.item_hsn,
            item_amount: parseFloat(vm.newSubitem.item_amount),
            order_date: vm.newSubitem.order_date,
            user_id: vm.newSubitem.user_id,
            customer_id: vm.newSubitem.customer_id,
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response) => {
            // Check if the item needs to be added to parent
            if (vm.newSubitem.parent_item_index !== undefined && vm.newSubitem.parent_item_index !== null) {
              vm.$attrs.items[vm.newSubitem.parent_item_index].push(response.data);
            }

            // Close the modal
            vm.showAddNewItemForm = false;

            // Show success toast
            vm.showToast = true;
            vm.toastMessage = 'Successfully created item';
            vm.toastColor = 'success';
          }, (response) => {
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
      }
    }
  }
};
</script>
