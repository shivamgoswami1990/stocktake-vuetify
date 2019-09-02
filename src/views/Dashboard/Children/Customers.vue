<template>
  <v-card flat>

    <component :is="sampleCommentsComponent" :data="selectedCustomer" />
    <component :is="customerBookComponent" :data="selectedCustomer" :showAddItemBtn="false"/>

    <v-card-title>
      Customers list
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

        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card>
            <v-card-title class="headline justify-center">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-layout wrap>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedCustomer.name" :rules="[rules.required]" label="Name" clearable>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedCustomer.st_address" label="Street address" clearable>
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-combobox v-model="editedCustomer.city" label="City" :items="cities"
                                item-text="name" return-object @input="setCity">
                    </v-combobox>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-combobox v-model="editedCustomer.state_name" :rules="[rules.required]" label="State"
                                :items="states" item-text="name" return-object @change="setState">
                    </v-combobox>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.code" label="Code" disabled></v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.postcode" type="number" clearable
                                  label="Postcode" :rules="[rules.postcode]">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.phone_no" label="Phone no" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.contact_email" label="Email" clearable
                                  :rules="[rules.email]">
                    </v-text-field>
                  </v-flex>


                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.gstin_no" label="GSTIN no" clearable
                                  :rules="[rules.gstin]">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.pan_no" label="PAN no" clearable :rules="[rules.pan]">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCustomer.aadhar_no" label="Aadhar no" clearable>
                    </v-text-field>
                  </v-flex>


                  <v-flex xs4 sm4 md3>
                    <v-text-field v-model="editedCustomer.primary_discount" label="Primary discount"
                                  clearable type="number" prefix="%">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md3>
                    <v-text-field v-model="editedCustomer.secondary_discount" label="Secondary discount"
                                  clearable type="number" prefix="%">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md6>
                    <v-text-field v-model="editedCustomer.transport_name" label="Transport name" clearable>
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md6>
                    <v-switch v-model="editedCustomer.freight_allowed" color="primary"
                              :label="editedCustomer.freight_allowed ? 'Allowed' : 'Not allowed'"
                              hint="Enable/disable freight" persistent-hint>
                    </v-switch>
                  </v-flex>

                  <v-flex xs4 sm4 md6>
                    <v-select :items="freight_options" :disabled="!editedCustomer.freight_allowed" color="primary"
                              label="Frieght type" v-model="editedCustomer.freight_type"></v-select>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model="editedCustomer.notes" label="Notes" clearable auto-grow>
                    </v-textarea>
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
      <v-data-table :headers="headers" :items="customers" :loading="isDataLoading"
                    :search="search" multi-sort>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" color="info"
                  v-if="userDetails().permissions.customer.edit">mdi-border-color</v-icon>
          <v-icon small class="mr-2" @click="showCustomerBook(item)" color="secondary"
                  v-if="userDetails().permissions.customer.edit">mdi-folder</v-icon>
          <v-icon small class="mr-2" @click="showSampleComments(item)" color="primary"
                  v-if="userDetails().permissions.customer.edit">mdi-message-reply</v-icon>
          <v-icon small @click="deleteItem(item)" color="secondary"
                  v-if="userDetails().permissions.customer.delete">mdi-delete</v-icon>
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
      customerBookComponent: null,
      sampleCommentsComponent: null,
      selectedCustomer: [],
      isDataLoading: true,
      search: '',
      dialog: false,
      editedIndex: -1,
      cities,
      states,
      freight_options: ['HALF', 'FULL'],
      valid: false,
      show: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: v => this.validateFormRules(v, 'lte', 20, 'Max 20 characters'),
        min: v => this.validateFormRules(v, 'gte', 8, 'Min 8 characters'),
        postcode: (v) => {
          if (v !== undefined && v !== null) {
            if (v.length > 0) {
              return this.validateFormRules(v, 'e', 6, 'Exact 6 digits');
            }
            return true;
          }
          return true;
        },
        gstin: (v) => {
          if (v !== undefined && v !== null) {
            if (v.length > 0) {
              return this.validateFormRules(v, 'e', 15, 'Exact 15 digits');
            }
            return true;
          }
          return true;
        },
        pan: v => this.validatePan(v, 10, 'Exact 10 digits'),
        email: (v) => {
          if (v !== undefined && v !== null) {
            if (v.length > 0) {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return pattern.test(v) || 'Invalid e-mail.';
            }
            return true;
          }
          return true;
        }
      },
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      defaultCustomer: {
        name: '',
        st_address: '',
        city: '',
        state_name: '',
        postcode: '',
        phone_no: '',
        contact_email: '',
        code: '',
        gstin_no: '',
        pan_no: '',
        primary_discount: 0,
        secondary_discount: 0,
        freight_allowed: false,
        freight_type: 'HALF',
        aadhar_no: '',
        transport_name: '',
        notes: ''
      },
      editedCustomer: {
        name: '',
        st_address: '',
        city: {
          name: '',
          state: ''
        },
        state_name: '',
        postcode: '',
        phone_no: '',
        contact_email: '',
        code: '',
        gstin_no: '',
        pan_no: '',
        primary_discount: 0,
        secondary_discount: 0,
        freight_allowed: false,
        freight_type: 'HALF',
        aadhar_no: '',
        transport_name: '',
        notes: ''
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Invoices',
          value: 'invoice_count'
        },
        {
          text: 'City',
          value: 'city'
        },
        {
          text: 'State',
          value: 'state'
        },
        {
          text: 'Code',
          value: 'code'
        },
        {
          text: 'Phone no',
          value: 'phone_no'
        },
        {
          text: 'GSTIN no',
          value: 'gstin_no'
        },
        {
          text: 'PAN no',
          value: 'pan_no'
        },
        {
          text: 'Actions', value: 'actions', sortable: false, align: 'center'
        }
      ],
      customers: []
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new customer' : 'Edit an existing customer';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/customers',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setCustomersData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
    setCustomersData(data) {
      this.customers = data;
      this.isDataLoading = false;
    },

    validatePan(value, limit, msg) {
      if (value !== undefined && value !== null) {
        if (value !== '') {
          return value.length === limit || msg;
        }
        return true;
      }
      return true;
    },

    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedCustomer = Object.assign({}, item);
      this.dialog = true;
    },

    setCity() {
      // On city select, set the city model correctly by comparing with states list
      const vm = this;
      if (vm.editedCustomer !== undefined && vm.editedCustomer !== null) {
        const selectedCity = vm.editedCustomer.city;
        const selectedStateFromCity = selectedCity.state.replace(/\s/g, '').toLowerCase();

        // Loop through states list to determine a match
        vm.states.forEach((state) => {
          if (selectedStateFromCity === state.name.replace(/\s/g, '').toLowerCase()) {
            vm.editedCustomer.state_name = state.name;
            vm.editedCustomer.code = state.tin_no;

            // Set the city model correctly
            vm.editedCustomer.city = selectedCity.name;
          }
        });
      }
    },

    setState() {
      // On state select, set the state model correctly. And the code model.
      if (this.editedCustomer.state_name !== undefined && this.editedCustomer.state_name !== null) {
        if (typeof this.editedCustomer.state_name === 'object') {
          this.editedCustomer.code = this.editedCustomer.state_name.tin_no;
          this.editedCustomer.state_name = this.editedCustomer.state_name.name;
        }
      }
    },

    deleteItem(item) {
      if (confirm('Are you sure you want to delete this customer?')) {
        this.$http.delete(process.env.VUE_APP_REST_URL + '/customers/' + item.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          const index = this.customers.indexOf(item);
          this.customers.splice(index, 1);

          // Show success toast
          this.showToast = true;
          this.toastMessage = 'Successfully deleted customer';
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
        this.editedCustomer = Object.assign({}, this.defaultCustomer);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          // Edit this customer. Save to DB
          this.$http.patch(process.env.VUE_APP_REST_URL + '/customers/' + this.editedCustomer.id,
            {
              customer: {
                name: this.editedCustomer.name,
                st_address: this.editedCustomer.st_address,
                city: this.editedCustomer.city,
                postcode: this.editedCustomer.postcode,
                phone_no: this.editedCustomer.phone_no,
                contact_email: this.editedCustomer.contact_email,
                state_name: this.editedCustomer.state_name,
                code: this.editedCustomer.code,
                gstin_no: this.editedCustomer.gstin_no,
                pan_no: this.editedCustomer.pan_no,
                primary_discount: this.editedCustomer.primary_discount,
                secondary_discount: this.editedCustomer.secondary_discount,
                transport_name: this.editedCustomer.transport_name,
                notes: this.editedCustomer.notes,
                freight_allowed: this.editedCustomer.freight_allowed,
                freight_type: this.editedCustomer.freight_type,
                aadhar_no: this.editedCustomer.aadhar_no
              }
            },
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }).then((response) => {
            // Edit item in table on success
            Object.assign(this.customers[this.editedIndex], this.editedCustomer);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully saved customer';
            this.toastColor = 'success';
          }, (response) => {
            // error callback. Show error alert
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
          this.close();
        } else {
          // Add a new customer
          this.$http.post(process.env.VUE_APP_REST_URL + '/customers',
            {
              customer: {
                name: this.editedCustomer.name,
                st_address: this.editedCustomer.st_address,
                city: this.editedCustomer.city,
                postcode: this.editedCustomer.postcode,
                phone_no: this.editedCustomer.phone_no,
                contact_email: this.editedCustomer.contact_email,
                state_name: this.editedCustomer.state_name,
                code: this.editedCustomer.code,
                gstin_no: this.editedCustomer.gstin_no,
                pan_no: this.editedCustomer.pan_no,
                primary_discount: this.editedCustomer.primary_discount,
                secondary_discount: this.editedCustomer.secondary_discount,
                transport_name: this.editedCustomer.transport_name,
                notes: this.editedCustomer.notes,
                freight_allowed: this.editedCustomer.freight_allowed,
                freight_type: this.editedCustomer.freight_type,
                aadhar_no: this.editedCustomer.aadhar_no,
                last_edited_by_id: JSON.parse(localStorage.user_info).id
              }
            },
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }).then((response) => {
            // Edit item in table on success
            if (response.status === 201) {
              this.customers.push(response.data);

              // Show success toast
              this.showToast = true;
              this.toastMessage = 'Successfully created customer';
              this.toastColor = 'success';
              this.close();
            }
          }, (response) => {
            // error callback. Show error alert
            if (response.status === 409) {
              this.showToast = true;
              this.toastMessage = 'Customer already exists with GSTIN No';
              this.toastColor = 'error';
            } else {
              this.showToast = true;
              this.toastMessage = 'Something went wrong';
              this.toastColor = 'error';
            }
          });
        }
      }
    },

    showCustomerBook(customer) {
      this.selectedCustomer = customer;
      this.customerBookComponent = () => import('../../../components/CustomerBook.vue');
    },

    showSampleComments(customer) {
      this.selectedCustomer = customer;
      this.sampleCommentsComponent = () => import('../../../components/SampleComments.vue');
    }
  }
};
</script>