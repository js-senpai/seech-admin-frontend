<template>
  <BContainer class="auth-header">
    <BRow>
      <BCol cols="6">
         <b-img-lazy src="~/assets/img/header/logo.svg" />
      </BCol>
      <BCol cols="6" class="d-flex justify-content-end">
         <Login />
      </BCol>
    </BRow>
  </BContainer>
</template>
<script>
export default {
  components: {
    Login: () => import("../Login/Login")
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
