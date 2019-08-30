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
                      :loading="isNotesLoading" flat hide-details class="pb-1"></v-textarea>

          <v-btn block dark color="black" @click="saveCustomerNotes" :loading="isNotesSaving">
            Save notes
          </v-btn>
        </div>

        <v-list two-line v-if="comments.length > 0" dense>
          <template v-for="(comment, key) in comments">

            <v-list-item :key="key">
              <v-list-item-avatar color="success" class="white--text" size="40">
                {{key + 1}}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{calendarDate(comment[1])}}</v-list-item-title>
                <v-list-item-subtitle>{{comment[0]}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

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
      isNotesLoading: true,
      notes: '',
      comments: []
    };
  },

  mounted() {
    const vm = this;

    vm.showDrawer = true;
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

    vm.$http.get(process.env.VUE_APP_REST_URL + '/customers/' + vm.$attrs.data.id,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
      vm.notes = response.data.notes;
      vm.isNotesLoading = false;
    }, (response) => {
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
