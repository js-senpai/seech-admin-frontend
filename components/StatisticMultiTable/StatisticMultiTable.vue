<template>
  <div class="statistic-table">
    <b-sidebar id="sidebar" :title="$t('filters.filters')" shadow>
      <template #default="{ hide }">
        <div class="p-3">
          <BFormGroup  :label="$t('filters.date')" class="mb-2">
            <DatePicker v-model="date" range class="w-100" value-type="DD-MM-YYYY" :disabled="disableDates" />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.region')" class="mb-2">
            <v-select v-model="regions" :options="regionsOptions" multiple :disabled="disableRegion"  />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.state')" class="mb-2">
            <v-select v-model="states" :options="statesOptions" multiple :disabled="!regions.length || disableRegion"  />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.otg')" class="mb-2">
            <v-select v-model="otg" :options="otgOptions" multiple :disabled="!states.length || disableRegion"  />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.type')" class="mb-2">
            <v-select v-model="types" :options="typesOptions" multiple :disabled="disableTypes" />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.subtype')" class="mb-2">
            <v-select v-model="subtypes" :options="subtypesOptions" multiple :disabled="!types.length || disableTypes"  />
          </BFormGroup>
          <BFormGroup  :label="$t('filters.active')" class="mb-3">
            <v-select v-model="active" :options="activeOptions" :disabled="disableActive"  />
          </BFormGroup>
          <BButton variant="success" class="w-100 mb-3" @click="applyFilters(hide)">{{$t('buttons.accept')}}</BButton>
          <BButton variant="danger" class="w-100" @click="resetFilters(hide)">{{$t('buttons.clear')}}</BButton>
        </div>
      </template>
    </b-sidebar>
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
          <div class="main-page shadow bg-white p-3 rounded mt-3 ">
            <h2 class="mb-4">{{title}}</h2>
            <div class="mb-4 d-flex justify-content-end">
              <b-button v-if="selectable" class="mr-1">
                <b-form-checkbox
                  v-model="selected"
                >{{$t('buttons.selected')}}</b-form-checkbox>
              </b-button>
              <b-button v-b-toggle.sidebar>{{$t('buttons.filters')}}</b-button>
            </div>
            <div v-for="item in items" :key="item.name" class="mb-4">
              <h3 class="text-center mb-2">{{ item.name }}</h3>
              <div class="overflow-auto w-100">
                <b-table
                  id="statistic-table"
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
