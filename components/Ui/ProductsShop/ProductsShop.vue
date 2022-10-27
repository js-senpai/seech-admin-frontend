<template>
  <div class="products-shop">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
         <div class="products-shop__card bg-white">
           <header class="mb-4 d-md-flex justify-content-between flex-wrap align-items-center products-shop__card-header">
             <h2 class="products-shop__title mb-2 mb-md-0">{{title}}</h2>
             <div class="d-flex position-relative align-items-center statistic-table__btn-container">
               <button  class="custom-btn light round-square products-shop__add-btn mr-1"  type="button" @click="showAddModal = !showAddModal">
                 <font-awesome-icon :icon="['fas', 'plus']" class="mr-2"   />
                 <span>{{$t('buttons.add')}}</span>
               </button>
               <CreateRequestModal
                 class="products-shop__request-modal"
                 :show-modal.sync="showAddModal"
                 :enable-photo="enablePhoto"
                 :enable-price="enablePrice"
                 :reset-modal="hideAddModal"
                 :apply-modal="applyAddModal"
               />
             </div>
           </header>
           <StatisticFilterBlock
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
                 v-for="{description,inBasket = false,title,img,updatedAt,price,weight,author,phone,address,_id,ownTicket = false,showModal = false} in items"
                 v-else-if="!isLoad && items.length"
                 :key="_id"
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
                 <footer v-if="!ownTicket" class="products-shop__list-footer mt-2">
                   <button
                     type="button"
                     class="custom-btn dark round-square"
                     @click="btnDescriptionMethod({_id})"
                   >{{btnDescriptionText}}</button>
                   <button
                     v-if="inBasket"
                     type="button"
                     class="products-shop__btn-wishlist active"
                     @click="btnDeleteFromBasketMethod({_id})"
                   >
                     <b-icon  icon="heart-fill" />
                   </button>
                   <button
                     v-else
                     type="button"
                     class="products-shop__btn-wishlist"
                     @click="btnBasketMethod({_id})"
                   ><b-icon  icon="heart" /></button>
                 </footer>
                 <div v-show="showModal" class="products-shop__modal-description">
                   <BContainer fluid>
                     <BRow>
                       <BCol cols="12" >
                         <header class="products-shop__modal-description__header">
                           <button type="button" class="products-shop__modal-description__close" @click="hideDescriptionModal(_id)">
                             <b-icon  icon="chevron-left" />
                           </button>
                           <div class="products-shop__modal-description__title">{{modalDescriptionTitle}}</div>
                         </header>
                         <div class="products-shop__modal-description__body">
                           <div class="products-shop__modal-description__subtitle">{{modalDescriptionSubTitle}}</div>
                           <div class="products-shop__modal-description__text" v-html="description" />
                         </div>
                       </BCol>
                     </BRow>
                   </BContainer>
                 </div>
               </ProductCard>
               <h3 v-else class="w-100 text-center position-absolute">{{$t('errors.notFound.products')}}</h3>
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
    modalDescriptionTitle: {
      required: false,
      type: String,
      default: ''
    },
    modalDescriptionSubTitle: {
      required: false,
      type: String,
      default: ''
    },
    btnBasketMethod: {
      required: true,
      type: Function,
      default: () => {}
    },
    btnDeleteFromBasketMethod: {
      required: true,
      type: Function,
      default: () => {}
    },
    btnDescriptionText: {
      required: true,
      type: String,
      default: 'Right button'
    },
    btnDescriptionMethod: {
      required: true,
      type: Function,
      default: () => {}
    },
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
    enablePrice: {
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
    addNewTicket: {
      required: true,
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    showAddModal: false,
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
    hideDescriptionModal(_id){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = false
      }
    },
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
    hideAddModal(){
      this.showAddModal = false;
    },
    applyAddModal(data){
      this.addNewTicket(data)
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
