<template>
  <AdminHome v-if="['admin','moderator'].includes(user.type)" />
  <UserHome v-else />
</template>

<script>
export default {
  name: 'IndexPage',
  components: {
    UserHome: () => import("@/components/Templates/UserHome/UserHome"),
    AdminHome: () => import("@/components/Templates/AdminHome/AdminHome"),
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  computed: {
    user(){
      return this.$auth.user
    }
  },
}
</script>
