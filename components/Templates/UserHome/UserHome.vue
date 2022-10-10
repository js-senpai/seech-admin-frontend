<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/"
    :get-api-data="getData"
    :title="$t('sell.title')"
    :btn-basket-text="$t('sell.buttons.left')"
    :btn-description-text="$t('sell.buttons.right')"
    :show-img="true"
    :btn-description-method="getDescription"
    :btn-basket-method="addToCart"
    :btn-delete-from-basket-method="removeFromCart"
    :modal-description-title="$t('sell.descriptionModal.title')"
    :modal-description-sub-title="$t('sell.descriptionModal.subtitle')"
    :enable-price="true"
    :enable-photo="true"
    :add-new-ticket="addNewTicket"
  />
</template>
<script>
import {mapActions} from "vuex";

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
    ...mapActions({
      addToBasket: 'basket/addToCart',
      getTotal: 'basket/getTotalBasket',
      removeFromBasket: 'basket/removeFromCart'
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
    async removeFromCart({_id}){
      try {
        const findIndex = this.items.findIndex(item => item._id === _id);
        if(findIndex !== -1){
          await this.removeFromBasket(this.items[findIndex]);
          await this.getTotal();
          await this.getData({queryParams: ''})
        }
      } catch (e) {
        console.error(e);
      }
    },
    async addNewTicket(data){
      try {
        await this.$axios.post(`${this.$config.backendUrl}/sell-products`,data)
        await this.getData({queryParams: ''})
      } catch (e) {
        console.error(e);
      }
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
