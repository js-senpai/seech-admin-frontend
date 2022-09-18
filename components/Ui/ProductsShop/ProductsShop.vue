<template>
  <div class="products-shop">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
         <div class="products-shop__card bg-white">
           <div class="mb-4 d-flex justify-content-between flex-wrap align-items-center">
             <h2 class="products-shop__title mb-2 mb-md-0 text-center text-md-left">{{title}}</h2>
             <div class="d-flex align-items-center mb-4 mb-md-0 statistic-table__btn-container">
               <button  class="custom-btn dark round-circle products-shop__add-btn mr-1"  type="button" @click="showAddModal = !showAddModal">
                 <font-awesome-icon :icon="['fas', 'plus']" class="mr-2"   />
                 <span>{{$t('buttons.add')}}</span>
               </button>
               <div class="position-relative products-shop__filter-btn-container">
                 <button class="custom-btn light round-circle products-shop__filter-btn" type="button" @click="showModal = !showModal">
                   {{$t('buttons.filters')}}
                 </button>
                 <StatisticFilterModal
                   class="products-shop__filter-modal"
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
                   :disable-dates="disableDates"
                   :disable-types="disableTypes"
                   :disable-active="true"
                   :disable-region="disableRegion"
                 />
               </div>
             </div>
           </div>
           <div class="mb-4 products-shop__list">
             <b-spinner v-if="isLoad" class="products-shop__loader" />
             <ProductCard
               v-else
               class="products-shop__list-item"
               :show-img="showImg"
               v-for="{title,img,createdAt,price,weight,author,phone,address,_id,ownTicket = false} in items"
               :key="_id"
               :title="title"
               :img="img"
               :created-at="createdAt"
               :price="price"
               :weight="weight"
               :author="author"
               :phone="phone"
               :address="address"
             >
               <footer v-if="!ownTicket" class="products-shop__list-footer">
                 <button
                   type="button"
                   class="custom-btn light round-square"
                   @click="btnLeftMethod({_id})"
                 >{{btnLeftText}}</button>
                 <button
                   type="button"
                   class="custom-btn dark round-square"
                   @click="btnRightMethod({_id})"
                 >{{btnRightText}}</button>
               </footer>
             </ProductCard>
             <h3 class="text-center">{{$t('errors.notFound.products')}}</h3>
           </div>
           <div v-if="items.length > 1" class="d-flex justify-content-between align-content-center">
             <div>{{ $t('other.totalItems', { total: rows }) }}</div>
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
    StatisticFilterModal: () => import("@/components/Ui/StatisticFilterModal/StatisticFilterModal"),
    ProductCard: () => import('@/components/Ui/ProductCard/ProductCard')
  },
  props: {
    btnLeftText: {
      required: true,
      type: String,
      default: 'Left button'
    },
    btnLeftMethod: {
      required: true,
      type: Function,
      default: () => {}
    },
    btnRightText: {
      required: true,
      type: String,
      default: 'Right button'
    },
    btnRightMethod: {
      required: true,
      type: Function,
      default: () => {}
    },
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    showImg: {
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
    disableRegion: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    showModal: false,
    showAddModal: false,
    date: [],
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
        ...(this.date.length && {
          startDate: this.date[0],
          endDate: this.date[1]
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
        const { types = '',subtypes = '',regions = '',states = '',otg = '',startDate = '',endDate = '' } = getQueryParams;
        this.types = types ? types.split(','): [];
        this.subtypes = types.length && subtypes.length ? subtypes.split(','): [];
        this.regions = regions.length ? this.regionsOptions.filter(({code}) => regions.split(',').includes(code)): [];
        this.states = states.length && regions.length ? this.statesOptions.filter(({code}) => states.split(',').includes(code)): [];
        this.otg = states.length && regions.length && otg.length ? this.otgOptions.filter(({code}) => otg.split(',').includes(code)): [];
        this.date = startDate && endDate ? [startDate,endDate]: [];
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false;
      }
    },
    async resetFilters() {
      await this.$router.push({ path: this.redirectPath, query: {} });
      this.showModal = false;
    },
    async applyFilters() {
      await this.$router.push({ path: this.redirectPath, query: this.getQueries});
      this.showModal = false;
    },
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
