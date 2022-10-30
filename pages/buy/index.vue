<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/buy"
    :get-api-data="getData"
    :title="$t('buy.title')"
    :btn-basket-text="$t('buy.buttons.left')"
    :btn-description-text="$t('buy.buttons.right')"
    :show-img="true"
    :btn-delete-from-basket-method="removeFromCart"
    :btn-basket-method="addToCart"
    :btn-description-method="getDescription"
    :modal-description-title="$t('buy.descriptionModal.title')"
    :modal-description-sub-title="$t('buy.descriptionModal.subtitle')"
    :add-new-ticket="addNewTicket"
  />
</template>
<script>
import {mapActions} from "vuex";

export default {
  components: {
    ProductsShop: () => import("@/components/Ui/ProductsShop/ProductsShop")
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
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
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('notifications.wishlist.cancel.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2500,
          toaster: 'b-toaster-bottom-right'
        })
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
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('notifications.wishlist.add.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 2500,
          toaster: 'b-toaster-bottom-right'
        })
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
