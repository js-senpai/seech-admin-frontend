<template>
  <ProductRequests
    :title="$t('cart.tabs.title')"
    :sell-button="$t('cart.tabs.sell')"
    :total-sell="totalSell"
    :buy-button="$t('cart.tabs.buy')"
    :total-buy="totalBuy"
    :items="items"
    :enable-extend="false"
    :not-found-sell-text="$t('errors.notFound.products')"
    :not-found-buy-text="$t('errors.notFound.products')"
    :get-data="getData"
    :complete-action="complete"
    :delete-action="deleteItem"
  />
</template>
<script>
import {mapActions} from "vuex";

export default {
  components: {
    ProductRequests: () => import( "../../components/Ui/ProductRequests/ProductRequests"),
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    totalBuy: 0,
    totalSell: 0,
    items: [],
  }),
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
    async getData({type = 'sell'}) {
      const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/basket/${type}`);
      const getRegions = this.$i18n.t(`regions`);
      this.items = items.map(({region,state,otg,weight,weightType,...data}) => ({
        ...data,
        weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
        address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
      }))
      const { data: { totalBuy = 0,totalSell = 0 } } = await this.$axios.get(`${this.$config.backendUrl}/basket/total-by-types`);
      this.totalSell = totalSell;
      this.totalBuy = totalBuy;
    },
    async complete({id}){
      try {
        await this.completeTicket({_id: id});
        await this.getTotalTickets();
      } catch (e) {
        console.error(e)
      }
    },
    async deleteItem({id}){
      try {
        await this.deleteTicket({_id: id});
        await this.getTotalTickets();
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
