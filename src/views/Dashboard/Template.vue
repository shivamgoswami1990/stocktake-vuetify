<template>
  <v-app>

    <v-app-bar app short elevate-on-scroll color="primary" dense>
      <v-avatar color="white" size="35">{{userInitials}}</v-avatar>
      <v-divider vertical class="white ml-3"></v-divider>

      <a @click="$router.push({name: 'main'})">
        <v-avatar>
          <v-img :src="logoImage" contain height="40" alt="logo" ></v-img>
        </v-avatar>
      </a>

      <v-select :items="this.financialYearList().financial_year" background-color="primary" color="primary"
                dark dense :filled="true" append-icon="" hide-details v-model="selectedYear"
                class="financial-year-selector hidden-sm-and-down" @change="setFinancialYear">
      </v-select>

      <v-spacer></v-spacer>

      <!-- Hide nav bar buttons if not logged in -->
      <v-autocomplete background-color="white" flat rounded placeholder="Search invoice ..."
                      hide-details hide-no-data v-if="isLoggedIn()" class="hidden-md-and-down global-search"
                      v-model="searchModel" :loading="isSearchLoading" :items="searchItems"
                      :search-input.sync="search" item-value="id" no-filter append-icon=""
                      chips deletable-chips return-object style="max-width: 550px">

        <template v-slot:selection="{ item, on }" v-on="on">
          <v-chip close>
            #{{item.invoice_no}} - {{item.customer.name.substring(0, 20) + ', '
            + item.customer.state_name.substring(0, 15)}} on {{ calendarDate(item.invoice_date) }}
          </v-chip>
        </template>

        <template v-slot:item="{ item }">
          <invoice-display-list :data="[item]" width="450px"></invoice-display-list>
        </template>
      </v-autocomplete>

      <div v-if="isLoggedIn()">
        <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
               class="hidden-sm-and-down" to="/createInvoice">Create</v-btn>
        <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
               class="hidden-sm-and-down" :to="{ name: 'hsnSummary'}">HSN</v-btn>
        <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
               class="hidden-sm-and-down">History</v-btn>
        <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
               @click="logoutUser()">LOGOUT</v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-bottom-navigation app background-color="primary" color="white" height="48px"
                         v-if="isLoggedIn()" class="bottom-navigation">
      <v-btn :to="{ name: 'companies'}">
        <h3 class="white--text">Companies</h3><v-icon class="white--text">mdi-domain</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'customers'}">
        <h3 class="white--text">Customers</h3><v-icon class="white--text">mdi-home-variant</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'items'}">
        <h3 class="white--text">Items</h3><v-icon class="white--text">mdi-briefcase</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'users'}">
        <h3 class="white--text">Users</h3><v-icon class="white--text">mdi-account-box</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style lang="scss">
  .financial-year-selector {
    width: 90px;
    height: 80px;

    & .v-input__control {
      width: 90px;

      & > div {
        width: 90px;

        & .v-select__selections {
          & > div {
            font-size: 14px;
          }
        }
      }
    }
  }
</style>

<script>

import logoImage from '../../assets/logo.png';
import InvoiceDisplayList from '../../components/InvoiceDisplayList.vue';

export default {
  name: 'App',
  components: { InvoiceDisplayList },
  data: () => ({
    logoImage,
    searchModel: null,
    search: null,
    searchItems: [],
    isSearchLoading: false,
    userInitials: null,
    selectedYear: null
  }),
  mounted() {
    this.userInitials = this.userDetails().intitals;
    this.selectedYear = this.financialYearList().financial_year[0];

    if (localStorage['financial-year'] === undefined || localStorage['financial-year'] === null) {
      localStorage['financial-year'] = this.selectedYear;
    } else {
      this.selectedYear = localStorage['financial-year'];
    }
  },
  watch: {
    search(val) {
      if (val !== undefined && val !== null) {
        const vm = this;
        vm.isSearchLoading = true;

        this.$http.get(process.env.VUE_APP_REST_URL + '/past_invoices?search_term=' + val,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          vm.searchItems = response.data;
          vm.isSearchLoading = false;
          return response.data;
        }, (response) => {
          vm.isSearchLoading = false;
        });
      }
    }
  },
  methods: {
    setFinancialYear() {
      this.globalFinancialYear = this.selectedYear;
      console.log(this.selectedYear);
      localStorage['financial-year'] = this.globalFinancialYear;
    },
    logoutUser() {
      // Ajax call for logout
      this.$http.delete(process.env.VUE_APP_REST_URL + '/auth/sign_out',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        // Clear any old data
        localStorage.clear();
        this.$router.push({ name: 'login' }); // Navigate to login using router property
      }, (response) => {
        // Clear any old data
        localStorage.clear();
        this.$router.push({ name: 'login' }); // Navigate to login using router property
      });
    },
  }
};
</script>