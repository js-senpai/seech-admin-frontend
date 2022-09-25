<template>
  <div class="statistic-filter-block">
    <div class="statistic-filter-block__container">
      <header class="statistic-filter-block__header">
        <h4 class="statistic-filter-block__title">{{$t('filters.filters')}}</h4>
      </header>
      <div class="statistic-filter-block__body">
        <div class="statistic-filter-block__body-item">
          <DatePicker v-model="getDate" :placeholder="$t('filters.date')" range class="w-100" value-type="DD-MM-YYYY" :disabled="disableDates" />
        </div>
        <div class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.region')" v-model="getRegions" :options="regionsOptions" multiple :disabled="disableRegion"  />
        </div>
        <div class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.state')" v-model="getStates" :options="statesOptions" multiple :disabled="!regions.length || disableRegion"  />
        </div>
        <div class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.otg')" v-model="getOtg" :options="otgOptions" multiple :disabled="!states.length || disableRegion"  />
        </div>
        <div class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.type')" v-model="getTypes" :options="typesOptions" multiple :disabled="disableTypes" />
        </div>
        <div class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.subtype')" v-model="getSubTypes" :options="subtypesOptions" multiple :disabled="!types.length || disableTypes"  />
        </div>
        <div v-if="activeOptions.length" class="statistic-filter-block__body-item">
          <v-select :placeholder="$t('filters.active')" v-model="getActive" :options="activeOptions" :disabled="disableActive"  />
        </div>
      </div>
      <footer class="statistic-filter-block__footer">
        <button class="custom-btn light round-square statistic-filter-block__btn-cancel" @click="resetFilters()">{{$t('buttons.clear')}}</button>
        <button  class="custom-btn light round-square statistic-filter-block__btn-accept" @click="applyFilters()">{{$t('buttons.accept')}}</button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    applyFilters: {
      type: Function,
      default: () => {}
    },
    resetFilters: {
      type: Function,
      default: () => {}
    },
    date: {
      type: Array,
      default: () => []
    },
    regions: {
      type: Array,
      default: () => []
    },
    regionsOptions: {
      type: Array,
      default: () => []
    },
    states: {
      type: Array,
      default: () => []
    },
    statesOptions: {
      type: Array,
      default: () => []
    },
    otg: {
      type: Array,
      default: () => []
    },
    otgOptions: {
      type: Array,
      default: () => []
    },
    types: {
      type: Array,
      default: () => []
    },
    typesOptions: {
      type: Array,
      default: () => []
    },
    subtypes: {
      type: Array,
      default: () => []
    },
    subtypesOptions: {
      type: Array,
      default:  () => []
    },
    activeOptions: {
      type: Array,
      default: () => [],
      required: false
    },
    active: {
      required: false,
      type: String,
      default: ''
    },
    disableDates: {
      required: false,
      type: Boolean,
      default: false
    },
    disableTypes: {
      required: false,
      type: Boolean,
      default: false
    },
    disableActive: {
      required: false,
      type: Boolean,
      default: false
    },
    disableRegion: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  computed: {
    getDate: {
      get () {
        return this.date;
      },
      set (value) {
        this.$emit('update:date', value);
      }
    },
    getRegions: {
      get () {
        return this.regions;
      },
      set (value) {
        this.$emit('update:regions', value);
      }
    },
    getStates: {
      get () {
        return this.states;
      },
      set (value) {
        this.$emit('update:states', value);
      }
    },
    getOtg: {
      get () {
        return this.otg;
      },
      set (value) {
        this.$emit('update:otg', value);
      }
    },
    getTypes: {
      get () {
        return this.types;
      },
      set (value) {
        this.$emit('update:types', value);
      }
    },
    getSubTypes: {
      get () {
        return this.subtypes;
      },
      set (value) {
        this.$emit('update:subtypes', value);
      }
    },
    getActive: {
      get () {
        return this.active;
      },
      set (value) {
        this.$emit('update:active', value);
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
