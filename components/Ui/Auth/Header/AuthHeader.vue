<template>
  <BContainer class="auth-header">
    <BRow>
      <BCol sm="12" md="6" class="d-flex justify-content-center justify-content-md-start mb-4 mb-md-0">
         <b-img-lazy width="110" src="~/assets/img/header/logo.svg" />
      </BCol>
      <BCol sm="12" md="6" class="d-flex justify-content-center justify-content-md-end">
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
