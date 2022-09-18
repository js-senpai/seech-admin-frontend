<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/"
    :get-api-data="getData"
    :title="$t('sell.title')"
    :btn-left-text="$t('sell.buttons.left')"
    :btn-right-text="$t('sell.buttons.right')"
    :show-img="true"
    :btn-left-method="getDescription"
    :btn-right-method="addToCart"
  />
</template>
<script>
export default {
  components: {
    ProductsShop: () => import("@/components/Ui/ProductsShop/ProductsShop")
  },
  data: () => ({
    items: [],
  }),
  methods: {
    getDescription(){
      console.log('description')
    },
    addToCart(){
      console.log('addToCart')
    },
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/sell-products${queryParams ? `?${queryParams}`: ''}`);
        const getRegions = this.$i18n.t(`regions`);
        this.items = items.map(({active,region,state,otg,weight,weightType,price,...data}) => ({
          ...data,
          weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
          price: `${price} ${this.$i18n.t(`units.currency`)}/${this.$i18n.t(`units.${weightType}`)}`,
          address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
        }));
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
