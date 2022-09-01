<template>
  <b-navbar toggleable="lg" class="header">
    <b-navbar-brand href="/">
      <b-img-lazy src="~/assets/img/header/logo.svg" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <Navigation />
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto header__user-settings">
        <b-nav-item-dropdown  right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-img-lazy src="~/assets/img/header/user.png" rounded="true" width="40" class="mr-2" />
            <span class="header__user-settings__name">{{user.name}}</span>
            <font-awesome-icon :icon="['fas','chevron-down']" class="header__user-settings__icon" />
          </template>
          <b-dropdown-item href="#" @click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  components: {
    Navigation: () => import("../Navigation/Navigation")
  },
  computed: {
    user(){
      return this.$auth.user
    }
  },
  methods: {
    async logout(){
      try {
        await this.$auth.logout();
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
