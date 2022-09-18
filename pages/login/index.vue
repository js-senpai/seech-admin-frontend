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
    AuthFooter: () => import("../../components/Ui/Auth/Footer/AuthFooter"),
    AuthBody: () => import("../../components/Ui/Auth/Body/AuthBody"),
    AuthHeader: () => import("../../components/Ui/Auth/Header/AuthHeader"),
  },
}
</script>
