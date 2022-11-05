<template>
  <div class="product-requests">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
          <div class="product-requests__card bg-white">
            <header :class="`mb-4 d-flex ${title ? 'justify-content-md-between': ''}justify-content-center flex-wrap align-items-center product-requests__card-header`">
              <h2 v-if="title" class="product-requests__title mb-2 mb-md-0 w-100 w-md-auto">{{title}}</h2>
              <button  :class="`custom-btn ${pageType === 'sell' ? 'dark': 'light'}  round-circle product-requests__btn-tab  mr-2 ${title ? 'ml-md-auto': ''}`" type="button"   @click="chooseTab('sell')">
                <span>{{sellButton}}</span>
                <span class="product-requests__btn-tab__total">{{totalSell}}</span>
              </button>
              <button  :class="`custom-btn ${pageType === 'buy' ? 'dark': 'light'} round-circle product-requests__btn-tab`" type="button" @click="chooseTab('buy')">
                <span>{{buyButton}}</span>
                <span class="product-requests__btn-tab__total">{{totalBuy}}</span>
              </button>
            </header>
            <div class="mb-4 d-flex">
              <div>{{ $t('other.totalItems', { total: rows }) }}</div>
            </div>
            <div class="mb-4 product-requests__list-container">
              <div class="product-requests__list">
                <b-spinner v-if="isLoad" class="product-requests__loader" />
                <ProductCard
                  v-for="{showModal = false,title,img,updatedAt,price,weight,author,phone,address,_id,description,active = false} in items"
                  v-else-if="!isLoad && items.length"
                  :key="_id"
                  :active="active"
                  :enable-img="pageType === 'sell'"
                  :img="img"
                  class="product-requests__list-item"
                  :title="title"
                  :updated-at="updatedAt"
                  :price="price"
                  :weight="weight"
                  :author="author"
                  :phone="phone"
                  :address="address"
                >
                  <footer  class="product-requests__list-footer mt-2">
<!--                    <button type="button" class="custom-btn round-square product-requests__list-footer__btn-complete w-100 mb-2" @click="complete(_id)">-->
<!--                      <b-icon icon="check2" class="product-requests__list-footer__btn-complete__icon" />-->
<!--                      <span>{{$t('buttons.complete')}}</span>-->
<!--                    </button>-->
<!--                    <button v-if="!active && enableExtend" type="button" class="custom-btn light round-square product-requests__list-footer__btn w-100  mb-2" @click="extend(_id)">{{$t('buttons.extend')}}</button>-->
<!--                    <button type="button" class="custom-btn light product-requests__list-footer__btn w-100" @click="deleteItem(_id)">{{$t('buttons.delete')}}</button>-->
                    <button
                      type="button"
                      class="custom-btn light round-circle"
                      @click="btnDescriptionMethod({_id})"
                    >{{btnDescriptionText}}</button>
                    <button
                      type="button"
                      class="product-requests__btn-wishlist active"
                      @click="deleteItem({_id})"
                    >
                      <b-icon  icon="heart-fill" />
                    </button>
                  </footer>
                  <div v-show="showModal" class="product-requests__modal-description">
                    <BContainer fluid>
                      <BRow>
                        <BCol cols="12" >
                          <header class="product-requests__modal-description__header">
                            <button type="button" class="product-requests__modal-description__close" @click="hideDescriptionModal(_id)">
                              <b-icon  icon="chevron-left" />
                            </button>
                            <div class="product-requests__modal-description__title">{{modalDescriptionTitle}}</div>
                          </header>
                          <div class="product-requests__modal-description__body">
                            <div class="product-requests__modal-description__subtitle">{{modalDescriptionSubTitle}}</div>
                            <div class="product-requests__modal-description__text" v-html="description" />
                          </div>
                        </BCol>
                      </BRow>
                    </BContainer>
                  </div>
                </ProductCard>
                <h3 v-else class="w-100 text-center position-absolute">{{pageType === 'sell' ? notFoundSellText: notFoundBuyText}}</h3>
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
    ProductCard: () => import('@/components/Ui/ProductCard/ProductCard')
  },
  props: {
    sellButton: {
      type: String,
      default: '',
      required: true
    },
    totalSell: {
      type: Number,
      default: 0,
      required: true
    },
    buyButton: {
      type: String,
      default: '',
      required: true
    },
    totalBuy: {
      type: Number,
      default: 0,
      required: true
    },
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    enableExtend: {
      type: Boolean,
      default: false,
      required: false
    },
    notFoundSellText: {
      type: String,
      default: '',
      required: true
    },
    notFoundBuyText: {
      type: String,
      default: '',
      required: true
    },
    getData: {
      type: Function,
      default: () => {},
      required: true
    },
    completeAction: {
      type: Function,
      required: true,
      default: () => {}
    },
    deleteAction: {
      type: Function,
      required: true,
      default: () => {}
    },
    extendAction: {
      type: Function,
      required: false,
      default: () => {}
    },
    title: {
      type: String,
      required: false,
      default: ''
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
  },
  data: () => ({
    pageType: 'sell',
    isLoad: true,
    currentPage: 1,
    perPage: 20
  }),
  async fetch(){
    await this.fetchData();
  },
  computed: {
    rows(){
      return this.items.length
    },
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
    async chooseTab(type = 'sell'){
      this.pageType = type;
      await this.fetchData();
    },
    async fetchData() {
      this.isLoad = true;
      try {
        await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false
      }
    },
    async complete(id){
      try {
        await this.completeAction({id});
        await this.fetchData();
      } catch (e) {
        console.error(e)
      }
    },
    async extend(id){
      try {
        await this.extendAction({id});
        await this.fetchData();
      } catch (e) {
        console.error(e)
      }
    },
    async deleteItem(id){
      try {
        await this.deleteAction({id});
        await this.fetchData();
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
