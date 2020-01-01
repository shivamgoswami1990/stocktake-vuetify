<template>
  <div>
    <v-layout align-center fill-height justify-center v-if="$attrs.loading">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="my-5">
      </v-progress-circular>
    </v-layout>

    <div v-if="$attrs.items.length > 0">
      <div v-for="(item, key) in $attrs.items" :key="key" class="">

        <v-card color="black" dark tile>
          <v-card-title class="body-2">{{item[0].item_name}}</v-card-title>

          <v-card-text class="pa-0">
            <v-simple-table light>
              <thead>
              <tr>
                <th v-for="header in headers" :key="header.value">{{header.text}}</th>
              </tr>
              </thead>

              <tbody>
              <!-- Items row -->
              <tr v-for="(subitem, index) in item" :key="index">
                <td>{{subitem.price_per_kg}}</td>
                <td>{{parseFloat(subitem.packaging, 10) < 1000 ? subitem.packaging + ' gm' :
                  parseFloat(subitem.packaging, 10) / 1000  + ' kg'}}</td>
                <td>{{calendarDate(subitem.order_date)}}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <h2 v-else class="py-5 black--text subtitle-1 text-center">
      No items found
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Price(₹)/kg',
          value: 'price_per_kg'
        },
        {
          text: 'Packaging',
          value: 'packaging'
        },
        {
          text: 'Date',
          value: 'created_at'
        }
      ]
    };
  }
};
</script>
