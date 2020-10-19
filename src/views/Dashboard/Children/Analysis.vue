<template>
  <v-card flat color="secondary">
    <v-card-title>Analysis</v-card-title>

    <v-card-text class="pb-0">
      <v-layout row wrap class="pa-2">
        <v-flex class="pa-2">
          <v-btn color="primary" block depressed @click="changeChartData(3)">
            Last 3 months</v-btn>
        </v-flex>

        <v-flex class="pa-2">
          <v-btn color="primary" block depressed @click="changeChartData(6)">
            Last 6 months</v-btn>
        </v-flex>

        <v-flex class="pa-2">
          <v-btn color="primary" block depressed @click="changeChartData(12)">
            Last 12 months</v-btn>
        </v-flex>
      </v-layout>

      <v-layout row wrap>

        <v-flex xs12 sm6 md6 class="pa-4">
          <v-card flat tile>
            <v-card-title class="justify-center">
              Invoice count per month
            </v-card-title>
            <v-card-text>
              <v-layout align-center fill-height justify-center v-if="isDataLoading" class="pa-4">
                <v-progress-circular indeterminate color="primary" :size="50" :width="7"></v-progress-circular>
              </v-layout>
              <line-graph :data="monthlyCountData" :options="chartOptions" :height="chartHeight" v-else>
              </line-graph>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 md6 class="pa-4">
          <v-card flat tile>
            <v-card-title class="justify-center">
              Taxable value per month (in ₹)
            </v-card-title>
            <v-card-text>
              <v-layout align-center fill-height justify-center v-if="isDataLoading" class="pa-4">
                <v-progress-circular indeterminate color="primary" :size="50" :width="7"></v-progress-circular>
              </v-layout>
              <line-graph :data="monthlyRevenueData" :options="chartOptions" :height="chartHeight" v-else>
              </line-graph>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import LineGraph from '../../../components/LineGraph.vue';

export default {
  components: { LineGraph },

  data() {
    return {
      selectedMonthAndYear: {},
      generatedMonthAndYearRange: [],
      chartHeight: 350,
      isDataLoading: true,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        }
      },
      monthlyCountData: {},
      monthlyRevenueData: {}
    };
  },

  beforeRouteEnter(to, from, next) {
    // Monthly Chart API
    next(
      (vm) => vm.$http.post(process.env.VUE_APP_REST_URL + '/historical_data',
        JSON.stringify({
          date_list: vm.generateMonthAndYearRange(3)
        }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setChartData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {

    // Generate date array as string to be passed to historical_data API
    generateMonthAndYearRange(monthCount) {
      // Go back months according to month count
      let result = '';
      for (let i = monthCount - 1; i > -1; i--) {
        result = result + ',' + this.subtractMonthFromDate(i);
      }
      return ('[' + result.substr(1, result.length).trim() + ']').toString();
    },

    floatingAddition(number1, number2) {
      return parseFloat((parseFloat(number1) + parseFloat(number2)).toFixed(2));
    },

    subtractMonthFromDate(n) {
      const d = new Date();

      if (n === 0) {
        // Same month. Extract month number & date
        return '[' + (d.getMonth() + 1) + ',' + d.getFullYear() + ']';
      }
      const month = d.getMonth();
      d.setMonth(d.getMonth() - n);
      while (d.getMonth() === month) {
        d.setDate(d.getDate() - n);
      }
      return '[' + (d.getMonth() + 1) + ',' + d.getFullYear() + ']';
    },

    setChartData(data) {
      // Set revenue & count data
      const vm = this;

      // Initilaise charts dataset containers
      vm.monthlyCountData = {
        labels: [],
        datasets: [
          {
            label: 'JK Aromatics Delhi',
            borderColor: '#673ab7',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#673ab7',
            fill: false
          },
          {
            label: 'Mazic Fragrances Delhi',
            borderColor: '#2196F3',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#2196F3',
            fill: false
          },
          {
            label: 'JK Aromatics Loni',
            borderColor: '#4CAF50',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#4CAF50',
            fill: false
          },
          {
            label: 'Mazic Fragrances Loni',
            borderColor: '#FF5252',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#FF5252',
            fill: false
          },
        ]
      };
      vm.monthlyRevenueData = {
        labels: [],
        datasets: [
          {
            label: 'JK Aromatics Delhi',
            borderColor: '#673ab7',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#673ab7',
            fill: false
          },
          {
            label: 'Mazic Fragrances Delhi',
            borderColor: '#2196F3',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#2196F3',
            fill: false
          },
          {
            label: 'JK Aromatics Loni',
            borderColor: '#4CAF50',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#4CAF50',
            fill: false
          },
          {
            label: 'Mazic Fragrances Loni',
            borderColor: '#FF5252',
            data: [],
            pointBorderWidth: 4,
            pointBackgroundColor: '#FF5252',
            fill: false
          },
        ]
      };

      data.forEach((value) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec'];
        const formattedMonth = monthNames[value.month - 1];

        vm.monthlyCountData.labels.push(formattedMonth + ' ' + value.year);
        vm.monthlyRevenueData.labels.push(formattedMonth + ' ' + value.year);
        value.result.forEach((stat) => {
          if (stat.company_id === 1) {
            vm.monthlyCountData.datasets[0].data.push(stat.invoice_count);
            vm.monthlyRevenueData.datasets[0].data.push(stat.invoice_revenue);
          } else if (stat.company_id === 2) {
            vm.monthlyCountData.datasets[1].data.push(stat.invoice_count);
            vm.monthlyRevenueData.datasets[1].data.push(stat.invoice_revenue);
          } else if (stat.company_id === 3) {
            vm.monthlyCountData.datasets[2].data.push(stat.invoice_count);
            vm.monthlyRevenueData.datasets[2].data.push(stat.invoice_revenue);
          } else if (stat.company_id === 4) {
            vm.monthlyCountData.datasets[3].data.push(stat.invoice_count);
            vm.monthlyRevenueData.datasets[3].data.push(stat.invoice_revenue);
          }
        });
      });
      this.isDataLoading = false;
    },

    changeChartData(monthCount) {
      const vm = this;
      vm.isDataLoading = true;

      this.$http.post(process.env.VUE_APP_REST_URL + '/historical_data',
        JSON.stringify({
          date_list: vm.generateMonthAndYearRange(monthCount)
        }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setChartData(response.data);
        vm.isDataLoading = false;
      }, (response) => {
        // error callback. Show error alert
        vm.isDataLoading = false;
      });
    }
  }
};
</script>
