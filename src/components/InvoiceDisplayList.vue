<template>
  <v-list two-line v-if="$attrs.data.length > 0" dense>
    <template v-for="(item, key) in $attrs.data">
      <v-list-item :key="item.id" dense @click="conditionalRouteToInvoice(item.id)">
        <v-list-item-avatar color="primary" class="white--text font-weight-medium my-0" size="45" right>
          #{{item.invoice_no}}
        </v-list-item-avatar>

        <v-list-item-content :style="{maxWidth: listContentWidth}" class="pa-0">
          <v-list-item-title>{{item.company.name + ', ' + item.company.city}}</v-list-item-title>
          <v-list-item-subtitle>
            {{item.customer.name + ', ' + item.customer.city}}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-chip color="secondary" x-small text-color="black" class="mr-1">
              by {{item.user.first_name + ' ' + item.user.last_name}}
            </v-chip>
            <v-chip color="secondary" x-small text-color="black" class="mr-1">
              {{item.invoice_status}}
            </v-chip>
            <v-chip color="secondary" x-small text-color="black" class="mr-1">
              <span v-if="item.is_same_state_invoice">CGST</span>
              <span v-else>IGST</span>
            </v-chip>
            <v-chip color="secondary" x-small text-color="black" class="mr-1">
              {{item.item_array.length}} items
            </v-chip>
            <v-chip color="secondary" x-small text-color="black" v-if="item.item_summary" class="mr-1">
              ₹ {{item.item_summary.total_after_round_off}}
            </v-chip>
            <v-chip color="secondary" x-small text-color="black" v-if="item.financial_year" class="mr-1">
              {{item.financial_year}}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action class="my-0 py-2">
          <v-list-item-action-text class="font-weight-bold">{{ calendarDate(item.invoice_date) }}
          </v-list-item-action-text>

          <v-list-item-action-text class="d-inline-flex" v-if="!clickableTile">
            <v-btn text depressed height="30" class="primary--text"
                   @click="routeToInvoice('viewInvoice', item.id)">
              View
            </v-btn>
            <v-btn class="ml-1" text depressed height="30"
                   v-if="userDetails().permissions.invoice.edit"
               @click="routeToInvoice('editInvoice', item.id)">
              Edit
            </v-btn>
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset :key="key"></v-divider>
    </template>
  </v-list>
  <p class="text-center" v-else>
    ------
  </p>
</template>

<script>
export default {
  props: {
    clickableTile: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate() {
    this.listContentWidth = '100%';
    if (this.$attrs.width !== undefined && this.$attrs.width !== null) {
      this.listContentWidth = this.$attrs.width;
    }
  },
  methods: {
    routeToInvoice(type, id) {
      // Route to invoices conditionally based on the current route
      this.$router.push({
        name: type,
        params: { id },
        force: true
      });
      if (this.$router.currentRoute.name === type) {
        this.$router.go();
      }
    },
    conditionalRouteToInvoice(id) {
      if (this.clickableTile) {
        this.routeToInvoice('viewInvoice', id);
      }
    }
  }
};
</script>
