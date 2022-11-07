<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/my-requests"
    :get-api-data="getData"
    :enable-photo="true"
    :enable-filter="false"
    :not-found-text="notFoundText"
  >
    <template #header>
      <button  :class="`custom-btn ${pageType === 'sell' ? 'dark': 'light'}  round-circle product-shop__btn-tab  mr-2`" type="button"   @click="chooseTab('sell')">
        <span>{{$t('myRequests.tabs.sell')}}</span>
        <span class="products-shop__btn-tab__total">{{totalSell}}</span>
      </button>
      <button  :class="`custom-btn ${pageType === 'buy' ? 'dark': 'light'} round-circle product-shop__btn-tab`" type="button" @click="chooseTab('buy')">
        <span>{{$t('myRequests.tabs.buy')}}</span>
        <span class="products-shop__btn-tab__total">{{totalBuy}}</span>
      </button>
    </template>
    <template #cardFooter="{_id,active}">
      <footer  class="products-shop__list-footer-with-icons mt-2">
        <button type="button" class="text-success products-shop__list-footer-with-icons__btn" @click="complete(_id)">
          <b-icon icon="check2" class="products-shop__list-footer-with-icons__btn-icon" />
        </button>
        <button :disabled="active" type="button" class="products-shop__list-footer-with-icons__btn" @click="extend(_id)">
          <b-img-lazy src="~/assets/img/myRequests/extend.svg" class="products-shop__list-footer-with-icons__btn-icon" />
        </button>
        <button type="button" class="text-danger products-shop__list-footer-with-icons__btn" @click="deleteItem(_id)">
          <b-icon icon="trash" class="products-shop__list-footer-with-icons__btn-icon" />
        </button>
      </footer>
    </template>
  </ProductsShop>
</template>
<script>
export default {
  components: {
    ProductsShop: () => import("@/components/Ui/ProductsShop/ProductsShop")
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    pageType: 'sell',
    totalBuy: 0,
    totalSell: 0,
    items: [],
  }),
  async fetch(){
    await this.getData({type: this.pageType})
  },
  computed: {
    rows(){
      return this.items.length
    },
    notFoundText(){
      return this.$i18n.t(`myRequests.notFound.${this.pageType}`)
    }
  },
  methods: {
    async getData({type = 'sell'}) {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/my-requests/${type}`);
        const getRegions = this.$i18n.t(`regions`);
        this.items = items.map(({region,state,otg,weight,weightType,...data}) => ({
          ...data,
          weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
          address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
        }))
        const { data: { totalBuy = 0,totalSell = 0 } } = await this.$axios.get(`${this.$config.backendUrl}/my-requests/total`);
        this.totalSell = totalSell;
        this.totalBuy = totalBuy;
    },
    async chooseTab(type = 'sell'){
      this.pageType = type;
      await this.getData({type: this.pageType});
    },
    async complete(id){
      try {
          await this.$axios.put(`${this.$config.backendUrl}/my-requests/complete/${id}`);
          await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e)
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('myRequests.notifications.complete.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
      }
    },
    async extend(id){
      try {
        await this.$axios.put(`${this.$config.backendUrl}/my-requests/extend/${id}`);
        await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e)
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('myRequests.notifications.extend.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
      }
    },
    async deleteItem(id){
      try {
        await this.$axios.delete(`${this.$config.backendUrl}/my-requests/${id}`);
        await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e)
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('myRequests.notifications.delete.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
      }
    }
  }
}
</script>
