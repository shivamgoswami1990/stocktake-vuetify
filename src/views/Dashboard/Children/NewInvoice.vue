<template>
  <v-card color="secondary" flat>
    <v-card-title>Create new invoice</v-card-title>

    <v-card-text>
      <v-layout wrap>

        <v-flex md4>
          <v-card color="white" height="100%" justify-center v-if="stepValue <= 1" tile flat>
            <v-container fluid fill-height>
              <v-layout justify-center align-center>
                Choose customer to start
              </v-layout>
            </v-container>
          </v-card>

          <v-card class="hidden-sm-and-down" v-if="stepValue > 1" flat tile>

            <v-list two-line subheader>
              <v-subheader>Last invoice for customer</v-subheader>
              <p v-if="!isLastInvoiceForCustomerPresent" class="text-xs-center pl-4">No invoice present</p>
              <template v-if="isLastInvoiceForCustomerPresent">
                <v-list-item ripple>
                  <v-list-item-content>
                    <v-list-item-title>{{availableInvoiceNoForCustomer}}</v-list-item-title>
                    <v-list-item-subtitle>{{companyDetailsForCustomerInvoice.name}}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{companyDetailsForCustomerInvoice.city}}, {{companyDetailsForCustomerInvoice.state_name}} -
                      {{companyDetailsForCustomerInvoice.postcode}}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text>{{calendarDate(createdDateForCustomerInvoice)}}</v-list-item-action-text>
                  </v-list-item-action>

                </v-list-item>
              </template>
            </v-list>

            <v-divider></v-divider>

            <v-list two-line subheader v-if="stepValue > 2">
              <v-subheader>Last invoice for company</v-subheader>
              <p class="text-xs-center pl-4" v-if="!isLastInvoiceForCompanyPresent">No invoice present</p>
              <template v-if="isLastInvoiceForCompanyPresent">
                <v-list-item ripple>
                  <v-list-item-content>
                    <v-list-item-title>{{mostRecentInvoiceNoForCompany}}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text>{{calendarDate(createdDateForCompanyInvoice)}}</v-list-item-action-text>
                  </v-list-item-action>

                </v-list-item>
              </template>
            </v-list>

            <v-divider></v-divider>

            <v-list two-line subheader v-if="stepValue > 3">
              <v-subheader>Packaging details</v-subheader>
              <template>
                <v-list-item ripple>
                  <v-list-item-content>
                    <v-list-item-title>Selected</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text>{{selectedPackaging.name}}</v-list-item-action-text>
                  </v-list-item-action>

                </v-list-item>
              </template>
            </v-list>

          </v-card>
        </v-flex>

        <v-flex md8>
          <v-stepper v-model="stepValue" vertical class="elevation-0" style="border-radius: 0">

            <!-- Customer selection for this invoice -->
            <v-stepper-step :complete="stepValue > 1" step="1">
              <span> Select a customer
                <span v-if="stepValue > 1 && selectedCustomer !== undefined && selectedCustomer !== null"
                      class="font-weight-bold">
                  ({{selectedCustomer.name}})
                </span>
              </span>
              <small>Choose who this invoice is for.</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-flex>

                <v-autocomplete hide-no-data v-model="selectedCustomer"
                                :loading="isCustomerDataLoading" :items="customersList"
                                :search-input.sync="searchCustomer" item-text="name"
                                item-value="id" no-filter return-object clearable>

                  <template slot="item" slot-scope="{ item, tile }">
                    <v-list-item-avatar color="primary" class="headline font-weight-light white--text">
                      {{ item.name.charAt(0) }}
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.city + ', ' + item.state_name"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-btn color="primary" @click="getLastCreatedInvoiceForCustomer"
                     :disabled="checkSelectedCustomer" :loading="customerButtonLoading">
                Continue
              </v-btn>
            </v-stepper-content>
            <!-- Customer selection for this invoice -->

            <!-- Company selection for this invoice -->
            <v-stepper-step :complete="stepValue > 2" step="2">
              <span> Select a company
                <span v-if="stepValue > 2 && selectedCompany !== undefined && selectedCompany !== null"
                      class="font-weight-bold">
                  ({{selectedCompany.name}})
                </span>
              </span>
              <small>Choose which firm this invoice belongs to.</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-flex>
                <v-autocomplete v-model="selectedCompany" :items="companies"
                                item-text="name" item-value="id" return-object clearable>
                  <template slot="item" slot-scope="{ item, tile }">
                    <v-list-item-avatar color="primary" class="headline font-weight-light white--text">
                      {{ item.name.charAt(0) }}
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.city + ', ' + item.state_name"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-flex>

              <v-btn color="primary" @click="getLastCreatedInvoiceForCompany" :disabled="checkSelectedCompany"
                     :loading="companyButtonLoading">
                Continue
              </v-btn>
              <v-btn @click="stepValue = 1" text>Cancel</v-btn>
            </v-stepper-content>
            <!-- Company selection for this invoice -->

            <!-- Packaging selection for this invoice -->
            <v-stepper-step :complete="stepValue > 3" step="3">
              <span> Select a packaging
                <span v-if="stepValue > 3 && selectedPackaging !== undefined && selectedPackaging !== null"
                      class="font-weight-bold">
                  ({{selectedPackaging.name}})
                </span>
              </span>
              <small>Choose which units to apply for item quantities</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-flex>
                <v-select :items="packaging_options" color="primary" v-model="selectedPackaging"
                          item-text="name" return-object>
                </v-select>
              </v-flex>
              <v-btn color="primary" @click="stepValue = 4" :disabled="checkSelectedPackaging">
                Continue
              </v-btn>
              <v-btn @click="stepValue = 2" text>Cancel</v-btn>
            </v-stepper-content>
            <!-- Packaging selection for this invoice -->

            <!-- Invoice no & date selection for this invoice -->
            <v-stepper-step :complete="stepValue > 4" step="4">
              Select invoice no & date
              <small>Choose created date for invoice</small>
            </v-stepper-step>

            <v-stepper-content step="4">
              <v-layout wrap>
                <v-flex md6 class="pr-2">
                  <v-text-field v-model="selectedInvoiceNo" clearable type="number" label="Invoice No" persistent-hint>
                  </v-text-field>
                </v-flex>
                <v-flex md6 v-if="checkIfValidInvoiceNo" class="pl-2">

                  <v-menu v-model="menu" :close-on-content-click="false"
                          :nudge-right="40" transition="scale-transition" offset-y full-width
                          min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="selectedDate" readonly v-on="on"
                                    label="Invoice date"></v-text-field>
                    </template>
                    <v-date-picker v-model="selectedDate" scrollable first-day-of-week="1"
                                   color="primary" @input="menu = false" :min="previousInvoiceDate" :max="nextInvoiceDate">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout row wrap fill-height align-center justify-space-around class="secondary pa-2 mb-5">
                <v-flex v-for="(invoice, index, key) in recentInvoicesForCompany" :key="key">
                  <v-avatar :color="mostRecentInvoiceNoForCompany === invoice.invoice_no ? 'error':'primary'"
                            size="40" class="white--text font-weight-bold mx-auto d-flex">
                    {{invoice.invoice_no}}
                  </v-avatar>
                  <small :class="mostRecentInvoiceNoForCompany === invoice.invoice_no ? 'error--text':''"
                     class="font-weight-bold mb-0 text-center d-block">
                    {{calendarDate(invoice.invoice_date)}}
                  </small>
                </v-flex>
              </v-layout>

              <v-btn color="primary" @click="newInvoiceBtnClicked" :loading="createInvoiceButtonLoading">
                Finish
              </v-btn>
              <v-btn @click="stepValue = 3" text>Cancel</v-btn>
            </v-stepper-content>
            <!-- Invoice no & date selection for this invoice -->

          </v-stepper>
        </v-flex>

      </v-layout>
    </v-card-text>

    <v-dialog v-model="showSkippedInvoiceNoDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="title font-weight-bold justify-center secondary">
          You are about to skip invoice number. Are you sure ?
        </v-card-title>

        <v-card-actions>
          <v-btn color="secondary" depressed width="48%"
                 @click.native="showSkippedInvoiceNoDialog = false">Cancel</v-btn>
          <v-btn color="primary" depressed width="48%" @click="createNewInvoice">Yes, proceed</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showToast" color="error" :timeout=7000 bottom right>
      {{ toastMessage }}
      <v-btn dark text @click="showToast = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      stepValue: 0,
      searchCustomer: null,
      customersList: [],
      isCustomerDataLoading: false,
      companies: [],
      menu: false,
      selectedDate: new Date().toJSON().slice(0, 10),
      packaging_options: [
        { id: 1, name: 'kg/dozen/piece' },
        { id: 2, name: 'litre' }
      ],
      selectedCustomer: '',
      selectedCompany: '',
      selectedPackaging: '',
      selectedInvoiceNo: '',
      nextInvoiceNo: '',
      customerButtonLoading: false,
      companyButtonLoading: false,
      createInvoiceButtonLoading: false,
      isLastInvoiceForCustomerPresent: false,
      isLastInvoiceForCompanyPresent: false,
      showToast: false,
      toastMessage: '',
      availableInvoiceNoForCustomer: '',
      createdDateForCustomerInvoice: '',
      companyDetailsForCustomerInvoice: '',
      mostRecentInvoiceNoForCompany: '',
      createdDateForCompanyInvoice: '',
      recentInvoicesForCompany: [],
      previousInvoiceDate: null,
      nextInvoiceDate: null,
      showSkippedInvoiceNoDialog: false
    };
  },

  computed: {
    checkSelectedCustomer() {
      if (this.selectedCustomer !== undefined && this.selectedCustomer !== null) {
        if (typeof this.selectedCustomer === 'object') {
          return this.selectedCustomer.id === undefined && this.selectedCustomer.id === null;
        }
        return true;
      }
      return true;
    },
    checkSelectedCompany() {
      if (this.selectedCompany !== undefined && this.selectedCompany !== null) {
        if (typeof this.selectedCompany === 'object') {
          return this.selectedCompany.id === undefined && this.selectedCompany.id === null;
        }
        return true;
      }
      return true;
    },
    checkSelectedPackaging() {
      if (this.selectedPackaging !== undefined && this.selectedPackaging !== null) {
        if (typeof this.selectedPackaging === 'object') {
          return this.selectedPackaging.id === undefined && this.selectedPackaging.id === null;
        }
        return true;
      }
      return true;
    },
    checkIfValidInvoiceNo() {
      const vm = this;
      if (this.selectedInvoiceNo !== undefined && this.selectedInvoiceNo !== null) {
        if (isNaN(parseInt(this.selectedInvoiceNo)) === false) {
          if (parseInt(this.stepValue) > 3) {
            // Get next and previous invoice details
            this.$http.get(process.env.VUE_APP_REST_URL + '/previous_and_next_invoice?for_invoice_no_as_int='
                + parseInt(this.selectedInvoiceNo) + '&company_id=' + this.selectedCompany.id + '&financial_year='
                + vm.currentlySelectedFinancialYear,
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }).then((response) => {
              if (response.data !== undefined && response.data !== null) {
                if (typeof response.data === 'object') {
                  // Set previous & next invoice dates as min & max
                  if (response.data.previous_invoice !== undefined && response.data.previous_invoice !== null) {
                    vm.previousInvoiceDate = response.data.previous_invoice.invoice_date.split('T')[0];
                  } else {
                    vm.previousInvoiceDate = null;
                  }

                  if (response.data.next_invoice !== undefined && response.data.next_invoice !== null) {
                    vm.nextInvoiceDate = response.data.next_invoice.invoice_date.split('T')[0];
                  } else {
                    vm.nextInvoiceDate = null;
                  }
                }
              }
            }, (response) => {
            });
            return true;
          }
        } else {
          return false;
        }
      }
    }
  },

  watch: {
    searchCustomer(val) {
      if (val !== undefined && val !== null) {
        if (val.length > 2) {
          const vm = this;
          vm.isCustomerDataLoading = true;

          this.$http.get(process.env.VUE_APP_REST_URL + '/customers?search_term=' + val,
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            })
            .then((response) => {
              vm.customersList = response.data.data;
              vm.isCustomerDataLoading = false;
              return response.data;
            }, (response) => {
              vm.isCustomerDataLoading = false;
            });
        }
      }
    }
  },

  methods: {
    getLastCreatedInvoiceForCustomer() {
      const vm = this;
      vm.customerButtonLoading = true;
      this.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.selectedCustomer.id
        + '/last_created_invoice?financial_year=' + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        if (typeof response.data === 'object') {
          vm.availableInvoiceNoForCustomer = response.data.invoice_no;
          vm.createdDateForCustomerInvoice = response.data.invoice_date.split('T')[0];
          vm.companyDetailsForCustomerInvoice = response.data.company_details;
          vm.isLastInvoiceForCustomerPresent = true;
        } else {
          vm.isLastInvoiceForCustomerPresent = false;
        }

        // Load companies for the next step
        vm.$http.get(process.env.VUE_APP_REST_URL + '/companies',
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          vm.stepValue = 2;
          vm.companies = response.data;
        }, (response) => {
        });

        // Go to company selection step
        vm.customerButtonLoading = false;
      }, (response) => {
        vm.customerButtonLoading = false;
      });
    },

    getLastCreatedInvoiceForCompany() {
      const vm = this;
      vm.companyButtonLoading = true;
      this.$http.get(process.env.VUE_APP_REST_URL + '/companies/' + this.selectedCompany.id
        + '/last_created_invoice?financial_year=' + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        if (response.data !== undefined && response.data !== null) {
          if (typeof response.data === 'object') {
            if (response.data.invoice_no !== '') {
              vm.isLastInvoiceForCompanyPresent = true;
              vm.selectedInvoiceNo = parseInt(response.data.invoice_no, 10) + 1;
              vm.nextInvoiceNo = vm.selectedInvoiceNo;
              vm.mostRecentInvoiceNoForCompany = response.data.invoice_no;
              vm.createdDateForCompanyInvoice = response.data.invoice_date.split('T')[0];
              vm.recentInvoicesForCompany = response.data.five_recent_invoices;
            } else {
              vm.isLastInvoiceForCompanyPresent = false;
              vm.selectedInvoiceNo = '';
            }
          } else {
            vm.isLastInvoiceForCompanyPresent = false;
          }
        } else {
          vm.isLastInvoiceForCompanyPresent = false;
        }
        // Go to date selection step
        vm.companyButtonLoading = false;
        vm.stepValue = 3;
      }, (response) => {
        vm.companyButtonLoading = false;
      });
    },

    createNewInvoice() {
      // Copy the contents of the customer & company to invoice object
      const companyDetails = JSON.parse(JSON.stringify(this.selectedCompany));
      const consigneeDetails = JSON.parse(JSON.stringify(this.selectedCustomer));

      const companyId = companyDetails.id;
      const customerId = consigneeDetails.id;
      const invoiceDate = this.selectedDate;
      const dated = invoiceDate;
      const deliveryNoteDate = invoiceDate;
      const brandName = companyDetails.brand_name;
      const buyerAadhar = consigneeDetails.aadhar_no;

      const fieldsToBeRemoved = ['id', 'brand_name', 'hsn_list', 'created_at', 'updated_at'];

      // Remove the fields from company_details & consignee details object
      fieldsToBeRemoved.forEach((v, k) => {
        if (v in companyDetails) {
          delete companyDetails[v];
        }
        if (v in consigneeDetails) {
          delete consigneeDetails[v];
        }
      });

      const buyerDetails = consigneeDetails;

      const itemArray = [];

      // Initialise details based on - if same state invoice
      let isSameStateInvoice = 0;
      let itemSummary;
      if (companyDetails.state_name.toLowerCase() === consigneeDetails.state_name.toLowerCase()) {
        // Initialise CGST/SGST details
        isSameStateInvoice = 1;

        itemSummary = {
          items_amount_sum: 0,
          insurance_percentage: 0,
          insurance_percentage_amount: 0,
          amount_after_insurance: 0,
          postage_charge: 0,
          discount: 0,
          amount_after_postage: 0,
          cgst_percentage: 9,
          cgst_percentage_amount: 0,
          sgst_percentage: 9,
          sgst_percentage_amount: 0,
          round_off_difference_polarity: '+',
          round_off_difference: 0,
          total_quantity_sum: 0,
          total_after_round_off: 0
        };
      } else {
        isSameStateInvoice = 0;

        itemSummary = {
          items_amount_sum: 0,
          insurance_percentage: 0,
          insurance_percentage_amount: 0,
          amount_after_insurance: 0,
          postage_charge: 0,
          discount: 0,
          amount_after_postage: 0,
          igst_percentage: 18,
          igst_percentage_amount: 0,
          round_off_difference_polarity: '+',
          round_off_difference: 0,
          total_quantity_sum: 0,
          total_after_round_off: 0
        };
      }

      const packagingType = this.selectedPackaging.id;

      // AJAX call for creating new invoice
      const vm = this;
      vm.createInvoiceButtonLoading = true;
      this.$http.post(process.env.VUE_APP_REST_URL + '/invoices',
        JSON.stringify({
          invoice: {
            invoice_no: vm.selectedInvoiceNo,
            invoice_no_as_int: parseInt(vm.selectedInvoiceNo, 10),
            is_same_state_invoice: isSameStateInvoice,
            packaging_type: packagingType,
            company_details: companyDetails,
            consignee_details: consigneeDetails,
            buyer_details: buyerDetails,
            invoice_date: invoiceDate,
            dated,
            delivery_note_date: deliveryNoteDate,
            delivery_note: vm.selectedInvoiceNo,
            brand_name: brandName,
            goods_description: 'SYNTHETIC PERFUMERY COMPOUND',
            item_array: itemArray,
            item_summary: itemSummary,
            buyer_aadhar: buyerAadhar,
            user_id: JSON.parse(localStorage.user_info).id,
            customer_id: customerId,
            company_id: companyId,
            last_edited_by_id: JSON.parse(localStorage.user_info).id,
            despatched_through: consigneeDetails.transport_name,
            financial_year: vm.currentlySelectedFinancialYear
          }
        }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.createInvoiceButtonLoading = false;
        vm.$router.push({ path: '/dashboard/editInvoice/' + response.data.id }); // Navigate to invoice using router property
      }, (response) => {
        // error callback. Show error alert
        vm.createInvoiceButtonLoading = false;

        if (response.status === 400) {
          if (typeof response.data === 'object') {
            if (response.data.data !== undefined && response.data.data !== null) {
              vm.showToast = true;
              vm.toastMessage = response.data.data;
            }
          }
        }
      });
    },

    newInvoiceBtnClicked() {
      if (parseInt(this.mostRecentInvoiceNoForCompany, 10) + 1 === parseInt(this.selectedInvoiceNo, 10)) {
        this.createNewInvoice();
      } else {
        this.showSkippedInvoiceNoDialog = true;
      }
    }
  }
};
</script>
