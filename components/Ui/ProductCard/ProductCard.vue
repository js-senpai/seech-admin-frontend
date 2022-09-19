<template>
  <div class="product-card">
    <div :class="`product-card__container ${showImg ? 'two-columns': ''}`">
      <div v-if="showImg" class="product-card__img-container">
        <b-img-lazy v-if="img" :src="img"  class="product-card__img" />
        <ImgError v-else />
      </div>
      <div class="product-card__body">
        <h4 class="product-card__title">{{title}}</h4>
        <time class="d-flex align-items-center product-card__time" :datetime="getTime">
          <font-awesome-icon :icon="['far', 'clock']" class="product-card__icon"  />
          <span>{{getTime}}</span>
        </time>
        <ul class="product-card__info">
          <li v-if="price" class="product-card__info-item">
            <b-img-lazy src="~/assets/img/productCard/money.svg" class="product-card__icon" />
            <span class="font-weight-bold">{{price}}</span>
          </li>
          <li v-if="weight" class="product-card__info-item">
            <font-awesome-icon :icon="['fas', 'scale-balanced']"  class="product-card__icon"  />
            <span class="font-weight-bold">{{weight}}</span>
          </li>
          <li v-if="author" class="product-card__info-item">
            <b-img-lazy src="~/assets/img/productCard/user.svg" class="product-card__icon" />
            <span>{{author}}</span>
          </li>
          <li v-if="phone" class="product-card__info-item">
            <b-img-lazy src="~/assets/img/productCard/phone.svg" class="product-card__icon" />
            <a :href="`tel:${phone}`">{{phone}}</a>
          </li>
          <li v-if="address" class="product-card__info-item">
            <b-img-lazy src="~/assets/img/productCard/map.svg" class="product-card__icon" />
            <span>{{address}}</span>
          </li>
        </ul>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  components: {
    ImgError: () => import("@/components/Ui/Errors/ImgError/ImgError")
  },
  props: {
    showImg: {
      type: Boolean,
      required: false,
      default: false
    },
    img: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: true,
      default: 'Unknown'
    },
    updatedAt: {
      type: String,
      required: true,
      default: new Date()
    },
    price: {
      type: String,
      required: false,
      default: '0 грн/кг'
    },
    weight: {
      type: String,
      required: true,
      default: '0 кг'
    },
    author: {
      type: String,
      required: true,
      default: 'User'
    },
    phone: {
      type: Number,
      required: true,
      default: 0
    },
    address: {
      type: String,
      required: true,
    },
  },
  computed: {
    getTime() {
      return this.$moment(this.updatedAt).format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
