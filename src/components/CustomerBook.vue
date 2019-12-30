<template>
  <v-navigation-drawer v-model="showDrawer" right fixed temporary width="500">
    <v-card flat color="secondary">
      <v-btn color="info" fab x-small depressed @click="exportToCSV"
             style="position: absolute; right: 50px; top: 10px">
        <v-icon>mdi-cloud-download</v-icon>
      </v-btn>
      <v-btn dark color="black" x-small fab depressed @click="showDrawer = false"
             style="position: absolute; right: 10px; top: 10px">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="justify-center title">Customer book</v-card-title>
      <v-card-title class="justify-center title">{{$attrs.data.name}}</v-card-title>

      <v-card-text class="pa-0 pb-2">

        <div class="px-4 py-0">
          <v-textarea name="Customer notes" label="Customer notes" solo auto-grow v-model="notes"
                      flat hide-details class="pb-1" rows="3"></v-textarea>

          <v-btn block dark color="black" @click="saveCustomerNotes" :loading="isNotesSaving">
            Save notes
          </v-btn>
        </div>

        <!-- Recently ordered items -->
        <div class="pt-5">
          <v-layout align-center fill-height justify-center v-if="isRecentItemsDataLoading">
            <v-progress-circular indeterminate color="primary" :size="70"
                                 :width="7"></v-progress-circular>
          </v-layout>

          <v-divider></v-divider>
          <h3 class="text-center headline black--text py-2">Recently ordered items</h3>

          <div v-if="recentlyOrderedItems.length > 0">
            <div v-for="(item, key) in recentlyOrderedItems" :key="key" class="px-4 pb-2">

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
                    <tr v-for="(subitem, index) in item" :key="index">
                      <td>{{subitem.price_per_kg}}</td>
                      <td>{{parseFloat(subitem.packaging, 10) < 1000 ? subitem.packaging + ' gm' : parseFloat(subitem.packaging, 10) / 1000  + ' kg'}}</td>
                      <td>{{calendarDate(subitem.order_date)}}</td>
                    </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </div>
          </div>

          <v-card-title primary-title v-else class="justify-center title">
            No items found
          </v-card-title>
        </div>
        <!-- Recently ordered items -->


      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      showDrawer: false,
      isRecentItemsDataLoading: true,
      isNotesSaving: false,
      isSampleCommentLoading: false,
      isExportDataLoading: false,
      notes: '',
      recentlyOrderedItems: [],
      dataForExport: [],
      searchTerm: '',
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
          text: 'Date',
          value: 'created_at'
        }
      ]
    };
  },

  mounted() {
    const vm = this;

    // Remove the action column in data table for add item to invoice
    if (!vm.$attrs.showAddItemBtn) {
      vm.headers.splice(3, 1);
    }
    vm.showDrawer = true;
    vm.notes = vm.$attrs.data.notes;
    vm.loadOrderedItems();
  },

  methods: {
    loadOrderedItems() {
      const vm = this;
      vm.isRecentItemsDataLoading = true;
      vm.$http.get(process.env.VUE_APP_REST_URL + '/ordered_items?customer_id='
        + vm.$attrs.data.id + '&recent_items=true',
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then((response) => {
          vm.isRecentItemsDataLoading = false;
          vm.recentlyOrderedItems = Object.values(response.data);
          console.log(response.data);
        }, (response) => {
          vm.isRecentItemsDataLoading = false;
        });
    },

    saveCustomerNotes() {
      const vm = this;
      vm.isNotesSaving = true;

      this.$http.patch(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id,
        {
          customer: {
            notes: vm.notes
          }
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((response) => {
          vm.isNotesSaving = false;
        }, (response) => {
          vm.isNotesSaving = false;
        });
    },

    exportToCSV() {
      const vm = this;
      const selectedCustomer = vm.$attrs.data;
      vm.isSampleCommentLoading = true;

      vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + selectedCustomer.id + '/invoice_sample_comments',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((response) => {
          // Reformat the selected array to a comma seperated nested array
          const reformattedSelectedArray = [];
          reformattedSelectedArray.push(['Customer name', 'St Address',
            'City', 'State', 'Postcode',
            'GST no', 'Pan no', 'Phone no',
            'Code', 'Freight allowed', 'Freight type',
            'Transport', 'Destination', 'Notes',
            'Primary discount', 'Secondary discount', 'Contact email']);
          reformattedSelectedArray.push([selectedCustomer.name, selectedCustomer.st_address,
            selectedCustomer.city, selectedCustomer.state_name, selectedCustomer.postcode,
            selectedCustomer.gstin_no, selectedCustomer.pan_no, selectedCustomer.phone_no,
            selectedCustomer.code, selectedCustomer.freight_allowed ? 'Yes' : 'No', selectedCustomer.freight_type,
            selectedCustomer.transport_name, selectedCustomer.destination, selectedCustomer.notes,
            selectedCustomer.primary_discount, selectedCustomer.secondary_discount, selectedCustomer.contact_email]);
          reformattedSelectedArray.push(['', '', '', '', '']);
          reformattedSelectedArray.push(['Sample Comments']);

          const sample_comments = [];
          response.data.forEach((row) => {
            sample_comments.push(row[0]);
          });
          reformattedSelectedArray.push(sample_comments);
          reformattedSelectedArray.push(['', '', '', '', '']);

          reformattedSelectedArray.push(['Item name', 'Price per kg (₹)', 'Packaging', 'Date']);

          // Load all the items for export
          vm.isExportDataLoading = true;
          vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id
              + '/all_ordered_items',
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then((response) => {
              vm.isExportDataLoading = false;
              vm.dataForExport = response.data;
              // Append only values sequentially
              vm.dataForExport.forEach((row) => {
                reformattedSelectedArray.push([
                  row.item_name, row.price_per_kg, row.packaging, vm.calendarDate(row.created_at)
                ]);
              });

              vm.isSampleCommentLoading = false;
              // Pass the reformatted array to the CSV fn
              vm.convertToCSV(vm.$attrs.data.name + '.csv', reformattedSelectedArray);
            }, (response) => {
              vm.isExportDataLoading = false;
            });
        }, (response) => {
          vm.isRecentItemsDataLoading = false;
        });
    }
  }
};
</script>
