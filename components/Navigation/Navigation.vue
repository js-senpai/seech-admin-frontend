<template>
  <b-nav>
    <b-nav-item>
      <NuxtLink to="/">{{$t('kpi.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item>
      <NuxtLink to="/ticketsBuy">{{$t('ticketsBuy.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item>
      <NuxtLink to="/ticketsSale">{{$t('ticketsSale.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item>
      <NuxtLink to="/kpiMonthly">{{$t('kpiMonthly.title')}}</NuxtLink>
    </b-nav-item>
    <b-nav-item>
      <NuxtLink to="/prices">{{$t('prices.title')}}</NuxtLink>
    </b-nav-item>
  </b-nav>
</template>
<script>
export default {

}
</script>
