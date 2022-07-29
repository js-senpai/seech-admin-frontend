<template>
  <div class="main-page shadow bg-white p-2 rounded mt-3">
    <h2 class="mb-4">KPI</h2>
    <BContainer fluid class="mb-4">
       <BRow>
         <BCol cols="12" md="2">
           <BFormGroup  :label="$t('filters.date')">
             <DatePicker v-model="date" range class="w-100" />
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
           <BButton variant="success" class="w-100">{{$t('filters.accept')}}</BButton>
         </BCol>
         <BCol cols="12" md="2">
           <BButton variant="danger" class="w-100">{{$t('filters.clear')}}</BButton>
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
    date: new Date(),
    types: [],
    subtypes: [],
    regions: [],
    states: [],
    otg: [],
    active: ''
  }),
  async fetch(){
    const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/kpi`);
    this.items = items;
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
  fetchOnServer: true
}
</script>
