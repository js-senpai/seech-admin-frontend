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
    :modal-description-title="$t('sell.descriptionModal.title')"
    :modal-description-sub-title="$t('sell.descriptionModal.subtitle')"
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
  computed: {
    user(){
      return this.$auth.user
    }
  },
  methods: {
    getDescription({_id}){
      this.items = this.items.map(item => ({
        ...item,
        showModal: item._id === _id
      }))
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
          showModal: false,
          weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
          price: `${price} ${this.$i18n.t(`units.currency`)}/${this.$i18n.t(`units.${weightType}`)}`,
          address: `${getRegions[region]?.name || '-'} ${this.$i18n.t(`units.state`)}, ${getRegions[region]?.states[state]?.otg[otg] || '-'} ${this.$i18n.t(`units.otg`)}`
        })).sort((a) =>
          a?.region === this.user?.region ||
          a?.state === this.user?.countryState ||
          a?.otg === this.user?.countryOtg
            ? 1
            : -1,
        );
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
