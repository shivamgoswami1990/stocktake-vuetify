<template>
  <v-card flat>
    <v-card-title>
      Companies list
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
                    <v-text-field v-model="editedCompany.name" :rules="[rules.required]"
                                  label="Name" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedCompany.st_address" label="Street address"
                                  clearable class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-combobox v-model="editedCompany.city" label="City" :items="cities"
                                item-text="name" return-object @change="setCity" class="pa-1">
                    </v-combobox>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-combobox v-model="editedCompany.state_name" label="State" :items="states"
                                item-text="name" return-object @change="setState" class="pa-1">
                    </v-combobox>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.code" label="Code" disabled class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.postcode" type="number" clearable
                                  label="Postcode" :rules="[rules.postcode]" class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.phone_no" label="Phone no" clearable class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.contact_email" label="Email"
                                  clearable persistent-hint class="pa-1"
                                  :rules="[rules.counter, rules.email]" hint="proper email required">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.brand_name" label="Brand name"
                                  class="pa-1" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.gstin_no" label="GSTIN no"
                                  class="pa-1" clearable :rules="[rules.gstin]">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.pan_no" label="PAN no" clearable
                                  class="pa-1" :rules="[rules.pan, rules.required]">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.bank_name" label="Bank name"
                                  class="pa-1" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.bank_account_no" label="Bank acc no"
                                  class="pa-1" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-text-field v-model="editedCompany.bank_branch" label="Bank branch"
                                  class="pa-1" clearable></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-combobox v-model="editedCompany.hsn_list" type="number" label="HSN/SAC tags"
                                class="pa-1" multiple chips>
                    </v-combobox>
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
      <v-data-table :headers="headers" :items="companies" :loading="isDataLoading"
                    :search="search" multi-sort>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" v-if="userDetails().permissions.company.edit">
            mdi-pencil</v-icon>
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
      search: '',
      dialog: false,
      editedIndex: -1,
      cities,
      states,
      valid: false,
      show: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 30 || 'Max 30 characters',
        min: v => v.length >= 8 || 'Min 8 characters',
        postcode: (v) => {
          if (v !== undefined && v !== null) {
            if (v.length > 0) {
              return this.validateFormRules(v, 'e', 6, 'Exact 6 digits');
            }
            return true;
          }
          return true;
        },
        gstin: v => v.length === 15 || 'Exact 15 characters',
        pan: v => v.length === 10 || 'Exact 10 characters',
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
      defaultCompany: {
        name: '',
        st_address: '',
        city: '',
        state_name: '',
        postcode: '',
        phone_no: '',
        contact_email: '',
        code: '',
        hsn_list: [],
        brand_name: '',
        gstin_no: '',
        pan_no: '',
        bank_name: '',
        bank_account_no: '',
        bank_branch: ''
      },
      editedCompany: {
        name: '',
        st_address: '',
        city: '',
        state_name: '',
        postcode: '',
        phone_no: '',
        contact_email: '',
        code: '',
        hsn_list: [],
        brand_name: '',
        gstin_no: '',
        pan_no: '',
        bank_name: '',
        bank_account_no: '',
        bank_branch: ''
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
      companies: []
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new company' : 'Edit an existing company';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/companies',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setCompaniesData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
    setCompaniesData(data) {
      this.companies = data;
      this.isDataLoading = false;
    },

    editItem(item) {
      this.editedIndex = this.companies.indexOf(item);
      this.editedCompany = Object.assign({}, item);
      this.dialog = true;
    },

    setCity() {
      // On city select, set the city model correctly by comparing with states list
      if (this.editedCompany.city !== undefined && this.editedCompany.city !== null) {
        if (typeof this.editedCompany.city === 'object') {
          const selectedStateFromCity = this.editedCompany.city.state.replace(/\s/g, '').toLowerCase();

          // Loop through states list to determine a match
          const vm = this;
          this.states.forEach((state) => {
            if (selectedStateFromCity === state.name.replace(/\s/g, '').toLowerCase()) {
              vm.editedCompany.state_name = state.name;
              vm.editedCompany.code = state.tin_no;

              // Set the city model correctly
              vm.editedCompany.city = vm.editedCompany.city.name;
            }
          });
        }
      }
    },

    setState() {
      // On state select, set the state model correctly. And the code model.
      if (this.editedCompany.state_name !== undefined && this.editedCompany.state_name !== null) {
        if (typeof this.editedCompany.state_name === 'object') {
          this.editedCompany.code = this.editedCompany.state_name.tin_no;
          this.editedCompany.state_name = this.editedCompany.state_name.name;
        }
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedCompany = Object.assign({}, this.defaultCompany);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        // Edit this company. Save to DB
        this.$http.patch(process.env.VUE_APP_REST_URL + '/companies/' + this.editedCompany.id,
          {
            company: {
              name: this.editedCompany.name,
              st_address: this.editedCompany.st_address,
              city: this.editedCompany.city,
              postcode: this.editedCompany.postcode,
              phone_no: this.editedCompany.phone_no,
              contact_email: this.editedCompany.contact_email,
              state_name: this.editedCompany.state_name,
              code: this.editedCompany.code,
              gstin_no: this.editedCompany.gstin_no,
              pan_no: this.editedCompany.pan_no,
              brand_name: this.editedCompany.brand_name,
              bank_name: this.editedCompany.bank_name,
              bank_account_no: this.editedCompany.bank_account_no,
              bank_branch: this.editedCompany.bank_branch,
              hsn_list: this.editedCompany.hsn_list
            }
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          // Edit item in table on success
          Object.assign(this.companies[this.editedIndex], this.editedCompany);

          // Show success toast
          this.showToast = true;
          this.toastMessage = 'Successfully saved company';
          this.toastColor = 'success';
        }, (response) => {
          // error callback. Show error alert
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        });
      } else {
        // Add a new company
        this.$http.post(process.env.VUE_APP_REST_URL + '/companies',
          {
            company: {
              name: this.editedCompany.name,
              st_address: this.editedCompany.st_address,
              city: this.editedCompany.city,
              postcode: this.editedCompany.postcode,
              phone_no: this.editedCompany.phone_no,
              contact_email: this.editedCompany.contact_email,
              state_name: this.editedCompany.state_name,
              code: this.editedCompany.code,
              gstin_no: this.editedCompany.gstin_no,
              pan_no: this.editedCompany.pan_no,
              brand_name: this.editedCompany.brand_name,
              bank_name: this.editedCompany.bank_name,
              bank_account_no: this.editedCompany.bank_account_no,
              bank_branch: this.editedCompany.bank_branch,
              hsn_list: this.editedCompany.hsn_list
            }
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          // Edit item in table on success
          this.companies.push(response.data);

          // Show success toast
          this.showToast = true;
          this.toastMessage = 'Successfully created company';
          this.toastColor = 'success';
        }, (response) => {
          // error callback. Show error alert
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        });
      }
      this.close();
    }
  }
};
</script>
