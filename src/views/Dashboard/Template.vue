<template>
  <v-app>

    <v-app-bar app elevate-on-scroll color="primary">
      <div style="width: 150px">
        <v-select :items="this.financialYearList().financial_year"
                  prefix="FY :" rounded height="40" dark
                  :filled="false" append-icon="" hide-details v-model="selectedYear"
                  class="hidden-sm-and-down" @change="setFinancialYear">
        </v-select>
      </div>

      <v-avatar>
        <v-img :src="logoImage" contain height="40" alt="logo" ></v-img>
      </v-avatar>

      <v-btn @click="loadNotificationDrawer" icon>
        <v-badge :content="notificationCount" :value="notificationCount" color="success">
          <span class="subtitle-1 white--text">{{userInitials}}</span>
        </v-badge>
      </v-btn>

      <v-btn elevation="0" :to="{ name: 'newInvoice' }" rounded class="ml-7" height="40">
        Create Invoice
      </v-btn>

      <v-spacer></v-spacer>

      <div style="width: 450px">
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
      </div>

      <v-btn height="48px" color="primary" :ripple="false" depressed tile elevation="0"
             v-if="isLoggedIn()" @click="logoutUser()" class="subtitle-1">
        LOGOUT
      </v-btn>

      <template v-slot:extension>
        <div class="menu-extension-list">
          <router-link v-for="(item, index) in menuItems" :key="index" :to="{ name: item.linkTo}">
            <p class="font-weight-medium title">
              <v-icon>mdi-{{item.icon}}</v-icon> {{item.name}}
            </p>
          </router-link>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <component :is="notificationDrawerComponent" @reduceNotificationsCount="reduceNotificationsCount"
    @clearNotificationsCount = "clearNotificationsCount"/>
  </v-app>
</template>

<style lang="scss">
  .menu-extension-list {
    width: 100%;
    display: flex;
    list-style: none;
    justify-content: center;

    a {
      text-decoration: none;
      &.router-link-active {
        background-color: #CFD8DC;
        p, i {
          color: black !important;
        }
      }
      p {
        padding: 10px 15px;
        margin: 0;
        color: white;
        display: flex;
        align-content: center;
        i {
          margin-right: 10px;
          color: white !important;
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
    notificationCount: 0,
    menuItems: [
      {
        name: 'Dashboard',
        icon: 'view-dashboard',
        linkTo: 'main'
      },
      {
        name: 'Companies',
        icon: 'domain',
        linkTo: 'companies'
      },
      {
        name: 'Customers',
        icon: 'home-variant',
        linkTo: 'customers'
      },
      {
        name: 'Items',
        icon: 'briefcase',
        linkTo: 'items'
      },
      {
        name: 'Transports',
        icon: 'truck',
        linkTo: 'transports'
      },
      {
        name: 'Users',
        icon: 'account-box',
        linkTo: 'users'
      },
      {
        name: 'HSN',
        icon: 'finance',
        linkTo: 'hsnSummary'
      },
      {
        name: 'History',
        icon: 'history',
        linkTo: 'invoices'
      },
      {
        name: 'Analysis',
        icon: 'google-analytics',
        linkTo: 'analysis'
      }
    ]
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

            this.$http.post(process.env.VUE_APP_REST_URL + '/past_invoices',
              {
                search_term: val,
                financial_year: vm.currentlySelectedFinancialYear
              },
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
