<template>
  <v-app>

    <v-app-bar app short elevate-on-scroll color="primary">
      <v-select :items="this.financialYearList().financial_year" background-color="primary"
                color="primary" prefix="FY :"
                dark :filled="false" append-icon="" hide-details v-model="selectedYear"
                class="hidden-sm-and-down" @change="setFinancialYear">
      </v-select>

      <v-spacer></v-spacer>

      <!-- Hide nav bar buttons if not logged in -->
      <v-autocomplete background-color="white" flat rounded placeholder="Search invoice ..."
                      hide-details hide-no-data v-if="isLoggedIn()" class="hidden-md-and-down global-search"
                      v-model="searchModel" :loading="isSearchLoading" :items="searchItems"
                      :search-input.sync="search" item-value="id" no-filter append-icon=""
                      chips deletable-chips return-object>

        <template v-slot:selection="{ item, on }" v-on="on">
          <v-chip close>
            #{{item.invoice_no}} - {{item.customer.name.substring(0, 20) + ', '
            + item.customer.state_name.substring(0, 15)}} on {{ calendarDate(item.invoice_date) }}
          </v-chip>
        </template>

        <template v-slot:item="{ item }">
          <invoice-display-list :data="[item]" width="450px" clickable-tile></invoice-display-list>
        </template>
      </v-autocomplete>

      <v-divider vertical class="white mx-3"></v-divider>

      <v-btn @click="loadNotificationDrawer" icon>
        <v-badge :content="notificationCount" :value="notificationCount" color="success" overlap>
          <v-icon color="white">mdi-bell-alert</v-icon>
        </v-badge>
      </v-btn>

      <v-divider vertical class="white mx-3"></v-divider>

      <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
             v-if="isLoggedIn()" @click="logoutUser()">LOGOUT</v-btn>
    </v-app-bar>

    <v-navigation-drawer dark permanent color="white" app width="200" v-if="isLoggedIn()" class="elevation-1">
      <v-responsive>
        <v-avatar class="mx-auto d-flex my-2">
          <v-img :src="logoImage" contain height="40" alt="logo" ></v-img>
        </v-avatar>
      </v-responsive>

      <v-list light class="my-5">
        <router-link :to="{ name: 'main'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'companies'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-domain</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Companies</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'customers'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Customers</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'items'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-briefcase</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Items</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'transports'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-truck</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Transports</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'users'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Users</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'hsnSummary'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-finance</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">HSN</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'invoices'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-history</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">History</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link :to="{ name: 'analysis'}">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-google-analytics</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium title">Analysis</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>

      <template v-slot:append>
        <v-card color="white" light tile elevation="1" width="100%" class="pa-4">
          <v-card-text>
            <v-avatar color="primary" size="45"
                      class="d-flex mx-auto white--text font-weight-medium title">
              {{userInitials}}
            </v-avatar>

            <p class="text-center title mt-2 py-0 mb-0">
              {{userDetails().first_name + ' ' + userDetails().last_name}}
            </p>

            <p class="text-center subtitle-1 my-0 py-0">
              {{userDetails().email}}
            </p>

            <p class="text-center subtitle-1 my-0 py-0">
              {{userDetails().invoice_count + ' invoices'}}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn block tile elevation="0" color="primary" :to="{ name: 'newInvoice'}">
              Create invoice
            </v-btn>
          </v-card-actions>

        </v-card>
      </template>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <component :is="notificationDrawerComponent" @reduceNotificationsCount="reduceNotificationsCount"
    @clearNotificationsCount = "clearNotificationsCount"/>
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

  nav {
    a {
      text-decoration: unset;
    }
    .router-link-exact-active.router-link-active {
      text-decoration: unset;
      background-color: #673ab7;
      color: white;

      .v-list-item {
        background-color: inherit;

        i.v-icon {
          color: white;
        }

        .v-list-item__title {
          color: white;
        }
      }
    }
  }
</style>

<script>

import ActionCable from 'actioncable';
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
    selectedYear: null,
    notificationDrawerComponent: null,
    notificationCount: 0
  }),
  beforeRouteEnter(to, from, next) {
    // Get the notification count
    next(
      (vm) => vm.$http.get(process.env.VUE_APP_REST_URL + '/unread_notification_count?user_id='
        + vm.userDetails().id,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        vm.notificationCount = response.data;
      }, (response) => {
      })
    );
  },
  mounted() {
    this.userInitials = this.userDetails().intitals;
    this.selectedYear = this.financialYearList().financial_year[0];

    if (localStorage['financial-year'] === undefined || localStorage['financial-year'] === null) {
      localStorage['financial-year'] = this.selectedYear;
    } else {
      this.selectedYear = localStorage['financial-year'];
    }

    if (this.$route.params.financial_year !== undefined && this.$route.params.financial_year !== null) {
      this.$router.go();
    }

    // Initiate ActionCable with user details
    const cable = ActionCable.createConsumer(process.env.VUE_APP_WSS_URL);
    const vm = this;
    cable.subscriptions.create({
      channel: 'NotificationChannel'
    }, {
      connected() {
        console.log('Notification channel CONNECTED !!!');
      },
      received(data) {
        if (vm.userDetails() !== undefined && vm.userDetails() !== null) {
          if (data.actor_id !== undefined && data.actor_id !== null) {
            if (vm.userDetails().id !== data.actor_id) {
              // If current user ID is different from the creator of notification, increment notification count
              vm.notificationCount += 1;
            }
          }
        }
      }
    });
  },
  watch: {
    search(val) {
      // eslint-disable-next-line no-underscore-dangle
      clearTimeout(this._searchTimerId);
      // eslint-disable-next-line no-underscore-dangle
      this._searchTimerId = setTimeout(() => {
        if (val !== undefined && val !== null) {
          if (val !== '') {
            const vm = this;
            vm.isSearchLoading = true;

            this.$http.get(process.env.VUE_APP_REST_URL + '/past_invoices?search_term=' + val
              + '&financial_year=' + vm.currentlySelectedFinancialYear,
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
      }, 1000); /* 1000ms throttle */
    }
  },
  methods: {
    reduceNotificationsCount() {
      // Reduce notification count by 1 every time a notification is marked as read
      // in the Notifications Drawer Component.
      if (this.notificationCount >= 1) {
        this.notificationCount -= 1;
      }
    },
    clearNotificationsCount() {
      this.notificationCount = 0;
    },
    setFinancialYear() {
      this.globalFinancialYear = this.selectedYear;
      localStorage['financial-year'] = this.globalFinancialYear;
      this.$router.go();
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
    loadNotificationDrawer() {
      this.notificationDrawerComponent = () => import('../../components/Notifications.vue');
    }
  }
};
</script>
