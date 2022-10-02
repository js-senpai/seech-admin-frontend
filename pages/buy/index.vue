<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/"
    :get-api-data="getData"
    :title="$t('buy.title')"
    :btn-left-text="$t('buy.buttons.left')"
    :btn-right-text="$t('buy.buttons.right')"
    :show-img="true"
    :btn-left-method="addToCart"
    :btn-right-method="getDescription"
    :modal-description-title="$t('buy.descriptionModal.title')"
    :modal-description-sub-title="$t('buy.descriptionModal.subtitle')"
    :add-new-ticket="addNewTicket"
  />
</template>
<script>
import {mapActions} from "vuex";

export default {
  layout: 'auth',
  middleware: 'isAuthenticated',
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
    ...mapActions({
      addToBasket: 'basket/addToCart',
      getTotal: 'basket/getTotalBasket'
    }),
    getDescription({_id}){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = !this.items[findIndex].showModal
      }
    },
    async addToCart({_id}){
      try {
        const findIndex = this.items.findIndex(item => item._id === _id);
        if(findIndex !== -1){
          await this.addToBasket(this.items[findIndex]);
          await this.getTotal();
          await this.getData({queryParams: ''})
        }
      } catch (e) {
        console.error(e);
      }
    },
    async addNewTicket(data){
      try {
        await this.$axios.post(`${this.$config.backendUrl}/buy-products`,data)
        await this.getData({queryParams: ''})
      } catch (e) {
        console.error(e);
      }
    },
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/buy-products${queryParams ? `?${queryParams}`: ''}`);
        const getRegions = this.$i18n.t(`regions`);
        this.items = items.map(({active,region,state,otg,weight,weightType,price,...data}) => ({
          ...data,
          showModal: false,
          weight: `${weight} ${this.$i18n.t(`units.${weightType}`)}`,
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
