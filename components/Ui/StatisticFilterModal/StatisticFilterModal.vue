<template>
  <div v-if="show" class="statistic-filter-modal">
    <div class="statistic-filter-modal__container">
      <header class="statistic-filter-modal__header">
        <h4 class="statistic-filter-modal__title">{{ $t('filters.filters') }}</h4>
        <button type="button" class="statistic-filter-modal__btn-close" @click="show = !show">
          <font-awesome-icon :icon="['fas','xmark']" />
        </button>
      </header>
      <div class="statistic-filter-modal__body">
        <BFormGroup  :label="$t('filters.date')" class="mb-2">
          <DatePicker v-model="getDate" range class="w-100" value-type="DD-MM-YYYY" :disabled="disableDates" />
        </BFormGroup>
        <BFormGroup  :label="$t('filters.region')" class="mb-2">
          <v-select v-model="getRegions" :options="regionsOptions" multiple :disabled="disableRegion"  />
        </BFormGroup>
        <BFormGroup  :label="$t('filters.state')" class="mb-2">
          <v-select v-model="getStates" :options="statesOptions" multiple :disabled="!regions.length || disableRegion"  />
        </BFormGroup>
        <BFormGroup  :label="$t('filters.otg')" class="mb-2">
          <v-select v-model="getOtg" :options="otgOptions" multiple :disabled="!states.length || disableRegion"  />
        </BFormGroup>
        <BFormGroup  :label="$t('filters.type')" class="mb-2">
          <v-select v-model="getTypes" :options="typesOptions" multiple :disabled="disableTypes" />
        </BFormGroup>
        <BFormGroup  :label="$t('filters.subtype')" class="mb-2">
          <v-select v-model="getSubTypes" :options="subtypesOptions" multiple :disabled="!types.length || disableTypes"  />
        </BFormGroup>
        <BFormGroup  v-if="activeOptions.length" :label="$t('filters.active')" class="mb-3">
          <v-select v-model="getActive" :options="activeOptions" :disabled="disableActive"  />
        </BFormGroup>
        <button  class="mb-1 statistic-filter-modal__btn statistic-filter-modal__btn-accept" @click="applyFilters()">{{$t('buttons.accept')}}</button>
        <button class="statistic-filter-modal__btn statistic-filter-modal__btn-cancel" @click="resetFilters()">{{$t('buttons.clear')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showModal: {
      required: true,
      type: Boolean,
      default: true
    },
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
    show: {
      get () {
        return this.showModal;
      },
      set (value) {
        this.$emit('update:showModal', value);
      }
    },
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
