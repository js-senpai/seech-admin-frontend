<template>
  <div class="statistic-table">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
          <div class="statistic-table__card bg-white">
            <div class="mb-4 d-flex justify-content-between flex-wrap align-items-center">
              <h2 class="statistic-table__title mb-2 mb-md-0 text-center text-md-left">{{title}}</h2>
              <div class="d-flex align-items-center mb-2 mb-md-0 statistic-table__btn-container">
                <button v-if="selectable" :class="`custom-btn light round-circle statistic-table__select-btn ${selected ? 'active': ''} mr-1`"  type="button" @click="selected = !selected">
                  {{$t('buttons.selected')}}
                </button>
                <div class="position-relative statistic-table__filter-btn-container">
                  <button class="custom-btn light round-circle statistic-table__filter-btn" type="button" @click="showModal = !showModal">
                    {{$t('buttons.filters')}}
                  </button>
                  <StatisticFilterModal
                    class="statistic-table__filter-modal"
                    :show-modal.sync="showModal"
                    :apply-filters="applyFilters"
                    :reset-filters="resetFilters"
                    :date.sync="date"
                    :regions.sync="regions"
                    :regions-options="regionsOptions"
                    :states.sync="states"
                    :states-options="statesOptions"
                    :otg.sync="otg"
                    :otg-options="otgOptions"
                    :types.sync="types"
                    :types-options="typesOptions"
                    :subtypes.sync="subtypes"
                    :subtypes-options="subtypesOptions"
                    :active-options="activeOptions"
                    :active.sync="active"
                    :disable-dates="disableDates"
                    :disable-types="disableTypes"
                    :disable-active="disableActive"
                    :disable-region="disableRegion"
                  />
                </div>
              </div>
            </div>
            <div v-for="item in items" :key="item.name" class="mb-4">
              <h3 class="text-center mb-2">{{ item.name }}</h3>
              <div class="overflow-auto w-100">
                <b-table
                  class="statistic-table__table"
                  :items="item.list"
                  :fields="item.fields"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  show-empty
                  @sort-changed="customSort"
                >
                  <template v-if="selectable" #cell(checked)="data">
                    <b-form-checkbox
                      v-model="data.item.checked"
                      @change="updateSelectedTickets()"
                    />
                  </template>
                  <template #empty="scope">
                    <div v-if="isLoad" class="text-center">
                      <b-spinner label="Spinning"></b-spinner>
                    </div>
                    <div v-else class="text-center">
                      No rows to display!
                    </div>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
