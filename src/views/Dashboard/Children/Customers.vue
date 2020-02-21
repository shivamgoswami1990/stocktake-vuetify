<template>
  <v-card flat>

    <component :is="sampleCommentsComponent" :data="selectedCustomer" />
    <component :is="customerBookComponent" :data="selectedCustomer" :showAddItemBtn="false"/>

    <v-card-title>
      Customers list
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" solo class="hidden-sm-and-down"
                    single-line hide-details clearable autofocus @input="searchCustomer">
      </v-text-field>

      <v-btn color="primary" fab small depressed class="mx-4"
             v-if="userDetails().permissions.item.create" @click="addCustomer">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-dialog v-model="showDeleteCustomerDialog" max-width="600px" persistent>
        <v-card>
          <v-card-title class="secondary justify-center">
            Action incomplete
          </v-card-title>

          <v-card-text class="pa-4">
            <h3 class="text-center">This customer can't be deleted as they have
              <b>{{currentCustomerInvoices}}</b> invoices</h3>
          </v-card-text>

          <v-card-actions>
            <v-btn color="secondary" class="mx-auto" width="200px"
                   depressed @click="showDeleteCustomerDialog = false">
              Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn color="info" fab small depressed @click="exportToCSV" :loading="isCSVDataLoading">
        <v-icon>mdi-cloud-download</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table :headers="headers" :items="customers" :loading="isDataLoading"
                    :options.sync="dataTableOptions" :server-items-length="totalRecords"
                    :footer-props="{'items-per-page-options': [10]}" disable-sort
                    :hide-default-footer="hideDataTableFooter">

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editCustomer(item)" color="info"
                  v-if="userDetails().permissions.customer.edit">mdi-border-color</v-icon>
          <v-icon small class="mr-2" @click="showCustomerBook(item)"
                  v-if="userDetails().permissions.customer.edit">mdi-folder</v-icon>
          <v-icon small class="mr-2" @click="showSampleComments(item)" color="primary"
                  v-if="userDetails().permissions.customer.edit">mdi-message-reply</v-icon>
          <v-icon small @click="deleteItem(item)"
                  v-if="userDetails().permissions.customer.delete && item.invoice_count === 0">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <customer-modal :dialog.sync="showCustomerModal" :data="selectedCustomer"
                    :index="selectedCustomerIndex"
                    @successResponse="successResponse" @errorResponse="errorResponse"/>

    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" bottom right>
      {{ toastMessage }}
      <v-btn dark depressed text @click="showToast = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import CustomerModal from '@/components/CustomerModal.vue';

