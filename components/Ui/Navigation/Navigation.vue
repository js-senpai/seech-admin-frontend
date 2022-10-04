<template>
  <b-nav class="header-nav">
    <b-nav-item class="header-nav__item" v-for="{name,url,isCart} in menu" :key="name">
        <NuxtLink :to="url" class="header-nav__item-link">
          <BasketContainer v-if="isCart">
            <span>{{name}}</span>
          </BasketContainer>
          <span v-else>{{name}}</span>
      </NuxtLink>
    </b-nav-item>
  </b-nav>
</template>
<script>
export default {
  components: {
    BasketContainer: () => import("@/components/Containers/BasketContainer/BasketContainer")
  },
  props: {
     menu: {
       type: Array,
       required: true,
       default: () => []
     }
   }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
