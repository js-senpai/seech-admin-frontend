<template>
  <div class="login-page">
    <AuthHeader />
    <AuthBody />
    <AuthFooter />
  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  components: {
    AuthFooter: () => import("../../components/Auth/Footer/AuthFooter"),
    AuthBody: () => import("../../components/Auth/Body/AuthBody"),
    AuthHeader: () => import("../../components/Auth/Header/AuthHeader"),
  },
}
</script>
