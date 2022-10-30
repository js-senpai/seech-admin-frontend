<template>
  <b-nav class="header-nav">
    <b-nav-item v-for="{name,url,isCart,classNames} in menu" :key="name" :class="`header-nav__item ${classNames}`">
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
