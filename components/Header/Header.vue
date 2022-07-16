<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="/">Seech admin</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown  right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-img-lazy src="~/assets/img/user.png" rounded="true" width="30" class="mr-1" />
            <span>{{user.name}}</span>
          </template>
          <b-dropdown-item href="#" @click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
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
