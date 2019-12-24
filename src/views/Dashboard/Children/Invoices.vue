<template>
  <v-card color="secondary" flat>

    <v-card-title>Invoice list</v-card-title>

    <v-card-text>
      <v-card flat tile>
        <v-container fill-height fluid>
          <v-layout fill-height row justify-space-around>

            <v-flex md2 xs12>
              <v-autocomplete v-model="selectedCompany" :items="companies"
                              item-text="name" item-value="id" label="Select a company ..."
                              return-object clearable :loading="isCompaniesDataLoading" @change="companySelected">
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

            <v-flex md2 xs12>
              <v-autocomplete v-model="selectedCustomer" :items="customers"
                              item-text="name" item-value="id" label="Select a customer ..."
                              return-object clearable :loading="isCustomersDataLoading" @change="customerSelected">
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

            <v-flex md1 xs12>
              <v-menu v-model="menu" :close-on-content-click="false"
                      :nudge-right="40" transition="scale-transition" offset-y
                      min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="selectedMonth" readonly v-on="on"
                                label="Invoice date"></v-text-field>
                </template>
                <v-date-picker v-model="selectedMonth" scrollable first-day-of-week="1"
                               color="primary" @input="menu = false" type="month" @change="monthSelected">
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex md3 xs12>
              <v-layout row wrap>
                <v-flex md6 class="pr-2">
                  <v-menu v-model="fromDateMenu" :close-on-content-click="false"
                          :nudge-right="40" transition="scale-transition" offset-y
                          min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="fromDate" readonly v-on="on"
                                    label="From date"></v-text-field>
                    </template>
                    <v-date-picker v-model="fromDate" scrollable first-day-of-week="1"
                                   color="primary" @input="fromDateMenu = false" @change="fromDateSelected">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex md6 class="pr-2">
                  <v-menu v-model="toDateMenu" :close-on-content-click="false"
                          :nudge-right="40" transition="scale-transition" offset-y
                          min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="toDate" readonly v-on="on"
                                    label="To date"></v-text-field>
                    </template>
                    <v-date-picker v-model="toDate" scrollable first-day-of-week="1"
                                   color="primary" @input="toDateMenu = false" @change="toDateSelected">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex md2 xs12>
              <v-btn color="primary" block @click="loadInvoices">
                Search invoices
              </v-btn>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card>

      <v-card flat tile v-if="resultDisplayMessage && invoices.length > 0">
        <v-card-title class="px-7">
          {{resultDisplayMessage}}
          <v-spacer></v-spacer>
          <div class="mt-2">
            <v-checkbox class="d-inline-flex right" v-model="cgstCheckbox" label="CGST" type="checkbox" color="primary"
                      @change="cgstCheckboxSelected"></v-checkbox>
            <v-checkbox class="d-inline-flex right ml-4" v-model="igstCheckbox" label="IGST" type="checkbox" color="primary"
                      @change="igstCheckboxSelected"></v-checkbox>
          </div>
          <v-btn color="info" fab x-small depressed @click="exportToCSV" class="ml-2">
            <v-icon>mdi-cloud-download</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-simple-table>
            <v-simple-table>
              <thead>
              <tr>
                <th v-for="header in headers" :key="header.text" class="text-center"
                    :style="{ 'width': header.width }">
                  {{header.text}}</th>
              </tr>
              </thead>

              <tbody>
              <!-- Items row -->
                <tr v-for="(item, index) in invoices" :key="item.id">
                  <td class="text-center">{{ item.invoice_no }}</td>
                  <td class="text-center">{{ calendarDate(item.invoice_date) }}</td>
                  <td class="text-center">{{ item.consignee_details.name }}</td>
                  <td class="text-center">{{ item.consignee_details.city }}</td>
                  <td class="text-center">{{ item.consignee_details.state_name }}</td>
                  <td class="text-center">{{ item.is_same_state_invoice ? 'CGST' : 'IGST' }}</td>
                  <td class="text-right">{{ item.item_summary.total_quantity_sum }}</td>
                  <td class="text-right">₹ {{ item.item_summary.total_after_round_off }}</td>
                  <td class="text-right" v-text="getTotalIntegratedTaxAmount(item.tax_summary)"></td>
                  <td class="text-right" v-text="getTotalCombinedTaxAmount(item.tax_summary)"></td>
                  <td class="text-right" v-text="getTotalTaxAmount(item.tax_summary)"></td>
                  <td class="text-right">
                    <a @click="$router.push({ name: 'viewInvoice', params: { id: item.id}})">View</a>
                    <a class="ml-4"  v-if="userDetails().permissions.invoice.edit"
                       @click="$router.push({ name: 'editInvoice', params: { id: item.id}})">
                      Edit</a>
                  </td>
                </tr>

                <tr style="border-top: 1px solid black">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-right font-weight-bold">₹ {{parseFloat(summary.quantity).toFixed(2)}}</td>
                  <td class="text-right font-weight-bold">₹ {{parseFloat(summary.amount).toFixed(2)}}</td>
                  <td class="text-right font-weight-bold">₹ {{parseFloat(summary.igst_tax_sum).toFixed(2)}}</td>
                  <td class="text-right font-weight-bold">₹ {{parseFloat(summary.cgst_and_sgst_tax_sum).toFixed(2)}}</td>
                  <td class="text-right font-weight-bold">₹ {{parseFloat(summary.taxable_value).toFixed(2)}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isDataLoading: false,
      isCompaniesDataLoading: true,
      isCustomersDataLoading: true,
      headers: [
        {
          text: 'No',
          width: '4%'
        },
        {
          text: 'Date',
          width: '8%'
        },
        {
          text: 'Customer name',
          width: '14%'
        },
        {
          text: 'Customer city',
          width: '10%'
        },
        {
          text: 'Customer state'
        },
        {
          text: 'Type'
        },
        {
          text: 'Quantity (kg)'
        },
        {
          text: 'Amount'
        },
        {
          text: 'IGST'
        },
        {
          text: 'CGST+SGST'
        },
        {
          text: 'Tax.val'
        },
        {
          text: 'Actions'
        }
      ],
      menu: false,
      selectedMonth: new Date().toISOString().substr(0, 7),
      companies: [],
      selectedCompany: {},
      customers: [],
      selectedCustomer: {},
      fromDateMenu: false,
      fromDate: '',
      toDateMenu: false,
      toDate: '',
      invoices: [],
      unfilteredInvoices: [],
      summary: {
        quantity: 0.0,
        amount: 0.0,
        igst_tax_sum: 0.0,
        cgst_and_sgst_tax_sum: 0.0,
        taxable_value: 0.0
      },
      resultDisplayMessage: '',
      igstCheckbox: null,
      cgstCheckbox: null
    };
  },

  beforeRouteEnter(to, from, next) {
    next(
      (vm) => vm.$http.get(process.env.VUE_APP_REST_URL + '/companies',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setCompaniesData(response.data);
      }, (response) => {
      })
    );

    next(
      (vm) => vm.$http.get(process.env.VUE_APP_REST_URL + '/customers',
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
    setCompaniesData(data) {
      this.companies = data;
      this.isCompaniesDataLoading = false;
    },

    setCustomersData(data) {
      this.customers = data;
      this.isCustomersDataLoading = false;
    },

    companySelected() {
      this.selectedMonth = '';
      this.fromDate = '';
      this.toDate = '';
    },

    customerSelected() {
      this.selectedMonth = '';
      this.fromDate = '';
      this.toDate = '';
    },

    monthSelected() {
      this.fromDate = '';
      this.toDate = '';
    },

    fromDateSelected() {
      this.selectedMonth = '';
    },

    toDateSelected() {
      this.selectedMonth = '';
    },

    igstCheckboxSelected() {
      // Disable cgst chekbox & filter data
      const vm = this;

      vm.invoices = vm.unfilteredInvoices;
      if (vm.igstCheckbox !== undefined && vm.igstCheckbox !== null) {
        if (vm.igstCheckbox) {
          // Filter the data for table
          const filteredInvoices = [];
          vm.invoices.forEach((invoice) => {
            if (invoice.is_same_state_invoice === false) {
              filteredInvoices.push(invoice);
            }
          });
          vm.invoices = filteredInvoices;
        } else {
          vm.invoices = vm.unfilteredInvoices;
        }
        vm.cgstCheckbox = false;
        vm.calculateSummary(vm.invoices);
      }
    },

    cgstCheckboxSelected() {
      // Disable igst chekbox & filter data
      const vm = this;

      vm.invoices = vm.unfilteredInvoices;
      if (vm.cgstCheckbox !== undefined && vm.cgstCheckbox !== null) {
        if (vm.cgstCheckbox) {
          // Filter the data for table
          const filteredInvoices = [];
          vm.invoices.forEach((invoice) => {
            if (invoice.is_same_state_invoice === true) {
              filteredInvoices.push(invoice);
            }
          });
          vm.invoices = filteredInvoices;
        } else {
          vm.invoices = vm.unfilteredInvoices;
        }
        vm.igstCheckbox = false;
        vm.calculateSummary(vm.invoices);
      }
    },

    loadInvoices() {
      // Check which option was selected & load data accordingly
      const vm = this;

      // Form the api query based on the selected option
      let apiUrl = '/invoice_list';
      vm.resultDisplayMessage = '';

      if (vm.selectedCompany !== undefined && vm.selectedCompany !== null) {
        if (vm.selectedCompany !== '' && vm.selectedCompany.id) {
          if (apiUrl.length === 13) {
            apiUrl += '?';
          } else {
            apiUrl += '&';
          }
          apiUrl += 'by_company_id=' + vm.selectedCompany.id;
          vm.resultDisplayMessage += ' (' + vm.selectedCompany.name + ', ' + vm.selectedCompany.city + ', '
              + vm.selectedCompany.state_name + ') ';
        }
      }

      if (vm.selectedCustomer !== undefined && vm.selectedCustomer !== null) {
        if (vm.selectedCustomer !== '' && vm.selectedCustomer.id) {
          if (apiUrl.length === 13) {
            apiUrl += '?';
          } else {
            apiUrl += '&';
          }
          apiUrl += 'by_customer_id=' + vm.selectedCustomer.id;
          vm.resultDisplayMessage += ' (' + vm.selectedCustomer.name + ', ' + vm.selectedCustomer.city + ', '
              + vm.selectedCustomer.state_name + ') ';
        }
      }

      if (vm.selectedMonth !== undefined && vm.selectedMonth !== null) {
        if (vm.selectedMonth !== '') {
          if (apiUrl.length === 13) {
            apiUrl += '?';
          } else {
            apiUrl += '&';
          }
          apiUrl += 'month=' + parseInt(vm.selectedMonth.split('-')[1], 10)
              + '&year=' + vm.selectedMonth.split('-')[0];
          vm.resultDisplayMessage += ' (' + vm.formattedMonth(vm.selectedMonth.split('-')[1]) + ', '
              + vm.selectedMonth.split('-')[0] + ') ';
        }
      }

      if (vm.fromDate !== undefined && vm.fromDate !== null && vm.toDate !== undefined && vm.toDate !== null) {
        if (vm.fromDate !== '' && vm.toDate !== '') {
          if (apiUrl.length === 13) {
            apiUrl += '?';
          } else {
            apiUrl += '&';
          }
          apiUrl += 'from_date=' + vm.fromDate + '&to_date=' + vm.toDate;
          vm.resultDisplayMessage += ' (' + vm.calendarDate(vm.fromDate) + ' to ' + vm.calendarDate(vm.toDate) + ') ';
        }
      }

      // Get invoices based on the apiUrl
      if (apiUrl !== '') {
        vm.$http.get(process.env.VUE_APP_REST_URL + apiUrl,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          vm.invoices = response.data;
          vm.unfilteredInvoices = response.data;
          vm.calculateSummary(response.data);
        }, (response) => {
        });
      }
    },

    calculateSummary(invoices) {
      const vm = this;
      vm.summary = {
        quantity: 0.0,
        amount: 0.0,
        igst_tax_sum: 0.0,
        cgst_and_sgst_tax_sum: 0.0,
        taxable_value: 0.0
      };
      invoices.forEach((invoice) => {
        if (invoice.tax_summary !== undefined && invoice.tax_summary !== null) {
          vm.summary.quantity = parseFloat(vm.summary.quantity) + parseFloat(invoice.item_summary.total_quantity_sum);
          vm.summary.amount = parseFloat(vm.summary.amount) + parseFloat(invoice.item_summary.total_after_round_off);

          if (invoice.tax_summary.hsn_summary_total.total_integrated_tax_amount) {
            vm.summary.igst_tax_sum = parseFloat(vm.summary.igst_tax_sum)
              + parseFloat(invoice.tax_summary.hsn_summary_total.total_integrated_tax_amount);
          }

          if (invoice.tax_summary.hsn_summary_total.total_combined_tax_amount) {
            vm.summary.cgst_and_sgst_tax_sum = parseFloat(vm.summary.cgst_and_sgst_tax_sum)
              + parseFloat(invoice.tax_summary.hsn_summary_total.total_combined_tax_amount);
          }

          if (invoice.tax_summary.hsn_summary_total.total_taxable_value !== undefined
            && invoice.tax_summary.hsn_summary_total.total_taxable_value !== null) {
            vm.summary.taxable_value = parseFloat(vm.summary.taxable_value)
              + parseFloat(invoice.tax_summary.hsn_summary_total.total_taxable_value);
          } else {
            vm.summary.taxable_value = 0.00;
          }
        }
      });
    },

    getTotalIntegratedTaxAmount(taxSummary) {
      if (taxSummary !== undefined && taxSummary !== null) {
        if (taxSummary.hsn_summary_total !== undefined && taxSummary.hsn_summary_total !== null) {
          if (taxSummary.hsn_summary_total.total_integrated_tax_amount !== undefined
            && taxSummary.hsn_summary_total.total_integrated_tax_amount !== null) {
            return '₹' + taxSummary.hsn_summary_total.total_integrated_tax_amount;
          }
          return '₹ 0';
        }
        return '₹ 0';
      }
      return '₹ 0';
    },

    getTotalCombinedTaxAmount(taxSummary) {
      if (taxSummary !== undefined && taxSummary !== null) {
        if (taxSummary.hsn_summary_total !== undefined && taxSummary.hsn_summary_total !== null) {
          if (taxSummary.hsn_summary_total.total_combined_tax_amount !== undefined
            && taxSummary.hsn_summary_total.total_combined_tax_amount !== null) {
            return '₹' + taxSummary.hsn_summary_total.total_combined_tax_amount;
          }
          return '₹ 0';
        }
        return '₹ 0';
      }
      return '₹ 0';
    },

    getTotalTaxAmount(taxSummary) {
      if (taxSummary !== undefined && taxSummary !== null) {
        if (taxSummary.hsn_summary_total !== undefined && taxSummary.hsn_summary_total !== null) {
          if (taxSummary.hsn_summary_total.total_taxable_value !== undefined
            && taxSummary.hsn_summary_total.total_taxable_value !== null) {
            return '₹' + taxSummary.hsn_summary_total.total_taxable_value;
          }
          return '₹ 0';
        }
        return '₹ 0';
      }
      return '₹ 0';
    },

    exportToCSV() {
      const vm = this;
      // Reformat the selected array to a comma seperated nested array
      const reformattedSelectedArray = [
        ['Invoice no', 'Created date', 'Customer name', 'Customer city', 'Customer state', 'Type', 'Quantity',
          'Amount', 'IGST Amt', 'CGST+SGST Amt', 'Taxable value']
      ];

      // Append only values sequentially
      this.invoices.forEach((row) => {
        reformattedSelectedArray.push([
          row.invoice_no, vm.calendarDate(row.invoice_date), row.consignee_details.name, row.consignee_details.city,
          row.consignee_details.state_name, row.is_same_state_invoice ? 'CGST' : 'IGST', row.item_summary.total_quantity_sum,
          row.item_summary.total_after_round_off, vm.getTotalIntegratedTaxAmount(row.tax_summary),
          vm.getTotalCombinedTaxAmount(row.tax_summary), vm.getTotalTaxAmount(row.tax_summary)
        ]);
      });

      // Pass the reformatted array to the CSV fn
      this.convertToCSV('invoice_list.csv', reformattedSelectedArray);
    }
  }
};
</script>
