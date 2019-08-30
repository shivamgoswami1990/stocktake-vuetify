<template>
  <v-card max-width="600" width="400" class="mx-auto">

    <v-card-text class="px-5">
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
        <v-text-field v-model="email" :rules="[rules.required, rules.counter, rules.email]"
                      clearable name="email" label="Email">
        </v-text-field>

        <v-text-field v-model="password" :rules="[rules.required, rules.min]"
                      :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'" class="mt-4"
                      :type="show ? 'text' : 'password'" persistent-hint name="password"
                      hint="atleast 8 characters" label="Password" @click:append="show = !show">
        </v-text-field>

        <br>
        <v-btn :loading="loading" :disabled="!valid || loading" type="submit" block color="primary" large>
          Login
        </v-btn>
      </v-form>
    </v-card-text>

    <v-alert type="error" tile border="bottom" class="mb-0" :value="unauthorized">
      {{alertMessage}}
    </v-alert>

    <v-alert :value="isUserSessionTimedOut" type="info">
      Session timed out. Log in again
    </v-alert>

  </v-card>
</template>

<script>

export default {
  data() {
    return {
      valid: false,
      loading: false,
      unauthorized: false,
      email: '',
      password: '',
      show: false,
      isUserSessionTimedOut: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => this.validateFormRules(value, 'lte', 30, 'Max 30 characters'),
        min: v => this.validateFormRules(v, 'gte', 8, 'Min 8 characters'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        }
      },
      alertMessage: ''
    };
  },

  beforeCreate() {
    if (this.isLoggedIn()) {
      this.$router.push({ name: 'main' }); // Navigate to dashboard using router property
    }
  },

  created() {
    // Set the session timed out alert if true
    if (localStorage.isUserSessionTimedOut !== undefined && localStorage.isUserSessionTimedOut !== null) {
      this.isUserSessionTimedOut = localStorage.isUserSessionTimedOut;
    }
  },

  methods: {
    submit() {
      // Start the loading sign
      this.loading = true;

      // Ajax call for login
      this.$http.post(process.env.VUE_APP_REST_URL + '/auth/sign_in', { email: this.email, password: this.password },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        // Clear any old data
        localStorage.clear();

        // Store the credentials after a successful login
        localStorage['access-token'] = response.headers.map['access-token'];
        localStorage.client = response.headers.map.client;
        localStorage.uid = response.headers.map.uid;
        localStorage.user_info = JSON.stringify(response.data.data);
        this.loading = false;
        this.$router.push({ name: 'main' }); // Navigate to dashboard using router property
      }, (response) => {
        // error callback. Show error alert
        this.unauthorized = true;

        if (response.status === 0) {
          this.alertMessage = 'Unable to reach server';
        } else if (response.status === 401) {
          this.alertMessage = 'Incorrect email or password';
        }

        setTimeout(() => {
          this.unauthorized = false;
          this.loading = false;
        }, 3000);
      });
    }
  }
};
</script>
