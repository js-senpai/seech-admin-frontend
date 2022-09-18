<template>
  <footer class="auth-footer">
    <BContainer>
      <BRow>
        <BCol sm="12" md="6" class="d-flex justify-content-center justify-content-md-start align-items-center mb-3 mb-md-0">
          <a href="mailto:support@seech.com.ua" class="auth-footer__email">support@seech.com.ua</a>
        </BCol>
        <BCol sm="12" md="6" class="d-flex justify-content-center justify-content-md-end align-items-center">
          <Socials />
        </BCol>
      </BRow>
    </BContainer>
  </footer>
</template>
<script>
export default {
  components: {
    Socials: () => import("../../Socials/Socials")
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
