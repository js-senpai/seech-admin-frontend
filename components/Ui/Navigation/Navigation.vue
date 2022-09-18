<template>
  <b-nav class="header-nav">
    <b-nav-item class="header-nav__item" v-for="{name,url} in menu" :key="name">
      <NuxtLink :to="url" class="header-nav__item-link">{{name}}</NuxtLink>
    </b-nav-item>
  </b-nav>
</template>
<script>
export default {
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
