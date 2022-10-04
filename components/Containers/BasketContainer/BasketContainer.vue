<template>
  <div class="basket">
    <slot />
    <div class="basket__total">{{total}}</div>
  </div>
</template>
<script>
import {mapGetters,mapActions} from "vuex";
export default {
  computed: {
    ...mapGetters({
      total: 'basket/getTotalBasket',
    }),
  },
  methods: {
    ...mapActions({
      getTotal: 'basket/getTotalBasket'
    }),
  },
  async mounted(){
    try {
      await this.getTotal();
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
<style lang="scss">
 @import "scss/index";
</style>
