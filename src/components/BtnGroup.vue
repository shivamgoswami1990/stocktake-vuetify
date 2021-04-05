<template>
  <v-item-group v-model="propertyType" light class="d-flex my-2" mandatory>
    <v-item v-slot="{ active, toggle }" v-for="(item, index) in items" :key="index" :value="item.label">
      <v-card
        color="white"
        class="toggle-card align-center mx-2"
        dark
        :height="itemHeight"
        :width="itemWidth"
        @click="toggle"
      >
        <div class="item-group-child-checked">
          <v-icon v-if="active" color="primary" size="22">mdi-check-circle-outline</v-icon>
        </div>
        <v-card-text class="pa-0 d-flex flex-column justify-center" style="height: 100%">
          <v-icon :color="active ? 'primary' : 'secondary'">
            {{isItemIcon ? 'mdi-package-down' : 'mdi-domain'}}
          </v-icon>
          <p class="mb-0 black--text text-center text-subtitle-2">{{item.name}}</p>
          <p class="mb-0 black--text text-center text-caption">{{item.city}}</p>
        </v-card-text>
      </v-card>
    </v-item>
  </v-item-group>
</template>

<style lang="scss" scoped>
  $inner-ring-distance: 3px;
  .toggle-card {
    &.v-item--active {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: $inner-ring-distance;
        left: $inner-ring-distance;
        width: calc(100% - (2 * #{$inner-ring-distance}));
        height: calc(100% - (2 * #{$inner-ring-distance}));
        z-index: 10;
        border: 2.5px solid #673ab7;
        border-radius: 3%;
      }
    }

    & > .item-group-child-checked {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateX(8px) translateY(-5px);
      background: white;
      z-index: 12;
    }
  }
</style>

<script>
export default {
  props: {
    mandatory: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    isItemIcon: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return [
          {
            name: 'Item 1',
            city: 'Delhi'
          },
          {
            name: 'Item 2',
            city: 'Delhi'
          }
        ];
      }
    },
    itemHeight: {
      type: Number,
      default: 120
    },
    itemWidth: {
      type: Number,
      default: 170
    }
  },

  watch: {
    propertyType(val) {
      this.$emit('input', this.items[val]);
    }
  },

  data() {
    return {
      propertyType: []
    };
  },
};
</script>
