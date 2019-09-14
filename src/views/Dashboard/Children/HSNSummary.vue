<template>
  <v-card color="secondary" flat>
    <v-card-title>HSN summary</v-card-title>

    <v-card-text>
      <v-layout wrap align-baseline justify-space-between>
        <v-flex xs12 sm4 md3 class="pa-2">
          <v-autocomplete v-model="selectedCompany" :items="companies" hide-details
                          item-text="name" item-value="id" label="Select a company ..."
                          return-object clearable :loading="isCompaniesLoading">
            <template v-slot:item="{ item }">
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

        <v-flex xs12 sm5 md3 class="pa-2">
          <v-layout wrap align-baseline>
            <v-flex xs5 sm5 md5>
              <v-menu v-model="menu" :close-on-content-click="false"
                      :nudge-right="40" transition="scale-transition" offset-y
                      min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="selectedMonth" readonly v-on="on"
                                label="Invoice date"></v-text-field>
                </template>
                <v-date-picker v-model="selectedMonth" scrollable first-day-of-week="1"
                               color="primary" @input="menu = false" type="month" @change="resetQuarterModel">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs1 sm1 md1>OR</v-flex>
            <v-flex xs6 sm6 md6>
              <v-autocomplete v-model="selectedQuarter" :items="financialYearList().quarters"
                              class="d-inline-flex" label="Select a quarter ..." clearable
                              item-text="name" item-value="name" return-object
                              @change="resetMonthModel" hide-details>
              </v-autocomplete>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 sm2 md2 class="pa-2">
          <v-btn color="primary" block :disabled="checkCompanyAndDateSelection"
                 @click="loadHSNSummary" :loading="isHSNSummaryLoading">
            Show summary
          </v-btn>
        </v-flex>
      </v-layout>

      <v-simple-table>
        <thead>
        <tr>
          <th v-for="header in headers" :key="header.value"
              :class="header.value !== 'hsn' ? 'text-right': 'text-left'">
            {{header.text}}
          </th>
        </tr>
        </thead>

        <tbody>
        <!-- Items row -->
        <tr v-for="(item, index) in summaryData" :key="index">
          <td>{{item.hsn}}</td>
          <td class="text-right">{{parseFloat(item.quantity).toFixed(3)}} kg</td>
          <td class="text-right">₹ {{parseFloat(item.amount).toFixed(2)}}</td>
          <td class="text-right">₹ {{parseFloat(item.cgst_amount).toFixed(2)}}</td>
          <td class="text-right">₹ {{parseFloat(item.sgst_amount).toFixed(2)}}</td>
          <td class="text-right">₹ {{parseFloat(item.taxable_value).toFixed(2)}}</td>
          <td class="text-right">₹ {{parseFloat(item.total_tax_amount).toFixed(2)}}</td>
          <td class="text-right">
            <v-menu left bottom transition="scale-transition" max-width="270px">
              <template v-slot:activator="{ on }">
                <v-chip label small color="primary" v-on="on">{{item.invoices.length}}</v-chip>
              </template>

              <v-card>
                <v-card-text>
                  <v-chip-group column>
                    <v-chip v-for="(invoice, index) in item.invoices" :key="index"
                            @click="$router.push({ name: 'viewInvoice', params: { id: invoice.id}})">
                      {{invoice.invoice_no}}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-menu>
          </td>
        </tr>
        <!-- Items row -->

        <tr style="border-top: 1px solid black">
          <td class="font-weight-bold">Total sum</td>
          <td class="text-right font-weight-bold">
            {{parseFloat(summaryTotal.quantity_total).toFixed(3)}} kg
          </td>
          <td class="text-right font-weight-bold">₹
            {{parseFloat(summaryTotal.igst_total).toFixed(2)}}
          </td>
          <td class="text-right font-weight-bold">₹
            {{parseFloat(summaryTotal.cgst_total).toFixed(2)}}
          </td>
          <td class="text-right font-weight-bold">₹
            {{parseFloat(summaryTotal.sgst_total).toFixed(2)}}
          </td>
          <td class="text-right font-weight-bold">₹
            {{parseFloat(summaryTotal.taxable_value_total).toFixed(2)}}
          </td>
          <td class="text-right font-weight-bold">₹
            {{parseFloat(summaryTotal.total_tax_amount_total).toFixed(2)}}
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      selectedCompany: '',
      companies: [],
      isCompaniesLoading: true,
      menu: false,
      selectedMonth: new Date().toISOString().substr(0, 7),
      selectedQuarter: '',
      isHSNSummaryLoading: false,
      summaryData: [],
      summaryTotal: {
        quantity_total: 0,
        igst_total: 0,
        cgst_total: 0,
        sgst_total: 0,
        taxable_value_total: 0,
        total_tax_amount_total: 0
      },
      headers: [
        {
          text: 'HSN',
          value: 'hsn'
        },
        {
          text: 'Quantity',
          value: 'quantity'
        },
        {
          text: 'IGST Amount ₹',
          value: 'amount'
        },
        {
          text: 'CGST Amount',
          value: 'cgst_amount'
        },
        {
          text: 'SGST Amount',
          value: 'sgst_amount'
        },
        {
          text: 'Taxable value',
          value: 'taxable_value'
        },
        {
          text: 'Total tax',
          value: 'total_tax_amount'
        },
        {
          text: 'Invoices',
          value: 'invoices'
        }
      ]
    };
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

  computed: {
    checkCompanyAndDateSelection() {
      if (this.selectedCompany !== undefined && this.selectedCompany !== null
          && this.selectedMonth !== undefined && this.selectedMonth !== null
          && this.selectedQuarter !== undefined && this.selectedQuarter !== null) {
        if (this.selectedCompany !== '' && (this.selectedMonth !== '' || this.selectedQuarter !== '')) {
          return false;
        }
        return true;
      }
      return true;
    }
  },

  methods: {
    setCompaniesData(data) {
      this.companies = data;
      this.isCompaniesLoading = false;

      // Check if previousHSNSummaryResults exist in localStorage after companies are loaded
      if (localStorage.hsnSummaryResults !== undefined && localStorage.hsnSummaryResults !== null) {
        const previousHSNSummaryResults = JSON.parse(localStorage.hsnSummaryResults);

        if (previousHSNSummaryResults.selected_month !== undefined && previousHSNSummaryResults.selected_month !== null) {
          if (previousHSNSummaryResults.selected_month !== '') {
            this.selectedMonth = previousHSNSummaryResults.selected_month;
          }
        }

        if (previousHSNSummaryResults.selected_quarter !== undefined && previousHSNSummaryResults.selected_quarter !== null) {
          if (previousHSNSummaryResults.selected_quarter !== '') {
            this.selectedQuarter = previousHSNSummaryResults.selected_quarter;
            this.selectedMonth = '';
          }
        }

        this.selectedCompany = previousHSNSummaryResults.selected_company;
        this.summaryData = previousHSNSummaryResults.summary_data;
        this.summaryTotal = previousHSNSummaryResults.summary_total;
      }
    },

    summarizeData(data) {
      const vm = this;
      data.forEach((hsnRow) => {
        vm.summaryTotal.quantity_total = parseFloat(vm.summaryTotal.quantity_total) + parseFloat(hsnRow.quantity);
        vm.summaryTotal.igst_total = parseFloat(vm.summaryTotal.igst_total) + parseFloat(hsnRow.amount);
        vm.summaryTotal.cgst_total = parseFloat(vm.summaryTotal.cgst_total) + parseFloat(hsnRow.cgst_amount);
        vm.summaryTotal.sgst_total = parseFloat(vm.summaryTotal.sgst_total) + parseFloat(hsnRow.sgst_amount);
        vm.summaryTotal.taxable_value_total = parseFloat(vm.summaryTotal.taxable_value_total) + parseFloat(hsnRow.taxable_value);
        vm.summaryTotal.total_tax_amount_total = parseFloat(vm.summaryTotal.total_tax_amount_total) + parseFloat(hsnRow.total_tax_amount);
      });

      // After summary is generated, store data to local storage for load on page init
      if (vm.selectedMonth !== undefined && vm.selectedMonth !== null) {
        if (vm.selectedMonth !== '') {
          localStorage.hsnSummaryResults = JSON.stringify({
            selected_month: vm.selectedMonth,
            selected_company: vm.selectedCompany,
            summary_data: data,
            summary_total: vm.summaryTotal
          });
        }
      }

      if (vm.selectedQuarter !== undefined && vm.selectedQuarter !== null) {
        if (typeof vm.selectedQuarter === 'object' && vm.selectedQuarter !== '') {
          localStorage.hsnSummaryResults = JSON.stringify({
            selected_quarter: vm.selectedQuarter,
            selected_company: vm.selectedCompany,
            summary_data: data,
            summary_total: vm.summaryTotal
          });
        }
      }
    },

    loadHSNSummary() {
      const vm = this;
      vm.isHSNSummaryLoading = true;

      // Form the search query based on month selection
      let searchQuery = '';
      if (typeof vm.selectedCompany === 'object') {
        searchQuery += 'company_id=' + vm.selectedCompany.id;
      }

      // Structure the query based on the month/quarter selection
      if (vm.selectedMonth !== undefined && vm.selectedMonth !== null) {
        if (vm.selectedMonth !== '') {
          searchQuery += '&month=' + parseInt(vm.selectedMonth.split('-')[1], 10);
          searchQuery += '&year=' + vm.selectedMonth.split('-')[0];
        }
      }

      if (vm.selectedQuarter !== undefined && vm.selectedQuarter !== null) {
        if (typeof vm.selectedQuarter === 'object' && vm.selectedQuarter !== '') {
          searchQuery += '&quarter=' + parseInt(vm.selectedQuarter.quarterValue, 10);
          searchQuery += '&year=' + parseInt(vm.selectedQuarter.yearValue, 10);
        }
      }

      vm.summaryTotal = {
        quantity_total: 0,
        igst_total: 0,
        cgst_total: 0,
        sgst_total: 0,
        taxable_value_total: 0,
        total_tax_amount_total: 0
      };

      vm.$http.get(process.env.VUE_APP_REST_URL + '/hsn_summary_by_date?' + searchQuery,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.summaryData = response.data;
        vm.summarizeData(response.data);
        vm.isHSNSummaryLoading = false;
      }, (response) => {
        vm.isHSNSummaryLoading = false;
      });
    },

    resetMonthModel() {
      this.selectedMonth = '';
    },

    resetQuarterModel() {
      this.selectedQuarter = '';
    },

    uniqueInvoices(invoices) {
      const uniqueInvoiceList = [invoices[0]];
      invoices.forEach((invoice) => {
        // Only add invoice no to unique list if invoice no is not added
        let matchFound = false;
        uniqueInvoiceList.forEach((uniqueInvoice) => {
          if (invoice.invoice_no === uniqueInvoice.invoice_no) {
            matchFound = true;
          }
        });

        if (matchFound === false) {
          uniqueInvoiceList.push(invoice);
        }
      });
      return uniqueInvoiceList;
    }
  }
};
</script>
