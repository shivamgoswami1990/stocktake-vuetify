<template>
  <v-navigation-drawer v-model="showDrawer" right fixed temporary width="90%">
    <v-card flat color="secondary">
      <v-btn color="info" fab x-small depressed @click="exportToCSV"
             style="position: absolute; right: 50px; top: 10px">
        <v-icon>mdi-cloud-download</v-icon>
      </v-btn>
      <v-btn dark color="black" x-small fab depressed @click="showDrawer = false"
             style="position: absolute; right: 10px; top: 10px">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="justify-center title">{{$attrs.data.name}}</v-card-title>

      <v-card-text>

        <v-tabs v-model="tabs" centered dark icons-and-text>
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#search-items">
            Search
            <v-icon>mdi-card-search</v-icon>
          </v-tab>

          <v-tab href="#recent-items" @click="recentOrderedItemsTabClicked">
            Recent
            <v-icon>mdi-history</v-icon>
          </v-tab>

          <v-tab href="#notes">
            Notes
            <v-icon>mdi-clipboard-text</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs">
          <v-tab-item value="search-items">
            <v-text-field label="Search ordered items" v-model="searchTerm" flat color="black"
                          :loading="isSearchedItemsLoading" solo hide-details clearable
                          @input="searchRecentlyOrderedItems">
            </v-text-field>
            <customer-book-item-results :items="searchedOrderedItems"
                                        :loading="isSearchedItemsLoading"
                                        :customer_id="$attrs.data.id"/>
          </v-tab-item>

          <v-tab-item value="recent-items">
            <customer-book-item-results :items="recentlyOrderedItems"
                                        :loading="isRecentItemsDataLoading"
                                        :customer_id="$attrs.data.id" />
          </v-tab-item>

          <v-tab-item value="notes">
            <v-textarea name="Customer notes" label="Customer notes" solo auto-grow v-model="notes"
                        flat hide-details class="pb-1" rows="10">
            </v-textarea>

            <v-btn block dark color="black" @click="saveCustomerNotes" tile
                   :loading="isNotesSaving">
              Save notes
            </v-btn>
          </v-tab-item>
        </v-tabs-items>

      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import CustomerBookItemResults from './CustomerBookItemResults.vue';

export default {
  data() {
    return {
      showDrawer: false,
      tabs: null,
      recentlyOrderedItems: [],
      isRecentItemsDataLoading: true,
      notes: '',
      isNotesSaving: false,
      searchTerm: '',
      isSearchedItemsLoading: false,
      searchedOrderedItems: [],

      isSampleCommentLoading: false,
      isExportDataLoading: false,
      dataForExport: [],
    };
  },

  components: { CustomerBookItemResults },

  mounted() {
    const vm = this;
    vm.showDrawer = true;
  },

  methods: {
    recentOrderedItemsTabClicked() {
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
        }, (response) => {
          vm.isRecentItemsDataLoading = false;
        });
    },

    searchRecentlyOrderedItems() {
      const vm = this;

      if (vm.searchTerm !== undefined && vm.searchTerm !== null) {
        if (vm.searchTerm.length > 2) {
          vm.isSearchedItemsLoading = true;
          vm.$http.get(process.env.VUE_APP_REST_URL + '/ordered_items?customer_id='
            + vm.$attrs.data.id + '&search_term=' + vm.searchTerm,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then((response) => {
              vm.isSearchedItemsLoading = false;
              vm.searchedOrderedItems = Object.values(response.data);
            }, (response) => {
              vm.isSearchedItemsLoading = false;
            });
        } else {
          vm.searchedOrderedItems = [];
        }
      } else {
        vm.searchedOrderedItems = [];
      }
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
          vm.$http.get(process.env.VUE_APP_REST_URL + '/all_ordered_items?customer_id='
            + vm.$attrs.data.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then((response1) => {
              vm.isExportDataLoading = false;
              vm.dataForExport = response1.data;
              // Append only values sequentially
              vm.dataForExport.forEach((row) => {
                reformattedSelectedArray.push([
                  row.item_name, row.price_per_kg, row.packaging, vm.calendarDate(row.order_date)
                ]);
              });

              vm.isSampleCommentLoading = false;
              // Pass the reformatted array to the CSV fn
              vm.convertToCSV(vm.$attrs.data.name + '.csv', reformattedSelectedArray);
            }, (response1) => {
              vm.isExportDataLoading = false;
            });
        }, (response) => {
          vm.isRecentItemsDataLoading = false;
        });
    }
  }
};
</script>
