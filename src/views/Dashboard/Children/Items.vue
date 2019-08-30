<template>
  <v-card flat>
    <v-card-title>
      Items list
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" solo class="hidden-sm-and-down"
                    single-line hide-details clearable autofocus>
      </v-text-field>
      <v-dialog v-model="dialog" max-width="600px" persistent>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" fab small depressed class="mx-4"
                 v-if="userDetails().permissions.item.create">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline justify-center">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.name" label="Name" class="pa-1"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.series" label="Series" class="pa-1"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.one_tenth_price" class="pa-1"
                                label="25gm (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.quarter_price" label="100gm (₹)" class="pa-1">
                  </v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.half_price" class="pa-1"
                                label="500gm/1Kg (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.bulk_price" label="5kg/30Kg (₹)" class="pa-1">
                  </v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.dozen_price" class="pa-1"
                                label="per dozen (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md3>
                  <v-text-field v-model="editedItem.litre_price" class="pa-1"
                                label="per litre (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md4>
                  <v-text-field v-model="editedItem.one_tenth_piece_price" class="pa-1"
                                label="25gm piece (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md4>
                  <v-text-field v-model="editedItem.quarter_piece_price" class="pa-1"
                                label="100gm piece (₹)"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md4>
                  <v-switch v-model="editedItem.is_discount_enabled" color="primary" class="ma-0 pl-5"
                            :label="editedItem.is_discount_enabled ? 'Allowed' : 'Not allowed'"
                            hint="Enable/disable discount" persistent-hint>
                  </v-switch>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn color="secondary" depressed width="49%" @click.native="close">Cancel</v-btn>
            <v-btn color="primary" depressed width="50%" @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-badge right color="info" overlap>
        <span slot="badge" v-if="selected.length > 0">{{selected.length}}</span>
        <v-btn color="info" fab small depressed :disabled="selected.length === 0" @click="exportToCSV">
          <v-icon>mdi-cloud-download</v-icon>
        </v-btn>
      </v-badge>
    </v-card-title>

    <v-card-text>
      <v-data-table :headers="headers" :items="perfumes" :loading="isDataLoading"
                    :search="search" v-model="selected" show-select multi-sort>

        <template v-slot:item.is_discount_enabled="{ item }">
          <v-chip color="secondary" class="black--text" label small>
            {{ item.is_discount_enabled ? 'Yes' : 'No' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" bottom right>
      {{ toastMessage }}
      <v-btn dark depressed text @click="showToast = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isDataLoading: true,
      search: '',
      dialog: false,
      editedIndex: -1,
      selected: [],
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      editedItem: {
        id: null,
        name: '',
        series: '',
        one_tenth_price: 0,
        quarter_price: 0,
        half_price: 0,
        bulk_price: 0,
        dozen_price: 0,
        litre_price: 0,
        one_tenth_piece_price: 0,
        quarter_piece_price: 0,
        is_discount_enabled: true
      },
      defaultItem: {
        id: null,
        name: '',
        series: '',
        one_tenth_price: 0,
        quarter_price: 0,
        half_price: 0,
        bulk_price: 0,
        dozen_price: 0,
        litre_price: 0,
        one_tenth_piece_price: 0,
        quarter_piece_price: 0,
        is_discount_enabled: true
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Series',
          value: 'series'
        },
        {
          text: 'Discount',
          value: 'is_discount_enabled',
          sortable: false
        },
        {
          text: '25gm (₹)',
          value: 'one_tenth_price',
          align: 'center'
        },
        {
          text: '100gm (₹)',
          value: 'quarter_price',
          align: 'center'
        },
        {
          text: '500gm/1Kg (₹)',
          value: 'half_price',
          align: 'center'
        },
        {
          text: '5kg/30Kg (₹)',
          value: 'bulk_price',
          align: 'center'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ],
      perfumes: []
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new item' : 'Edit an existing item';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/items',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((response) => {
          vm.setItemsData(response.data);
        }, (response) => {
        })
    );
  },

  methods: {
    setItemsData(data) {
      this.perfumes = data;
      this.isDataLoading = false;
    },

    editItem(item) {
      this.editedIndex = this.perfumes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.$http.delete(process.env.VUE_APP_REST_URL + '/items/' + item.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response) => {
            const index = this.perfumes.indexOf(item);
            this.perfumes.splice(index, 1);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully deleted item';
            this.toastColor = '';
          }, (response) => {
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        // Edit this item. Save to DB
        this.$http.patch(process.env.VUE_APP_REST_URL + '/items/' + this.editedItem.id,
          {
            item: {
              name: this.editedItem.name,
              one_tenth_price: this.editedItem.one_tenth_price,
              quarter_price: this.editedItem.quarter_price,
              half_price: this.editedItem.half_price,
              bulk_price: this.editedItem.bulk_price,
              dozen_price: this.editedItem.dozen_price,
              quarter_piece_price: this.editedItem.quarter_piece_price,
              one_tenth_piece_price: this.editedItem.one_tenth_piece_price,
              litre_price: this.editedItem.litre_price,
              series: this.editedItem.series,
              is_discount_enabled: this.editedItem.is_discount_enabled
            }
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response) => {
            // Edit item in table on success
            Object.assign(this.perfumes[this.editedIndex], this.editedItem);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully saved item';
            this.toastColor = 'success';
          }, (response) => {
            // error callback. Show error alert
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
      } else {
        // Add a new item
        this.$http.post(process.env.VUE_APP_REST_URL + '/items',
          {
            item: {
              name: this.editedItem.name,
              one_tenth_price: this.editedItem.one_tenth_price,
              quarter_price: this.editedItem.quarter_price,
              half_price: this.editedItem.half_price,
              bulk_price: this.editedItem.bulk_price,
              dozen_price: this.editedItem.dozen_price,
              quarter_piece_price: this.editedItem.quarter_piece_price,
              one_tenth_piece_price: this.editedItem.one_tenth_piece_price,
              litre_price: this.editedItem.litre_price,
              series: this.editedItem.series,
              is_discount_enabled: this.editedItem.is_discount_enabled
            }
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response) => {
            // Edit item in table on success
            this.perfumes.push(response.data);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully created item';
            this.toastColor = 'success';
          }, (response) => {
            // error callback. Show error alert
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
      }
      this.close();
    },

    exportToCSV() {
      // Reformat the selected array to a comma seperated nested array
      const reformattedSelectedArray = [
        ['Item name', 'Series', '25gm price', '100gm price', '500gm/1Kg price', '5Kg/30Kg price',
          'per doz price', 'per ltr price', '25gm/pc price', '100gm/pc price', 'Created date']
      ];

      // Append only values sequentially
      this.selected.forEach((row) => {
        reformattedSelectedArray.push([
          row.name, row.series, row.one_tenth_price, row.quarter_price, row.half_price, row.bulk_price,
          row.dozen_price, row.litre_price, row.one_tenth_piece_price, row.quarter_piece_price, row.created_at
        ]);
      });

      // Pass the reformatted array to the CSV fn
      this.convertToCSV('perfume_list.csv', reformattedSelectedArray);

      // Empty the selected array
      this.selected = [];
    },

    convertToCSV(filename, rows) {
      const processRow = function (row) {
        let finalVal = '';
        for (let j = 0; j < row.length; j++) {
          let innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString();
          }
          let result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0) {
            result = '"' + result + '"';
          }
          if (j > 0) {
            finalVal += ',';
          }
          finalVal += result;
        }
        return finalVal + '\n';
      };

      let csvFile = '';
      for (let i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
      }

      const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }
};
</script>
