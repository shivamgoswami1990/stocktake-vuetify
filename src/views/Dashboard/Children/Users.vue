<template>
  <v-card flat>
    <v-card-title>
      Users list
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search" solo class="hidden-sm-and-down"
                    single-line hide-details clearable autofocus>
      </v-text-field>
      <v-dialog v-model="dialog" max-width="600px" persistent>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" fab small depressed class="mx-4"
                 v-if="userDetails().permissions.item.create">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
          <v-card>
            <v-card-title class="headline justify-center">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-layout wrap>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.first_name" :rules="[rules.required]"
                                  label="First name" class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.last_name" label="Last name" class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.address" label="Address" class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.phone_no" label="Phone no" class="pa-1">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.email" label="Email" clearable persistent-hint
                                  :rules="[rules.required, rules.counter, rules.email]"
                                  hint="proper email required" class="pa-1">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="editedUser.password" label="Password" hint="atleast 8 characters"
                                  :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'" @click:append="show = !show"
                                  :type="show ? 'text' : 'password'" v-if="editedIndex === -1"
                                  :rules="[rules.required, rules.min]" class="pa-1">

                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <h3 class="pt-3 pl-1">Permissions</h3>

                    <!-- Permissions row -->
                    <div v-if="editedIndex > -1" class="px-3">
                      <v-layout row wrap>
                        <v-flex md4>
                          <v-checkbox color="success" label="Create company"
                                      v-model="editedUser.permissions.company.create"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="info" label="Edit company"
                                      v-model="editedUser.permissions.company.edit"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="error" label="Delete company"
                                      v-model="editedUser.permissions.company.delete"></v-checkbox>
                        </v-flex>
                      </v-layout>

                      <v-layout row wrap>
                        <v-flex md4>
                          <v-checkbox color="success" label="Create customer"
                                      v-model="editedUser.permissions.customer.create"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="info" label="Edit customer"
                                      v-model="editedUser.permissions.customer.edit"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="error" label="Delete customer"
                                      v-model="editedUser.permissions.customer.delete"></v-checkbox>
                        </v-flex>
                      </v-layout>

                      <v-layout row wrap>
                        <v-flex md4>
                          <v-checkbox color="success" label="Create item"
                                      v-model="editedUser.permissions.item.create"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="info" label="Edit item"
                                      v-model="editedUser.permissions.item.edit"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="error" label="Delete item"
                                      v-model="editedUser.permissions.item.delete"></v-checkbox>
                        </v-flex>
                      </v-layout>

                      <v-layout row wrap>
                        <v-flex md4>
                          <v-checkbox color="success" label="Create invoice"
                                      v-model="editedUser.permissions.invoice.create"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="info" label="Edit invoice"
                                      v-model="editedUser.permissions.invoice.edit"></v-checkbox>
                        </v-flex>
                        <v-flex md4>
                          <v-checkbox color="error" label="Delete invoice"
                                      v-model="editedUser.permissions.invoice.delete"></v-checkbox>
                        </v-flex>
                      </v-layout>
                    </div>
                    <div v-else class="px-1">
                      Can be changed once the user is created
                    </div>
                    <!-- Permissions row -->

                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <h3 class="pt-3 pl-1">Superuser ?</h3>

                    <v-checkbox color="primary" label="A superuser can create other users/superusers and is in
                           charge of granting/revoking permissions." v-model="editedUser.is_superuser" v-if="editedIndex > -1">
                    </v-checkbox>
                    <div v-else class="px-1">
                      Can be changed once the user is created
                    </div>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" depressed width="49%" @click.native="close">Cancel</v-btn>
              <v-btn color="primary" depressed width="50%" @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-card-title>

    <v-card-text>
      <!-- Change password dialog -->
      <v-dialog v-model="editPasswordDialog" max-width="600px" persistent>
        <v-form ref="form" v-model="passwordFormValid" lazy-validation @submit.prevent="editPassword">
          <v-card light>
            <v-card-title class="headline justify-center">
              <span class="headline">
                Change password for {{selectedUser.first_name + ' ' + selectedUser.last_name}}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-layout wrap>

                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="password" :rules="[rules.required, rules.min]" class="pa-1"
                                  label="Password" hint="atleast 8 characters" type="password">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model="confirmPassword" :rules="[rules.required, rules.min]" class="pa-1"
                                  label="Confirm password" hint="atleast 8 characters" type="password">
                    </v-text-field>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" depressed width="49%"
                     @click.native="editPasswordDialog = !editPasswordDialog">Cancel</v-btn>
              <v-btn color="primary" depressed width="49%" :disabled="isPasswordFormValid"
                     type="submit">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-data-table :headers="headers" :items="users" :loading="isDataLoading"
                    :search="search" multi-sort>

        <template v-slot:item.created_at="{ item }">
          {{calendarDate(item.created_at)}}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditPasswordDialog(item)" color="success">
            mdi-fingerprint</v-icon>
          <v-icon small class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" bottom right>
      {{ toastMessage }}
      <v-btn dark depressed text @click="showToast = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isDataLoading: true,
      search: '',
      dialog: false,
      valid: false,
      show: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => this.validateFormRules(value, 'lte', 50, 'Max 50 characters'),
        min: v => this.validateFormRules(v, 'gte', 8, 'Min 8 characters'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        }
      },
      toastMessage: '',
      toastTimeout: 5000,
      toastColor: '',
      showToast: false,
      editedIndex: -1,
      defaultUser: {
        first_name: '',
        last_name: '',
        address: '',
        phone_no: '',
        email: '',
        password: '',
        is_superuser: false,
        permissions: {
          company: {
            create: false,
            edit: false,
            delete: false
          },
          customer: {
            create: false,
            edit: false,
            delete: false
          },
          item: {
            create: false,
            edit: false,
            delete: false
          },
          invoice: {
            create: false,
            edit: false,
            delete: false
          }
        }
      },
      editedUser: {
        first_name: '',
        last_name: '',
        address: '',
        phone_no: '',
        email: '',
        password: '',
        is_superuser: false,
        permissions: {
          company: {
            create: false,
            edit: false,
            delete: false
          },
          customer: {
            create: false,
            edit: false,
            delete: false
          },
          item: {
            create: false,
            edit: false,
            delete: false
          },
          invoice: {
            create: false,
            edit: false,
            delete: false
          }
        }
      },
      headers: [
        {
          text: 'First name',
          value: 'first_name'
        },
        {
          text: 'Last name',
          value: 'last_name'
        },
        {
          text: 'Invoices',
          value: 'invoice_count'
        },
        {
          text: 'Address',
          value: 'address'
        },
        {
          text: 'Phone no',
          value: 'phone_no'
        },
        {
          text: 'Email',
          value: 'email'
        },
        {
          text: 'Created on',
          value: 'created_at'
        },
        {
          text: 'Actions', value: 'actions', sortable: false, align: 'center'
        }
      ],
      users: [],
      editPasswordDialog: false,
      password: '',
      confirmPassword: '',
      passwordFormValid: false,
      selectedUser: {}
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new user' : 'Edit an existing user';
    },
    isPasswordFormValid() {
      return !(this.passwordFormValid && (this.password === this.confirmPassword) && this.password !== '');
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/users',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setUsersData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
    setUsersData(data) {
      this.users = data;
      this.isDataLoading = false;
    },

    editUser(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
    },

    openEditPasswordDialog(selectedUser) {
      this.selectedUser = selectedUser;
      this.editPasswordDialog = true;
    },

    editPassword() {
      const vm = this;
      this.$http.patch(process.env.VUE_APP_REST_URL + '/auth',
        {
          password: vm.password,
          password_confirmation: vm.password_confirmation
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        // Show success toast
        this.showToast = true;
        this.toastMessage = 'Successfully changed password';
        this.toastColor = 'success';
        this.editPasswordDialog = false;
      }, (response) => {
        // error callback. Show error alert
        this.showToast = true;
        this.toastMessage = 'Something went wrong.';
        this.toastColor = 'error';
      });
    },

    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.users.slice();
    },

    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        // Edit this item
        this.$http.patch(process.env.VUE_APP_REST_URL + '/users/' + this.editedUser.id,
          {
            first_name: this.editedUser.first_name,
            last_name: this.editedUser.last_name,
            address: this.editedUser.address,
            phone_no: this.editedUser.phone_no,
            email: this.editedUser.email,
            permissions: this.editedUser.permissions,
            is_superuser: this.editedUser.is_superuser
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          // Edit item in table on success
          Object.assign(this.users[this.editedIndex], this.editedUser);
          this.close();

          // Show success toast
          this.showToast = true;
          this.toastMessage = 'Successfully edited user';
          this.toastColor = 'success';
        }, (response) => {
          // error callback. Show error alert
          this.showToast = true;
          this.toastMessage = 'Something went wrong';
          this.toastColor = 'error';
        });
      } else {
        // Add a new user
        this.$http.post(process.env.VUE_APP_REST_URL + '/auth',
          {
            first_name: this.editedUser.first_name,
            last_name: this.editedUser.last_name,
            address: this.editedUser.address,
            phone_no: this.editedUser.phone_no,
            email: this.editedUser.email,
            password: this.editedUser.password,
            password_confirmation: this.editedUser.password
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          this.users.push(response.data.data);
          this.close();

          // Show success toast
          this.showToast = true;
          this.toastMessage = 'Successfully created user';
          this.toastColor = 'success';
        }, (response) => {
          // error callback. Show error alert
          this.showToast = true;
          this.toastMessage = response.data.errors.full_messages[0];
          this.toastColor = 'error';
        });
      }
    }
  }
};
</script>