export default {
  components: {
    StatisticFilterModal: () => import("@/components/Ui/StatisticFilterModal/StatisticFilterModal")
  },
  props: {
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    redirectPath: {
      required: true,
      type: String,
      default: ''
    },
    getApiData: {
      required: true,
      type: Function,
      default: () => {}
    },
    title: {
      required: true,
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
    updateSelectedTickets: {
      required: false,
      type: Function,
      default: () => {}
    },
    selectable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showModal: false,
    sortBy: '',
    sortDesc: true,
    date: [],
    types: [],
    subtypes: [],
    regions: [],
    states: [],
    otg: [],
    active: '',
    activeOptions: [{key: 'true',label: '🟢'},{key: 'false',label: '🔴'}],
    isLoad: true,
    selected: false
  }),
  async fetch(){
    await this.getData({query: {},serverFetch: true});
  },
  computed: {
    typesOptions(){
      return Object.values(this.$i18n.t('types'))
    },
    subtypesOptions(){
      return Object.entries(this.$i18n.t('types')).filter(([_,value]) => this.types.includes(value)).flatMap(([name]) => Object.values(this.$i18n.t(`subtypes.${name}List`)))
    },
    regionsOptions(){
      return Object.entries(this.$i18n.t('regions')).map(([key,data]) => ({
        label: data.name,
        code: key
      }))
    },
    statesOptions(){
      return Object.entries(this.$i18n.t('regions'))
        .filter(([key]) => this.regions.findIndex(({code}) => code === key ) !== -1)
        .flatMap(([_,region]) => Object.entries(region.states))
        .flatMap(([key,data]) => ({
          label: data.name,
          code: key
        }))
    },
    otgOptions(){
      return Object.entries(this.$i18n.t('regions'))
        .filter(([key]) => this.regions.findIndex(({code}) => code === key ) !== -1)
        .flatMap(([_,region]) => Object.entries(region.states))
        .filter(([key]) => this.states.findIndex(({code}) => code === key ) !== -1)
        .flatMap(([_,state]) => Object.entries(state.otg))
        .flatMap(([code,label]) => ({
          label,
          code
        }))
    },
    items: {
      get () {
        return this.data;
      },
      set (value) {
        this.$emit('update:data', value);
      }
    },
    getQueries(){
      return {
        ...(this.selected && {
          selected: this.selected
        }),
        ...(this.types.length && {
          types: this.types.join(',')
        }),
        ...((this.types.length && this.subtypes.length) && {
          subtypes: this.subtypes.join(',')
        }),
        ...(this.regions.length && {
          regions: this.regions.map(({code}) => code).join(',')
        }),
        ...((this.regions.length && this.states.length) && {
          states: this.states.map(({code}) => code).join(',')
        }),
        ...((this.regions.length && this.states.length && this.otg.length) && {
          otg: this.otg.map(({code}) => code).join(',')
        }),
        ...(this.active && {
          active: this.active.key
        }),
        ...(this.date.length && {
          startDate: this.date[0],
          endDate: this.date[1]
        }),
        ...(this.sortBy && {
          sortBy: this.sortBy,
          sortByDesc: this.sortDesc
        })
      }
    }
  },
  watch: {
    '$route.query': '$fetch',
    async selected(){
      await this.$router.push({ path: this.redirectPath, query: this.getQueries});
    }
  },
  fetchOnServer: false,
  methods: {
    async getData({query = {},serverFetch = true}) {
      this.isLoad = true;
      try {
        const getQueryParams = serverFetch ? this.$route.query: query;
        const queryParamsToString = Object.values(getQueryParams).length ? Object.keys(getQueryParams)
          .map(key => `${key}=${getQueryParams[key]}`)
          .join('&'): '';
        await this.getApiData({queryParams: queryParamsToString});
        const { types = '',subtypes = '',regions = '',states = '',otg = '',startDate = '',endDate = '',active,sortBy = '',sortByDesc = true, selected = false } = getQueryParams;
        this.sortBy = sortBy;
        this.sortDesc = sortByDesc === 'true';
        this.selected = selected === 'true';
        this.types = types ? types.split(','): [];
        this.subtypes = types.length && subtypes.length ? subtypes.split(','): [];
        this.regions = regions.length ? this.regionsOptions.filter(({code}) => regions.split(',').includes(code)): [];
        this.states = states.length && regions.length ? this.statesOptions.filter(({code}) => states.split(',').includes(code)): [];
        this.otg = states.length && regions.length && otg.length ? this.otgOptions.filter(({code}) => otg.split(',').includes(code)): [];
        this.active = active ? {
          ...(active === 'true' ? {
            key: 'true',label: '🟢'
          }: {key: 'false',label: '🔴'})
        }: '' ;
        this.date = startDate && endDate ? [startDate,endDate]: [];
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false;
      }
    },
    async customSort({sortBy = '',sortDesc = true}){
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      await this.$router.push({ path: this.redirectPath, query: this.getQueries});
    },
    async resetFilters(hide) {
      await this.$router.push({ path: this.redirectPath, query: {} });
      hide();
    },
    async applyFilters(hide) {
      await this.$router.push({ path: this.redirectPath, query: this.getQueries});
      hide();
    },
  }
}
</script>
<style lang="scss">
@import "../StatisticTable/scss/index";
</style>