export default {
  data() {
    return {
      customerBookComponent: null,
      sampleCommentsComponent: null,
      selectedCustomer: {},
      selectedCustomerIndex: null,
      isDataLoading: true,
      isCSVDataLoading: false,
      dataTableOptions: {},
      totalRecords: 0,
      hideDataTableFooter: false,
      search: null,
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Invoices',
          value: 'invoice_count'
        },
        {
          text: 'City',
          value: 'city'
        },
        {
          text: 'State',
          value: 'state'
        },
        {
          text: 'Code',
          value: 'code'
        },
        {
          text: 'Phone no',
          value: 'phone_no'
        },
        {
          text: 'GSTIN no',
          value: 'gstin_no'
        },
        {
          text: 'PAN no',
          value: 'pan_no'
        },
        {
          text: 'Actions', value: 'actions', sortable: false, align: 'center'
        }
      ],
      customers: [],
      showDeleteCustomerDialog: false,
      currentCustomerInvoices: 0,
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      showCustomerModal: false
    };
  },

  components: {
    CustomerModal
  },

  watch: {
    dataTableOptions(val) {
      this.getCustomersByPage(val.page);
    }
  },

  methods: {
    setCustomersData(data) {
      this.customers = data;
      this.isDataLoading = false;
    },

    getCustomersByPage(pageNo) {
      const vm = this;
      vm.isDataLoading = true;
      vm.$http.get(process.env.VUE_APP_REST_URL + '/customers?page_no=' + pageNo
        + '&financial_year=' + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        vm.setCustomersData(response.data[1]);
        vm.totalRecords = response.data[0].count;
      }, (response) => {
      });
    },

    addCustomer() {
      this.showCustomerModal = true;
      this.selectedCustomer = {};
    },

    editCustomer(customer) {
      this.showCustomerModal = true;
      this.selectedCustomerIndex = this.customers.indexOf(customer);
      this.selectedCustomer = customer;
    },

    successResponse(data) {
      // On operation complete, add / update table record
      if (data.type === 'edit') {
        // Edit item in table on success
        Object.assign(this.customers[data.index], data.data);

        // Show success toast
        this.showToast = true;
        this.toastMessage = 'Successfully saved customer';
        this.toastColor = 'success';
      } else if (data.type === 'add') {
        this.customers.push(data.data);

        // Show success toast
        this.showToast = true;
        this.toastMessage = 'Successfully created customer';
        this.toastColor = 'success';
      }
    },

    errorResponse(data) {
      if (data.type === 'edit') {
        // error callback. Show error alert
        this.showToast = true;
        this.toastMessage = 'Something went wrong';
        this.toastColor = 'error';
      } else if (data.type === 'add') {
        // error callback. Show error alert
        if (data.status === 409) {
          this.showToast = true;
          this.toastMessage = 'Customer already exists with GSTIN No';
          this.toastColor = 'error';
        } else {
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        }
      }
    },

    deleteItem(item) {
      if (confirm('Are you sure you want to delete this customer ?')) {
        this.$http.delete(process.env.VUE_APP_REST_URL + '/customers/' + item.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
          .then((response2) => {
            const index = this.customers.indexOf(item);
            this.customers.splice(index, 1);

            // Show success toast
            this.showToast = true;
            this.toastMessage = 'Successfully deleted customer';
            this.toastColor = '';
          }, (response2) => {
            this.showToast = true;
            this.toastMessage = 'Something went wrong';
            this.toastColor = 'error';
          });
      }
    },

    showCustomerBook(customer) {
      this.selectedCustomer = customer;
      this.customerBookComponent = () => import('../../../components/CustomerBook.vue');
    },

    showSampleComments(customer) {
      this.selectedCustomer = customer;
      this.sampleCommentsComponent = () => import('../../../components/SampleComments.vue');
    },

    searchCustomer() {
      const vm = this;
      if (vm.search !== '' && vm.search !== null) {
        if (vm.search.length > 2) {
          // eslint-disable-next-line no-underscore-dangle
          clearTimeout(this._searchTimerId);
          // eslint-disable-next-line no-underscore-dangle
          this._searchTimerId = setTimeout(() => {
            vm.$http.post(process.env.VUE_APP_REST_URL + '/search_customers',
              {
                search_term: vm.search
              },
              {
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }).then((response) => {
              vm.setCustomersData(response.data);
              this.hideDataTableFooter = true;
              vm.totalRecords = response.data.total_records;
            }, (response) => {
            });
          }, 1000); /* 1000ms throttle */
        } else {
          this.getCustomersByPage(1);
          this.hideDataTableFooter = false;
        }
      } else {
        this.getCustomersByPage(1);
        this.hideDataTableFooter = false;
      }
    },

    exportToCSV() {
      // Get all the items for exporting
      const vm = this;
      vm.isCSVDataLoading = true;
      vm.$http.get(process.env.VUE_APP_REST_URL + '/customers',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        // Reformat the selected array to a comma seperated nested array
        const reformattedSelectedArray = [
          ['Customer name', 'St address', 'City', 'State', 'Postcode', 'Code',
            'Phone no', 'GSTIN no', 'PAN no', 'Email', 'Transport', 'Destination', 'Notes', 'Created at']
        ];

        // Append only values sequentially
        response.data.forEach((row) => {
          reformattedSelectedArray.push([
            row.name, row.st_address, row.city, row.state_name, row.postcode, row.code,
            row.phone_no, row.gstin_no, row.pan_no, row.contact_email, row.transport_name,
            row.destination, row.notes, vm.calendarDate(row.created_at)
          ]);
        });

        // Pass the reformatted array to the CSV fn
        vm.convertToCSV('Customers.csv', reformattedSelectedArray);
        vm.isCSVDataLoading = false;
      }, (response) => {
      });
    },
  }
};
</script>
