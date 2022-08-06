<template>
  <Login />
</template>
<script>
export default {
  name: 'LoginPage',
  components: {
    Login: () => import("~/components/Auth/Login/Login")
  },
}
</script>
