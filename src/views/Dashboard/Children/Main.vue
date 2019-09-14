<template>
  <div>
    <v-layout row align-center v-if="userDetails().is_superuser">

      <v-flex xs12 sm4 md4>
        <v-card style="border-left: 5px solid #CFD8DC" class="ma-2" elevation="1">
          <v-card-title>
            <small>Invoice value </small>
            <v-spacer></v-spacer>
            <small>₹ {{parseFloat(statistics.total_revenue).toFixed(2)}}</small>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 sm4 md4>
        <v-card style="border-left: 5px solid #CFD8DC" class="ma-2" elevation="1">
          <v-card-title class="headline">
            <small>Total taxables </small>
            <v-spacer></v-spacer>
            <small>₹ {{parseFloat(statistics.total_taxable_value).toFixed(2)}}</small>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 sm4 md4>
        <v-card style="border-left: 5px solid #CFD8DC" class="ma-2" elevation="1">
          <v-card-title class="headline">
            <small>Taxes incurred </small>
            <v-spacer></v-spacer>
            <small>₹ {{parseFloat(statistics.total_tax).toFixed(2)}}</small>
          </v-card-title>
        </v-card>
      </v-flex>

    </v-layout>

    <v-layout row wrap>

      <v-flex xs12 sm6 md6 class="pa-2">
        <h2 class="secondary text-center">Your invoices</h2>
        <invoice-display-list :data="recentInvoicesByYou"></invoice-display-list>
      </v-flex>

      <v-flex xs12 sm6 md6 class="pa-2">
        <h2 class="secondary text-center">Other invoices</h2>
        <invoice-display-list :data="recentInvoicesByOthers"></invoice-display-list>
      </v-flex>

    </v-layout>
  </div>
</template>

<script>
import InvoiceDisplayList from '../../../components/InvoiceDisplayList.vue';

export default {
  components: { InvoiceDisplayList },
  data() {
    return {
      statistics: {
        total_revenue: 0,
        total_taxable_value: 0,
        total_tax: 0
      },
      isDataLoading: true,
      recentInvoicesByYou: [],
      recentInvoicesByOthers: []
    };
  },

  beforeRouteEnter(to, from, next) {
    // Statistics API
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/statistics?by_financial_year='
        + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        if (response.data.length > 0) {
          vm.setStatisticsData(response.data[0]);
        }
      }, (response) => {
      })
    );

    // Recent invoices API
    // If params - financial_year - is passed via login use that to make the API cal.
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/recent_invoices?by_user_id='
          + JSON.parse(localStorage.user_info).id + '&financial_year=' + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        vm.setRecentInvoicesData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
    setStatisticsData(data) {
      this.statistics = data;
    },

    setRecentInvoicesData(data) {
      this.recentInvoicesByYou = data.yours;
      this.recentInvoicesByOthers = data.others;
    }
  }
};
</script>
