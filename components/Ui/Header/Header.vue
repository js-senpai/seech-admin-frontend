<template>
  <div class="header__container">
    <b-navbar toggleable="lg" class="bg-light header" fixed="top">
      <b-navbar-brand href="/">
        <b-img-lazy src="~/assets/img/header/logo.svg" />
      </b-navbar-brand>

      <NuxtLink to="/cart" class="d-md-none custom-btn round-circle btn-light header__cart">
        <BasketContainer>
          <span>{{$t('cart.title')}}</span>
        </BasketContainer>
      </NuxtLink>

      <b-navbar-toggle target="nav-collapse" class="header__toggle">
        <template #default="{ expanded }">
          <b-icon v-if="expanded" icon="x"></b-icon>
          <b-icon v-else icon="justify"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <Navigation :menu="menu" />
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto header__user-settings">
          <b-nav-item-dropdown  right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <b-img-lazy src="~/assets/img/header/user.png" rounded="true" width="40" class="mr-2" />
              <span class="header__user-settings__name">{{user.name}}</span>
              <font-awesome-icon :icon="['fas','chevron-down']" class="header__user-settings__icon" />
            </template>
            <b-dropdown-item href="/account">{{$t('account.title')}}</b-dropdown-item>
            <b-dropdown-item href="#" @click="logout()">{{$t('buttons.logout')}}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  components: {
    Navigation: () => import("../Navigation/Navigation"),
    BasketContainer: () => import("@/components/Containers/BasketContainer/BasketContainer")
  },
  data: () => ({
    menu: []
  }),
  fetch() {
    this.menu = ['admin','moderator'].includes(this.user.type) ? [
      {
        name: this.$i18n.t('kpi.title'),
        url: '/'
      },
      {
        name: this.$i18n.t('kpiMonthly.title'),
        url: '/admin/kpiMonthly'
      },
      {
        name: this.$i18n.t('ticketsSale.title'),
        url: '/admin/ticketsSale'
      },
      {
        name: this.$i18n.t('ticketsBuy.title'),
        url: '/admin/ticketsBuy'
      },
      {
        name: this.$i18n.t('prices.title'),
        url: '/admin/prices'
      },
    ]: [
      {
        name: this.$i18n.t('sell.title'),
        url: '/'
      },
      {
        name: this.$i18n.t('buy.title'),
        url: '/buy'
      },
      {
        name: this.$i18n.t('myRequests.title'),
        url: '/my-requests'
      },
      {
        name: this.$i18n.t('cart.title'),
        url: '/cart',
        isCart: true,
        classNames: 'd-none d-md-block'
      },
    ]
  },
  fetchOnServer: true,
  computed: {
    user(){
      return this.$auth.user
    }
  },
  methods: {
    async logout(){
      try {
        await this.$auth.logout();
        await this.$auth.strategy.token.reset();
        await this.$router.push('/login');
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
