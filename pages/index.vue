<template>
  <div class="main-page shadow bg-white p-2 rounded mt-3">
    <h2 class="mb-4">KPI</h2>
    <BContainer fluid class="mb-4">
       <BRow>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.date')">
             <DatePicker v-model="date" range class="w-100" value-type="DD-MM-YYYY" />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.region')">
             <v-select v-model="regions" :options="regionsOptions" multiple  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.state')">
             <v-select v-model="states" :options="statesOptions" multiple :disabled="!regions.length"  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.otg')">
             <v-select v-model="otg" :options="otgOptions" multiple :disabled="!states.length"  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.type')">
             <v-select v-model="types" :options="typesOptions" multiple  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.subtype')">
             <v-select v-model="subtypes" :options="subtypesOptions" multiple :disabled="!types.length"  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.active')">
             <v-select v-model="active" :options="activeOptions"  />
           </BFormGroup>
         </BCol>
         <BCol cols="12" md="2" class="d-flex align-items-end mb-3" @click="applyFilters()">
           <BButton variant="success" class="w-100">{{$t('filters.accept')}}</BButton>
         </BCol>
         <BCol cols="12" md="2" class="d-flex align-items-end mb-3">
           <BButton variant="danger" class="w-100" @click="resetFilters()">{{$t('filters.clear')}}</BButton>
         </BCol>
       </BRow>
    </BContainer>
    <b-table
      id="statistic-table"
      :items="items"
      :fields="fields"
      small
    />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: [],
    date: [],
    types: [],
    subtypes: [],
    regions: [],
    states: [],
    otg: [],
    active: '',
    activeOptions: ['true','false']
  }),
  async fetch(){
    await this.getData({query: {},serverFetch: true});
  },
  computed: {
    typesOptions(){
      return Object.values(this.$i18n.t('types'))
    },
    fields() {
      return Object.entries(this.$i18n.t('kpi')).map(([name,value]) => ({
        [name]: value
      }))
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
    }
  },
  fetchOnServer: true,
  methods: {
     async getData({query = {},serverFetch = true}) {
       try {
         const getQueryParams = serverFetch ? this.$route.query: query;
         const queryParamsToString = Object.values(this.$route.query).length ? Object.keys(getQueryParams)
           .map(key => `${key}=${getQueryParams[key]}`)
           .join('&'): '';
         const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/kpi${queryParamsToString.length ? `?${queryParamsToString}`: ''}`);
         this.items = items;
         const { types = '',subtypes = '',regions = '',states = '',otg = '',startDate = '',endDate = '',active } = getQueryParams;
         this.types = types ? types.split(','): [];
         this.subtypes = types.length && subtypes.length ? subtypes.split(','): [];
         this.regions = regions.length ? this.regionsOptions.filter(({code}) => regions.split(',').includes(code)): [];
         this.states = states.length && regions.length ? this.statesOptions.filter(({code}) => states.split(',').includes(code)): [];
         this.otg = states.length && regions.length && otg.length ? this.otgOptions.filter(({code}) => otg.split(',').includes(code)): [];
         this.active = active;
         this.date = startDate && endDate ? [startDate,endDate]: [];
       } catch (e) {
         console.error(e);
       }
     },
     async resetFilters() {
       await this.$router.push({ path: '/', query: {} });
       await this.getData({query: {},serverFetch: false});
     },
     async applyFilters() {
       const query = {
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
           active: this.active
         }),
         ...(this.date.length && {
           startDate: this.date[0],
           endDate: this.date[1]
         })
       };
       await this.$router.push({ path: '/', query});
       await this.getData({query,serverFetch: false});
     }
  }
}
</script>
