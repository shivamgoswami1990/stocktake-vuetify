<template>
  <v-navigation-drawer absolute right temporary clipped width="450px"
                       v-model="showDrawer" style="background-color: #CFD8DC">
    <v-layout align-center fill-height justify-center v-if="isNotificationsLoading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7"></v-progress-circular>
    </v-layout>

    <v-card flat color="secondary" tile>
      <v-card-title>
        <h3 class="text-center" style="width: 100%">Notifications</h3>
      </v-card-title>
      <v-card-text>
        <v-btn-toggle rounded class="d-flex">
          <v-btn depressed text @click="loadPreviousNotifications" class="flex"
                 :disabled="currentPageNo <= 1">
            <v-icon color="primary" class="mr-2">mdi-chevron-left</v-icon>Previous
          </v-btn>

          <v-btn depressed text :loading="isNotificationBeingMarkedAsRead" class="flex">
<!--                 @click="markNotificationsAsRead">-->
            Mark all as read &nbsp;
            <v-icon color="primary" v-if="notificationsMarkedAsRead">mdi-check-circle</v-icon>
          </v-btn>

          <v-btn depressed text @click="loadNextNotifications" class="flex">
            Next<v-icon color="primary" class="ml-2">mdi-chevron-right</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-list two-line v-if="notifications.length > 0" light>
          <template v-for="(notification, key, index) in notifications">

            <v-list-item :key="key" color="primary">
              <v-list-item-avatar
                :color="getNotificationAvatarColor(notification.notification_object.entity_type)"
                class="white--text font-weight-bold" size="40">
                {{notification.actor_name.split(' ')[0].charAt(0) +
                notification.actor_name.split(' ')[1].charAt(0)}}
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{notification.notification_object.description}} by {{notification.actor_name}}
                </v-list-item-title>

                <div v-if="notification.notification_object">
                  <v-list-item-subtitle
                    v-if="notification.notification_object.entity_type === 'Invoice' && notification.notification_object.entity !== null">
                    {{getInvoiceNo(notification.notification_object.entity)}} |
                    {{getCompanyName(notification.notification_object.entity)}}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-if="notification.notification_object.entity_type === 'Invoice' && notification.notification_object.entity !== null">
                    {{getCustomerName(notification.notification_object.entity)}}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-if="notification.notification_object.entity_type === 'Customer' && notification.notification_object.entity !== null">
                    {{notification.notification_object.entity.name}}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-if="notification.notification_object.entity_type === 'Customer' && notification.notification_object.entity !== null">
                    {{notification.notification_object.entity.city}},
                    {{notification.notification_object.entity.state_name}}
                  </v-list-item-subtitle>
                </div>

              </v-list-item-content>

              <v-list-item-action class="ml-2">
                <v-list-item-action-text class="font-weight-bold">{{
                  calendarDate(notification.created_at) }}
                </v-list-item-action-text>
                <v-list-item-action-text>
                  <a class="font-weight-bold"
                     v-if="notification.notification_object.entity_type === 'Invoice'"
                     @click="$router.push({path: '/dashboard/viewInvoice/' + notification.notification_object.entity.id})">
                    View
                  </a> |
                  <a class="font-weight-bold" v-if="!notification.read_status"
                     @click="markNotificationAsRead(notification)">
                    Mark as read
                  </a>
                  <v-icon color="primary" size="18" v-else>mdi-check-circle</v-icon>
                </v-list-item-action-text>
              </v-list-item-action>

            </v-list-item>

          </template>
        </v-list>
        <h3 class="text-center mt-8" v-else>No new notifications</h3>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      showDrawer: false,
      isNotificationsLoading: false,
      notifications: [],
      isNotificationBeingMarkedAsRead: false,
      notificationsMarkedAsRead: false,
      currentPageNo: 1
    };
  },
  mounted() {
    const vm = this;
    vm.showDrawer = true;
    vm.isNotificationsLoading = true;

    vm.$http.get(process.env.VUE_APP_REST_URL + '/unread_notifications?user_id='
      + vm.userDetails().id,
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      vm.notifications = response.data;
      vm.isNotificationsLoading = false;
    }, (response) => {
      vm.isNotificationsLoading = false;
    });
  },
  methods: {
    markNotificationAsRead(notification) {
      const vm = this;
      vm.$http.put(process.env.VUE_APP_REST_URL + '/mark_notification_as_read?id=' + notification.id,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        notification.read_status = true;
        vm.$emit('reduceNotificationsCount');
      }, (response) => {
      });
    },
    getNotificationAvatarColor(entityType) {
      if (entityType === 'Customer') {
        return 'success';
      }
      return 'primary';
    },
    getInvoiceNo(entity) {
      if (entity !== undefined && entity !== null) {
        return entity.invoice_no;
      }
    },
    getCompanyName(entity) {
      if (entity !== undefined && entity !== null) {
        return entity.company.name;
      }
    },
    getCustomerName(entity) {
      if (entity !== undefined && entity !== null) {
        return entity.customer.name;
      }
    },
    markNotificationsAsRead() {
      const vm = this;
      vm.isNotificationBeingMarkedAsRead = true;
      vm.notificationsMarkedAsRead = false;
      this.$http.put(process.env.VUE_APP_REST_URL + '/mark_all_notifications_as_read?user_id=' + vm.userDetails().id,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.isNotificationBeingMarkedAsRead = false;
        vm.notificationsMarkedAsRead = true;
      }, (response) => {
        vm.isNotificationBeingMarkedAsRead = false;
      });
    },
    loadPreviousNotifications() {
      this.currentPageNo -= 1;
      this.loadNotificationFromPageNo(this.currentPageNo);
    },
    loadNextNotifications() {
      this.currentPageNo += 1;
      this.loadNotificationFromPageNo(this.currentPageNo);
    },
    loadNotificationFromPageNo(pageNo) {
      const vm = this;
      vm.isNotificationsLoading = true;

      vm.$http.get(process.env.VUE_APP_REST_URL + '/unread_notifications?user_id='
        + vm.userDetails().id + '&page_no=' + pageNo,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        vm.notifications = response.data;
        vm.isNotificationsLoading = false;
      }, (response) => {
        vm.isNotificationsLoading = false;
      });
    }
  }
};
</script>
