<template>
  <div>
    <v-layout align-center fill-height justify-center v-if="$attrs.loading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="my-5">
      </v-progress-circular>
    </v-layout>

    <div v-if="$attrs.items.length > 0">
      <div v-for="(item, itemIndex) in $attrs.items" :key="itemIndex">

        <v-card color="black" dark tile>
          <v-card-title class="body-2">{{item[0].item_name}}</v-card-title>

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
                  :style="subitem.id === deletedItemId ? { backgroundColor: '#FF5252'} : {}">
                <td style="width: 20%">
                  <v-text-field v-model="subitem.price_per_kg" v-if="subitem.id === editedItemId" solo
                                type="number" outlined dense hide-details color="black" suffix="/kg">
                  </v-text-field>
                  <span v-else>{{subitem.price_per_kg}}</span>
                </td>
                <td>
                  {{parseFloat(subitem.packaging, 10) < 1000 ? subitem.packaging + ' gm' :
                  parseFloat(subitem.packaging, 10) / 1000  + ' kg'}}
                </td>
                <td>{{subitem.company.name}}</td>
                <td>{{subitem.user.first_name}}</td>
                <td>{{calendarDate(subitem.order_date)}}</td>
                <td style="width: 200px">
                  <v-btn outlined tile elevation="0" small color="success" class="mr-2"
                         v-if="subitem.id !== editedItemId && subitem.id !== deletedItemId"
                         @click="editButtonClicked(subitem.id)">
                    Edit
                  </v-btn>
                  <v-btn tile elevation="0" small color="success" class="mr-2"
                         v-if="subitem.id === editedItemId || subitem.id === deletedItemId">
                    <span v-if="subitem.id === editedItemId">Save</span>
                    <span v-if="subitem.id === deletedItemId">Delete</span>
                  </v-btn>

                  <v-btn outlined tile elevation="0" small color="error"
                         v-if="subitem.id !== deletedItemId && subitem.id !== editedItemId"
                         @click="deleteButtonClicked(subitem.id)">
                    Delete
                  </v-btn>
                  <v-btn tile elevation="0" small color="black" dark
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Price(₹)/kg',
          value: 'price_per_kg'
        },
        {
          text: 'Packaging',
          value: 'packaging'
        },
        {
          text: 'Company'
        },
        {
          text: 'Created by'
        },
        {
          text: 'Date',
          value: 'created_at'
        },
        {
          text: 'Actions'
        }
      ],
      editedItemId: null,
      isEditButtonClicked: false,
      deletedItemId: null,
      isDeleteButtonClicked: false
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
    }
  }
};
</script>
