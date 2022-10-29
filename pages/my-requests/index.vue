<template>
  <ProductRequests
    :sell-button="$t('myRequests.tabs.sell')"
    :total-sell="totalSell"
    :buy-button="$t('myRequests.tabs.buy')"
    :total-buy="totalBuy"
    :items="items"
    :enable-extend="true"
    :not-found-sell-text="$t('myRequests.notFound.sell')"
    :not-found-buy-text="$t('myRequests.notFound.buy')"
    :get-data="getData"
    :complete-action="complete"
    :delete-action="deleteItem"
    :extend-action="extend"
  />
</template>
<script>
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
    async complete({id}){
      try {
          await this.$axios.put(`${this.$config.backendUrl}/my-requests/complete/${id}`);
      } catch (e) {
        console.error(e)
      }
    },
    async extend({id}){
      try {
        await this.$axios.put(`${this.$config.backendUrl}/my-requests/extend/${id}`);
      } catch (e) {
        console.error(e)
      }
    },
    async deleteItem({id}){
      try {
        await this.$axios.delete(`${this.$config.backendUrl}/my-requests/${id}`);
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
