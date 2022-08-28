<template>
  <div v-swiper:productSwiper="options" class="auth-product-slider" ref="productSwiper">
    <div class="swiper-wrapper auth-product-slider__wrapper">
      <div class="swiper-slide auth-product-slider__item" v-for="(list,i) of productList" :key="i">
        <div class="auth-product-slider__icon" v-for="(name,key) of list" :key="key">{{ name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    options: {
      breakpoints: {
        320: {
          sliderPerView: 1
        },
        768: {
          slidesPerView: 6,
        }
      },
      loop: true,
      speed: 15000,
      autoplay: {
        enabled: true,
        delay: 0,
      },
    },
    productList: [
      [
        '🐖','🥩','🐔','🐟','🥚','🍶','🍚','🍯'
      ],
      [
        '🍎','🍐','🥜','🍓','🍑','🍒','🍇','🍯'
      ],
      [
        '🥔','🍠','🥕','🍯','🧅','🍅','🥒','🥬'
      ]
    ]
  }),
  mounted() {
    this.productAnimation()
  },
  methods: {
    productAnimation(){
      const getItems = this.$refs.productSwiper.querySelectorAll('.auth-product-slider__item');
      if(getItems.length){
        getItems.forEach((item) => {
          const getContainerWidth = item.offsetWidth;
          const getContainerHeight = item.offsetHeight;
          const getIcons = item.querySelectorAll('.auth-product-slider__icon');
          if(getIcons.length){
            getIcons.forEach(icon => {
              this.randomMove(icon,'left',getContainerWidth - icon.offsetWidth);
              this.randomMove(icon,'top',getContainerHeight - icon.offsetHeight);
            })
          }
        })
      }
    },
    randomMove(target,prop,value){
      const gsap = this.$gsap
      gsap.to(target, {
        [prop]: Math.random() * value,
        duration: 8,
        ease:'none',
        onComplete: this.randomMove,
        onCompleteParams: [target, prop, value],
      });
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
