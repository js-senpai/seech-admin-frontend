<template>
  <div class="my-requests">
    <BContainer fluid>
      <BRow>
        <BCol cols="12" >
          <div class="my-requests__card bg-white">
            <header class="mb-4 d-flex justify-content-between flex-wrap align-items-center my-requests__card-header">
              <h2 class="my-requests__title mb-2 mb-md-0">{{$t('myRequests.title')}}</h2>
              <div class="d-flex position-relative align-items-center align-items-md-end my-requests__btn-container">
                <button  :class="`custom-btn ${pageType === 'sell' ? 'dark': 'light'}  round-circle my-requests__btn-tab  mr-2`" type="button"   @click="chooseTab('sell')">
                  <span>{{$t('myRequests.tabs.sell')}}</span>
                  <span class="my-requests__btn-tab__total">{{totalSell}}</span>
                </button>
                <button  :class="`custom-btn ${pageType === 'buy' ? 'dark': 'light'} round-circle my-requests__btn-tab`" type="button" @click="chooseTab('buy')">
                  <span>{{$t('myRequests.tabs.buy')}}</span>
                  <span class="my-requests__btn-tab__total">{{totalBuy}}</span>
                </button>
              </div>
            </header>
            <div class="mb-4 d-flex">
              <div>{{ $t('other.totalItems', { total: rows }) }}</div>
            </div>
            <div class="mb-4 my-requests__list-container">
              <div class="my-requests__list">
                <b-spinner v-if="isLoad" class="my-requests__loader" />
                <ProductCard
                  v-for="{title,updatedAt,price,weight,author,phone,address,_id,active = false} in items"
                  v-else-if="!isLoad && items.length"
                  :key="_id"
                  :active="active"
                  :enable-img="false"
                  class="my-requests__list-item"
                  :title="title"
                  :updated-at="updatedAt"
                  :price="price"
                  :weight="weight"
                  :author="author"
                  :phone="phone"
                  :address="address"
                >
                  <footer  class="my-requests__list-footer mt-2">
                    <button type="button" class="custom-btn round-square my-requests__list-footer__btn-complete w-100 mb-2" @click="complete(_id)">
                      <b-icon icon="check2" class="my-requests__list-footer__btn-complete__icon" />
                      <span>{{$t('myRequests.buttons.complete')}}</span>
                    </button>
                    <button v-if="!active" type="button" class="custom-btn light round-square my-requests__list-footer__btn w-100  mb-2" @click="extend(_id)">{{$t('myRequests.buttons.extend')}}</button>
                    <button type="button" class="custom-btn light my-requests__list-footer__btn w-100" @click="deleteItem(_id)">{{$t('myRequests.buttons.delete')}}</button>
                  </footer>
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
    ProductCard: () => import('@/components/Ui/ProductCard/ProductCard')
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    totalBuy: 0,
    totalSell: 0,
    pageType: 'sell',
    items: [],
    isLoad: true,
  }),
  async fetch(){
    await this.getData();
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
    async chooseTab(type = 'sell'){
      this.pageType = type;
      await this.getData()
    },
    async getData() {
      this.isLoad = true;
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/my-requests/${this.pageType}`);
        const getRegions = this.$i18n.t(`regions`);
        this.items = items.map(({region,state,otg,weight,weightType,...data}) => ({
          ...data,
          weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
          address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
        }))
        const { data: { totalBuy = 0,totalSell = 0 } } = await this.$axios.get(`${this.$config.backendUrl}/my-requests/total`);
        this.totalSell = totalSell;
        this.totalBuy = totalBuy;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoad = false;
      }
    },
    async complete(id){
      try {
          await this.$axios.put(`${this.$config.backendUrl}/my-requests/${this.pageType}/complete/${id}`);
          await this.getData();
      } catch (e) {
        console.error(e)
      }
    },
    async extend(id){
      try {
        await this.$axios.put(`${this.$config.backendUrl}/my-requests/${this.pageType}/extend/${id}`);
        await this.getData();
      } catch (e) {
        console.error(e)
      }
    },
    async deleteItem(id){
      try {
        await this.$axios.delete(`${this.$config.backendUrl}/my-requests/${this.pageType}/${id}`);
        await this.getData();
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
