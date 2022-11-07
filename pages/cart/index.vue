<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/cart"
    :get-api-data="getData"
    :enable-photo="true"
    :enable-filter="false"
    :title="$t('cart.title')"
  >
    <template #header>
      <button  :class="`custom-btn ${pageType === 'sell' ? 'dark': 'light'}  round-circle product-shop__btn-tab ml-md-auto mr-2`" type="button"   @click="chooseTab('sell')">
        <span>{{$t('cart.tabs.sell')}}</span>
        <span class="products-shop__btn-tab__total">{{totalSell}}</span>
      </button>
      <button  :class="`custom-btn ${pageType === 'buy' ? 'dark': 'light'} round-circle product-shop__btn-tab`" type="button" @click="chooseTab('buy')">
        <span>{{$t('cart.tabs.buy')}}</span>
        <span class="products-shop__btn-tab__total">{{totalBuy}}</span>
      </button>
    </template>
    <template #cardFooter="{_id,showModal,description}">
      <footer  class="products-shop__list-footer-with-icons mt-2">
        <button type="button" class="text-success products-shop__list-footer-with-icons__btn" @click="complete(_id)">
          <b-icon icon="check2" class="products-shop__list-footer-with-icons__btn-complete__icon" />
        </button>
        <button  type="button" class="products-shop__list-footer-with-icons__btn" @click="getDescription(_id)">
          <b-icon icon="chat-text" class="products-shop__list-footer-with-icons__btn-complete__icon" />
        </button>
        <button type="button" class="text-danger products-shop__list-footer-with-icons__btn" @click="deleteItem(_id)">
          <b-icon icon="trash" class="products-shop__list-footer-with-icons__btn-complete__icon" />
        </button>
      </footer>
      <div v-show="showModal" class="products-shop__modal-description">
        <BContainer fluid>
          <BRow>
            <BCol cols="12" >
              <header class="products-shop__modal-description__header">
                <button type="button" class="products-shop__modal-description__close" @click="hideDescriptionModal(_id)">
                  <b-icon  icon="chevron-left" />
                </button>
                <div class="products-shop__modal-description__title">{{$t('buy.descriptionModal.title')}}</div>
              </header>
              <div class="products-shop__modal-description__body">
                <div class="products-shop__modal-description__subtitle">{{$t('buy.descriptionModal.subtitle')}}</div>
                <div class="products-shop__modal-description__text" v-html="description" />
              </div>
            </BCol>
          </BRow>
        </BContainer>
      </div>
    </template>
  </ProductsShop>
</template>
<script>
import {mapActions} from "vuex";

export default {
  components: {
    ProductsShop: () => import("@/components/Ui/ProductsShop/ProductsShop"),
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
  },
  methods: {
    ...mapActions({
       deleteTicket: 'basket/removeFromCart',
       completeTicket: 'basket/completeTicket',
       getTotalTickets: 'basket/getTotalBasket'
    }),
    getDescription(_id){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = !this.items[findIndex].showModal
      }
    },
    hideDescriptionModal(_id){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = false
      }
    },
    async getData({type = 'sell'}) {
      const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/basket/${type}`);
      const getRegions = this.$i18n.t(`regions`);
      this.items = items.map(({region,state,otg,weight,weightType,...data}) => ({
        ...data,
        showModal: false,
        weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
        address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
      }));
      const { data: { totalBuy = 0,totalSell = 0 } } = await this.$axios.get(`${this.$config.backendUrl}/basket/total-by-types`);
      this.totalSell = totalSell;
      this.totalBuy = totalBuy;
    },
    async complete(id){
      try {
        await this.completeTicket({_id: id});
        await this.getTotalTickets();
        await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e)
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('cart.notifications.complete.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
      }
    },
    async deleteItem(id){
      try {
        await this.deleteTicket({_id: id});
        await this.getTotalTickets();
        await this.getData({type: this.pageType});
      } catch (e) {
        console.error(e)
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('cart.notifications.delete.title'),
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
