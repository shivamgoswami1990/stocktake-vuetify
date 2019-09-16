<template>
  <v-navigation-drawer v-model="showDrawer" right fixed class="elevation-5" temporary width="500">

    <v-layout align-center fill-height justify-center v-if="isDataLoading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7"></v-progress-circular>
    </v-layout>

    <v-card v-else flat color="secondary">
      <v-btn dark color="black" x-small fab depressed @click="showDrawer = false"
             style="position: absolute; right: 10px; top: 10px">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="justify-center title">Sample comment history</v-card-title>
      <v-card-title class="justify-center title">{{$attrs.data.name}}</v-card-title>

      <v-card-text class="pa-0 pb-2">
        <div class="px-4 py-0">
          <v-textarea name="Customer notes" label="Customer notes" solo auto-grow v-model="notes"
                      flat hide-details class="pb-1"></v-textarea>

          <v-btn block dark color="black" @click="saveCustomerNotes" :loading="isNotesSaving">
            Save notes
          </v-btn>
        </div>

        <v-list two-line v-if="comments.length > 0" dense>
          <template v-for="(comment, key) in comments">
            <v-card tile flat :key="key" color="secondary" class="mx-2">
              <v-card-title>
                Entry {{key + 1}}
                <v-spacer></v-spacer>
                <small>{{calendarDate(comment[1])}}</small>
              </v-card-title>
              <v-card-text>{{comment[0]}}</v-card-text>
            </v-card>

          </template>
        </v-list>

        <v-card-title primary-title v-else class="justify-center body-1">No comments found</v-card-title>
      </v-card-text>
    </v-card>

  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      showDrawer: false,
      isDataLoading: true,
      isNotesSaving: false,
      notes: '',
      comments: []
    };
  },

  mounted() {
    const vm = this;

    vm.showDrawer = true;
    vm.notes = vm.$attrs.data.notes;
    vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id + '/invoice_sample_comments',
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
      vm.isDataLoading = false;
      vm.comments = response.data;
    }, (response) => {
      vm.isDataLoading = false;
    });
  },

  methods: {
    saveCustomerNotes() {
      const vm = this;
      vm.isNotesSaving = true;

      this.$http.patch(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id,
        {
          notes: vm.notes
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.isNotesSaving = false;
      }, (response) => {
        vm.isNotesSaving = false;
      });
    }
  }
};
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
</style>
