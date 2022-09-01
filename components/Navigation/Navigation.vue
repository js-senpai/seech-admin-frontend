<template>
  <b-nav class="header-nav">
    <b-nav-item class="header-nav__item">
      <NuxtLink to="/" class="header-nav__item-link">{{$t('kpi.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item class="header-nav__item">
      <NuxtLink to="/kpiMonthly" class="header-nav__item-link">{{$t('kpiMonthly.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item class="header-nav__item">
      <NuxtLink to="/ticketsBuy" class="header-nav__item-link">{{$t('ticketsBuy.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item class="header-nav__item">
      <NuxtLink to="/ticketsSale" class="header-nav__item-link">{{$t('ticketsSale.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item class="header-nav__item">
      <NuxtLink to="/prices" class="header-nav__item-link">{{$t('prices.title')}}</NuxtLink>
    </b-nav-item>
  </b-nav>
</template>
<script>
export default {

}
</script>
<style lang="scss">
@import "scss/index";
</style>
