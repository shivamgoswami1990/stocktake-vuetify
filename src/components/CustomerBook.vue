<template>
  <v-navigation-drawer v-model="showDrawer" right fixed temporary width="500">

    <v-layout align-center fill-height justify-center v-if="isDataLoading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7"></v-progress-circular>
    </v-layout>

    <v-card v-else flat color="secondary">
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
                      :loading="isNotesLoading" flat hide-details class="pb-1"></v-textarea>

          <v-btn block dark color="black" @click="saveCustomerNotes" :loading="isNotesSaving">
            Save notes
          </v-btn>
        </div>

        <v-text-field placeholder="Filter by name ..." clearable v-model="searchTerm"
                      autofocus class="px-4 pt-4 pb-0" color="black" hide-details
                      v-if="filteredItems.length > 0">
        </v-text-field>

        <div v-for="(item, key) in filteredItems" :key="key" class="px-4 pb-2"
             v-if="filteredItems.length > 0">

          <v-card color="black" dark tile>
            <v-card-title class="body-2">{{item.item_name}}</v-card-title>

            <v-card-text class="pa-0">
              <v-data-table :headers="headers" :items="item.subitems" hide-default-footer light>
                <template v-slot:item.price_per_kg="{ item }">
                  {{item.price_per_kg}}/{{item.units_for_display}}
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{calendarDate(item.created_at)}}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>

        <v-card-title primary-title v-else class="justify-center title">No items found</v-card-title>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      showDrawer: false,
      isDataLoading: true,
      isNotesSaving: false,
      isNotesLoading: true,
      items: [],
      dataForExport: [],
      searchTerm: '',
      notes: '',
      headers: [
        {
          text: 'Price(₹)',
          value: 'price_per_kg',
          sortable: false
        },
        {
          text: 'Packaging',
          value: 'packaging',
          sortable: false
        },
        {
          text: 'Date',
          value: 'created_at',
          sortable: false
        }
      ]
    };
  },

  computed: {
    filteredItems() {
      return this.items.filter(item => item.item_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
    }
  },

  mounted() {
    const vm = this;

    // Remove the action column in data table for add item to invoice
    if (!vm.$attrs.showAddItemBtn) {
      vm.headers.splice(3, 1);
    }
    vm.showDrawer = true;
    vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id + '/all_ordered_items',
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
      vm.isDataLoading = false;
      vm.items = vm.groupItemsByName(response.data);
      vm.dataForExport = response.data;
    }, (response) => {
      vm.isDataLoading = false;
    });

    vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
      vm.notes = response.data.notes;
      vm.isNotesLoading = false;
    }, (response) => {
    });
  },

  methods: {
    groupItemsByName(items) {
      const groupedItems = [];
      items.forEach((item) => {
        // Check grouped items list for any existing entries
        if (groupedItems.length > 0) {
          let itemMatched = false;
          groupedItems.forEach((groupedItem) => {
            if (groupedItem.item_name === item.item_name) {
              groupedItem.subitems.push(item);
              itemMatched = true;
            }
          });

          if (!itemMatched) {
            // Push as a new item
            groupedItems.push({
              item_name: item.item_name,
              subitems: [item]
            });
          }
        } else {
          groupedItems.push({
            item_name: item.item_name,
            subitems: [item]
          });
        }
      });
      return groupedItems;
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
        }).then((response) => {
        vm.isNotesSaving = false;
      }, (response) => {
        vm.isNotesSaving = false;
      });
    },

    exportToCSV() {
      const vm = this;
      // Reformat the selected array to a comma seperated nested array
      const reformattedSelectedArray = [
        ['Item name', 'Price per kg (₹)', 'Packaging', 'Date']
      ];

      // Append only values sequentially
      this.dataForExport.forEach((row) => {
        reformattedSelectedArray.push([
          row.item_name, row.price_per_kg, row.packaging, vm.calendarDate(row.created_at)
        ]);
      });

      // Pass the reformatted array to the CSV fn
      this.convertToCSV(this.$attrs.data.name + '.csv', reformattedSelectedArray);
    }
  }
};
</script>
