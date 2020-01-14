<template>
  <v-card flat>
    <v-card-title>
      Transports list
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" solo class="hidden-sm-and-down"
                    single-line hide-details clearable autofocus @input="searchTransport">
      </v-text-field>
      <v-dialog v-model="dialog" max-width="600px" persistent>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" fab small depressed class="mx-4">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card>
            <v-card-title class="headline justify-center">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-layout wrap>
                  <v-flex md12>
                    <v-text-field v-model="editedTransport.name" label="Name" class="pa-1"></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-combobox v-model="editedTransport.location" label="Location" :items="cities"
                                item-text="name" return-object @input="setLocation" class="pa-1">
                    </v-combobox>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field v-model="editedTransport.gst_no" label="GST No"
                                  class="pa-1" :rules="[rules.gstin]">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" depressed width="49%" @click.native="close">Cancel</v-btn>
              <v-btn color="primary" depressed width="50%" @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-card-title>

    <v-card-text>
      <v-data-table :headers="headers" :items="transports" :loading="isDataLoading"
                    :options.sync="dataTableOptions" :server-items-length="totalRecords"
                    :footer-props="{'items-per-page-options': [10]}" disable-sort
                    :hide-default-footer="hideDataTableFooter">

        <template v-slot:item.created_at="{ item }">
          {{calendarDate(item.created_at)}}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editTransport(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteTransport(item)">mdi-delete</v-icon>
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
import cities from '@/cities.json';
import states from '@/states.json';

export default {
  data() {
    return {
      isDataLoading: true,
      dataTableOptions: {},
      totalRecords: 0,
      hideDataTableFooter: false,
      search: '',
      dialog: false,
      editedIndex: -1,
      selected: [],
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      editedTransport: {
        id: null,
        name: '',
        location: '',
        gst_no: ''
      },
      defaultTransport: {
        id: null,
        name: '',
        location: '',
        gst_no: ''
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Location',
          value: 'location'
        },
        {
          text: 'GST No',
          value: 'gst_no',
          sortable: false
        },
        {
          text: 'Created on',
          value: 'created_at',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ],
      transports: [],
      cities,
      states,
      valid: false,
      rules: {
        gstin: (v) => {
          if (v !== undefined && v !== null) {
            if (v.length > 0) {
              return this.validateFormRules(v, 'e', 15, 'Exact 15 digits');
            }
            return true;
          }
          return true;
        }
      }
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new transport' : 'Edit an existing transport';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dataTableOptions(val) {
      this.getTransportsByPage(val.page);
    }
  },

  methods: {
    setTransportsData(data) {
      this.transports = data;
      this.isDataLoading = false;
    },

    setLocation() {
      // On city select, set the city model correctly by comparing with states list
      const vm = this;
      if (vm.editedTransport !== undefined && vm.editedTransport !== null) {
        const selectedCity = vm.editedTransport.location;
        const selectedStateFromCity = selectedCity.state.replace(/\s/g, '').toLowerCase();

        // Loop through states list to determine a match
        vm.states.forEach((state) => {
          if (selectedStateFromCity === state.name.replace(/\s/g, '').toLowerCase()) {
            vm.editedTransport.gst_no = state.tin_no;

            // Set the city model correctly
            vm.editedTransport.location = selectedCity.name;
          }
        });
      }
    },

    getTransportsByPage(pageNo) {
      const vm = this;
      vm.isDataLoading = true;
      vm.$http.get(process.env.VUE_APP_REST_URL + '/transports?page_no=' + pageNo,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setTransportsData(response.data[1]);
        vm.totalRecords = response.data[0].count;
      }, (response) => {
      });
    },

    editTransport(transport) {
      this.editedIndex = this.transports.indexOf(transport);
      this.editedTransport = { ...transport };
      this.dialog = true;
    },

    deleteTransport(transport) {
      if (confirm('Are you sure you want to delete this transport?')) {
        this.$http.delete(process.env.VUE_APP_REST_URL + '/transports/' + transport.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response) => {
            const index = this.transports.indexOf(transport);
            this.transports.splice(index, 1);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully deleted transport';
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
        this.editedTransport = { ...this.defaultTransport };
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          // Edit this transport. Save to DB
          this.$http.patch(process.env.VUE_APP_REST_URL + '/transports/' + this.editedTransport.id,
            {
              transport: {
                name: this.editedTransport.name,
                location: this.editedTransport.location,
                gst_no: this.editedTransport.gst_no,
              }
            },
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            })
            .then((response) => {
              // Edit transport in table on success
              Object.assign(this.transports[this.editedIndex], this.editedTransport);

              // Show success toast
              this.showToast = true;
              this.toastMessage = 'Successfully saved transport';
              this.toastColor = 'success';
              this.close();
            }, (response) => {
              // error callback. Show error alert
              this.showToast = true;
              this.toastMessage = 'Something went wrong';
              this.toastColor = 'error';
            });
        } else {
          // Add a new transport
          this.$http.post(process.env.VUE_APP_REST_URL + '/transports',
            {
              transport: {
                name: this.editedTransport.name,
                location: this.editedTransport.location,
                gst_no: this.editedTransport.gst_no,
              }
            },
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            })
            .then((response) => {
              // Edit transport in table on success
              this.transports.push(response.data);

              // Show success toast
              this.showToast = true;
              this.toastMessage = 'Successfully created transport';
              this.toastColor = 'success';
              this.close();
            }, (response) => {
              // error callback. Show error alert
              this.showToast = true;
              this.toastMessage = 'Something went wrong';
              this.toastColor = 'error';
            });
        }
      }
    },

    searchTransport() {
      const vm = this;
      if (vm.search !== '' && vm.search !== null) {
        if (vm.search.length > 2) {
          // eslint-disable-next-line no-underscore-dangle
          clearTimeout(this._searchTimerId);
          // eslint-disable-next-line no-underscore-dangle
          this._searchTimerId = setTimeout(() => {
            vm.$http.get(process.env.VUE_APP_REST_URL + '/transports?search_term=' + vm.search,
              {
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }).then((response) => {
              vm.setTransportsData(response.data);
              this.hideDataTableFooter = true;
              vm.totalRecords = response.data.total_records;
            }, (response) => {
            });
          }, 1000); /* 1000ms throttle */
        } else {
          this.getTransportsByPage(1);
          this.hideDataTableFooter = false;
        }
      } else {
        this.getTransportsByPage(1);
        this.hideDataTableFooter = false;
      }
    }
  }
};
</script>
