<template>
  <div class="products-shop">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
         <div class="products-shop__card bg-white">
           <header :class="`mb-4 d-md-flex ${title ? 'justify-content-md-between': ''} justify-content-center flex-wrap align-items-center products-shop__card-header`">
             <h2 v-if="title" class="products-shop__title mb-2 mb-md-0">{{title}}</h2>
             <slot name="header" />
           </header>
           <StatisticFilterBlock
             v-if="enableFilter"
             class="mb-4"
             :apply-filters="applyFilters"
             :reset-filters="resetFilters"
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
             :disable-dates="disableDates"
             :disable-types="disableTypes"
             :disable-active="true"
             :disable-region="disableRegion"
           />
           <div class="mb-4 d-flex">
             <div>{{ $t('other.totalItems', { total: rows }) }}</div>
           </div>
           <div class="mb-4 products-shop__list-container">
             <div class="products-shop__list">
               <b-spinner v-if="isLoad" class="products-shop__loader" />
               <ProductCard
                 v-for="{active,description,inBasket = false,title,img,updatedAt,price,weight,author,phone,address,_id,ownTicket = false,showModal = false} in items"
                 v-else-if="!isLoad && items.length"
                 :key="_id"
                 :active="active"
                 :enable-img="enablePhoto"
                 class="products-shop__list-item"
                 :title="title"
                 :img="img"
                 :updated-at="updatedAt"
                 :price="price"
                 :weight="weight"
                 :author="author"
                 :phone="phone"
                 :address="address"
               >
                 <slot name="cardFooter" :active="active" :in-basket="inBasket" :own-ticket="ownTicket" :description="description" :_id="_id" :show-modal="showModal" />
               </ProductCard>
               <h3 v-else class="w-100 text-center position-absolute">{{notFoundText || $t('errors.notFound.products')}}</h3>
             </div>
           </div>
           <div v-if="items.length > 1" class="d-flex justify-content-end align-content-center">
             <b-pagination
               v-model="currentPage"
               :total-rows="rows"
               :per-page="perPage"
             />
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
    CreateRequestModal: () => import("@/components/Ui/CreateRequestModal/CreateRequestModal"),
    StatisticFilterBlock: () => import("@/components/Ui/StatisticFilterBlock/StatisticFilterBlock"),
    ProductCard: () => import('@/components/Ui/ProductCard/ProductCard')
  },
  props: {
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    enablePhoto: {
      required: false,
      type: Boolean,
      default: false
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
    disableRegion: {
      required: false,
      type: Boolean,
      default: false
    },
    enableFilter: {
      required: false,
      type: Boolean,
      default: true
    },
    title:{
      required: false,
      type: String,
      default: ''
    },
    notFoundText: {
      required: false,
      type: String,
      default: ''
    }
  },
  data: () => ({
    types: [],
    subtypes: [],
    regions: [],
    states: [],
    otg: [],
    currentPage: 1,
    perPage: 20,
    isLoad: true,
  }),
  async fetch(){
    await this.getData({query: {},serverFetch: true});
  },
  computed: {
    rows(){
      return this.items.length
    },
    typesOptions(){
      return Object.entries(this.$i18n.t('types')).map(([key,data]) => ({
        label: data,
        code: key
      }))
    },
    subtypesOptions(){
      return this.types.length ? Object.entries(this.$i18n.t('types')).filter(([_,value]) => this.types.findIndex(({label}) => label === value) !== -1).flatMap(([name]) => Object.values(this.$i18n.t(`subtypes.${name}List`))): []
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
        ...(this.types.length && {
          types: this.types.map(({code}) => code).join(',')
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
      }
    }
  },
  fetchOnServer: false,
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    async getData({query = {},serverFetch = true}) {
      this.isLoad = true;
      try {
        const getQueryParams = serverFetch ? this.$route.query: query;
        const queryParamsToString = Object.values(getQueryParams).length ? Object.keys(getQueryParams)
          .map(key => `${key}=${getQueryParams[key]}`)
          .join('&'): '';
        await this.getApiData({queryParams: queryParamsToString});
        const { types = '',subtypes = '',regions = '',states = '',otg = '' } = getQueryParams;
        this.types = types ? this.types.filter(({code}) => types.split(',').includes(code)): [];
        this.subtypes = types.length && subtypes.length ? subtypes.split(','): [];
        this.regions = regions.length ? this.regionsOptions.filter(({code}) => regions.split(',').includes(code)): [];
        this.states = states.length && regions.length ? this.statesOptions.filter(({code}) => states.split(',').includes(code)): [];
        this.otg = states.length && regions.length && otg.length ? this.otgOptions.filter(({code}) => otg.split(',').includes(code)): [];
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false;
      }
    },
    async resetFilters() {
      this.types =  [];
      this.subtypes = [];
      this.regions = [];
      this.states = [];
      this.otg = [];
      await this.$router.push({ path: this.redirectPath, query: {} });
    },
    async applyFilters() {
      await this.$router.push({ path: this.redirectPath, query: this.getQueries});
    },
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
