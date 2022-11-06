<template>
  <ProductsShop
    :data.sync="items"
    redirect-path="/"
    :get-api-data="getData"
    :enable-photo="true"
    :title="$t('sell.title')"
  >
    <template #header>
      <div class="d-flex position-relative align-items-center statistic-table__btn-container">
        <button  class="custom-btn light round-circle products-shop__add-btn mr-1"  type="button" @click="showAddModal = !showAddModal">
          <font-awesome-icon :icon="['fas', 'plus']" class="mr-2"   />
          <span>{{$t('buttons.add')}}</span>
        </button>
        <CreateRequestModal
          class="products-shop__request-modal"
          :show-modal.sync="showAddModal"
          :enable-photo="true"
          :enable-price="true"
          :reset-modal="hideAddModal"
          :apply-modal="applyAddModal"
        />
      </div>
    </template>
    <template #cardFooter="{ownTicket = false,_id,inBasket = false,showModal = false,description = ''}">
      <footer v-if="!ownTicket" class="products-shop__list-footer mt-2">
        <button
          type="button"
          class="custom-btn light round-circle"
          @click="getDescription({_id})"
        >{{$t('sell.buttons.right')}}</button>
        <button
          v-if="inBasket"
          type="button"
          class="products-shop__btn-wishlist active"
          @click="removeFromCart({_id})"
        >
          <b-icon  icon="heart-fill" />
        </button>
        <button
          v-else
          type="button"
          class="products-shop__btn-wishlist"
          @click="addToCart({_id})"
        ><b-icon  icon="heart" /></button>
      </footer>
      <div v-show="showModal" class="products-shop__modal-description">
        <BContainer fluid>
          <BRow>
            <BCol cols="12" >
              <header class="products-shop__modal-description__header">
                <button type="button" class="products-shop__modal-description__close" @click="hideDescriptionModal(_id)">
                  <b-icon  icon="chevron-left" />
                </button>
                <div class="products-shop__modal-description__title">{{$t('sell.descriptionModal.title')}}</div>
              </header>
              <div class="products-shop__modal-description__body">
                <div class="products-shop__modal-description__subtitle">{{$t('sell.descriptionModal.subtitle')}}</div>
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
    CreateRequestModal: () => import("@/components/Ui/CreateRequestModal/CreateRequestModal"),
    ProductsShop: () => import("@/components/Ui/ProductsShop/ProductsShop")
  },
  data: () => ({
    items: [],
    showAddModal: false
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
      } finally {
        this.$bvToast.toast(' ', {
          title: this.$i18n.t('notifications.wishlist.add.title'),
          variant: 'success',
          solid: true,
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
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
          autoHideDelay: 1500,
          toaster: 'b-toaster-bottom-right'
        })
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
    hideAddModal(){
      this.showAddModal = false;
    },
    applyAddModal(data){
      this.addNewTicket(data)
    },
    hideDescriptionModal(_id){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = false
      }
    },
    getDescription({_id}){
      const findIndex = this.items.findIndex(item => item._id === _id);
      if(findIndex !== -1){
        this.items[findIndex].showModal = !this.items[findIndex].showModal
      }
    },
  }
}
</script>
