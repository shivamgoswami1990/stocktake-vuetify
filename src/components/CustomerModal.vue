<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
      <v-card>
        <v-card-title class="headline justify-center">
          <span class="headline">Add customer</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-layout wrap>

              <v-flex xs6 sm6 md6>
                <v-text-field v-model="editedCustomer.name" :rules="[rules.required]"
                              label="Name" clearable class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field v-model="editedCustomer.st_address" label="Street address"
                              clearable class="pa-1">
                </v-text-field>
              </v-flex>

              <v-flex xs4 sm4 md4>
                <v-combobox v-model="editedCustomer.city" label="City" :items="cities"
                            item-text="name" return-object @input="setCity" class="pa-1">
                </v-combobox>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-combobox v-model="editedCustomer.state_name" :rules="[rules.required]" label="State"
                            :items="states" item-text="name" return-object @change="setState" class="pa-1">
                </v-combobox>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.code" label="Code" disabled class="pa-1">
                </v-text-field>
              </v-flex>

              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.postcode" type="number" clearable
                              label="Postcode" :rules="[rules.postcode]" class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.phone_no" label="Phone no" clearable class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.contact_email" label="Email" clearable
                              :rules="[rules.email]" class="pa-1">
                </v-text-field>
              </v-flex>


              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.gstin_no" label="GSTIN no" clearable
                              :rules="[rules.gstin]" @input="setPanNo" class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.pan_no" label="PAN no" clearable
                              :rules="[rules.pan]" class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.aadhar_no" label="Aadhar no"
                              clearable class="pa-1">
                </v-text-field>
              </v-flex>


              <v-flex xs4 sm4 md6>
                <v-text-field v-model="editedCustomer.primary_discount" label="Primary discount"
                              clearable type="number" prefix="%" class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md6>
                <v-text-field v-model="editedCustomer.secondary_discount" label="Secondary discount"
                              clearable type="number" prefix="%" class="pa-1">
                </v-text-field>
              </v-flex>

              <v-flex xs4 sm4 md4>
                <v-combobox v-model="editedCustomer.transport_name" label="Transport name"
                            :items="transports" item-text="name" item-value="id" class="pa-1"
                            hide-details return-object @input="setTransportDetails">
                  <template slot="item" slot-scope="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"/>
                      <v-list-item-subtitle>
                        <b>Location</b> - {{item.location}} |
                        <b>GST No</b> - {{item.gst_no}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.destination" label="Destination"
                              clearable class="pa-1">
                </v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <v-text-field v-model="editedCustomer.transport_gst_no" label="Transport GST No"
                              :rules="[rules.gstin]" clearable class="pa-1">
                </v-text-field>
              </v-flex>

              <v-flex xs4 sm4 md6>
                <v-switch v-model="editedCustomer.freight_allowed" color="primary"
                          :label="editedCustomer.freight_allowed ? 'Allowed' : 'Not allowed'"
                          hint="Enable/disable freight" persistent-hint class="pa-1">
                </v-switch>
              </v-flex>

              <v-flex xs4 sm4 md6>
                <v-select :items="freight_options" :disabled="!editedCustomer.freight_allowed" color="primary"
                          label="Frieght type" v-model="editedCustomer.freight_type" class="pa-1"></v-select>
              </v-flex>

              <v-flex xs12 sm12 md12>
                <v-textarea v-model="editedCustomer.notes" label="Notes" clearable auto-grow class="pa-1">
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
</template>

<script>
import cities from '@/cities.json';
import states from '@/states.json';

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      cities,
      states,
      freight_options: ['HALF', 'FULL'],
      valid: false,
      rules: {
        required: (value) => !!value || 'Required.',
        counter: (v) => this.validateFormRules(v, 'lte', 20, 'Max 20 characters'),
        min: (v) => this.validateFormRules(v, 'gte', 8, 'Min 8 characters'),
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
        pan: (v) => this.validatePan(v, 10, 'Exact 10 digits'),
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
        destination: '',
        transport_gst_no: '',
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
        destination: '',
        transport_gst_no: '',
        notes: ''
      },
      transports: [],
      isEdit: false
    };
  },

  watch: {
    data(newVal) {
      if (newVal !== undefined && newVal !== null) {
        if (typeof newVal === 'object') {
          if (Object.keys(newVal).length > 0) {
            this.editedCustomer = newVal;
            this.isEdit = true;
          }
        }
      }
    }
  },

  created() {
    this.$http.get(process.env.VUE_APP_REST_URL + '/transports',
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
      this.transports = response.data;
    }, (response) => {
    });
  },

  methods: {
    close() {
      this.$emit('update:dialog', false);
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
            vm.setGSTINModelOnCodeChange(vm.editedCustomer.code);

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

          this.setGSTINModelOnCodeChange(this.editedCustomer.code);
          // Once the code is set, set the two digits of code to GSTIN model
          this.editedCustomer.gstin_no = this.editedCustomer.code;
        }
      }
    },

    setPanNo() {
      // As gstin no is typed, except the first two digits,
      // set pan no model to typed value up till 12th index.
      if (this.editedCustomer.gstin_no.length > 2 && this.editedCustomer.gstin_no.length < 13) {
        this.editedCustomer.pan_no += this.editedCustomer.gstin_no.slice(-1);
      }
    },

    setGSTINModelOnCodeChange(code) {
      this.editedCustomer.gstin_no = code;
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

    setTransportDetails() {
      if (this.editedCustomer.transport_name !== undefined && this.editedCustomer.transport_name !== null) {
        if (typeof this.editedCustomer.transport_name === 'object') {
          this.editedCustomer.transport_gst_no = this.editedCustomer.transport_name.gst_no;
          this.editedCustomer.transport_name = this.editedCustomer.transport_name.name;
        }
      }
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.isEdit) {
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
                transport_gst_no: this.editedCustomer.transport_gst_no,
                destination: this.editedCustomer.destination,
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
            this.$emit('successResponse', {
              type: 'edit',
              index: this.index,
              data: response.data
            });

            // Reset the form after successful edit
            this.editedCustomer = this.defaultCustomer;

            // Close the modal on sucess
            this.close();
          }, (response) => {
            this.$emit('errorResponse', {
              type: 'edit'
            });
          });
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
                transport_gst_no: this.editedCustomer.transport_gst_no,
                destination: this.editedCustomer.destination,
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
              this.$emit('successResponse', {
                type: 'add',
                data: response.data
              });
            }

            // Close the modal on sucess
            this.close();
          }, (response) => {
            this.$emit('errorResponse', {
              type: 'add',
              status: response.status
            });
          });
        }
      }
    },
  }
};
</script>
