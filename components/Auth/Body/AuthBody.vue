<template>
  <section class="auth-body">
    <BContainer>
      <BRow>
        <BCol cols="12">
          <AuthTitle />
        </BCol>
      </BRow>
    </BContainer>
    <AuthProductSlider />
    <BContainer>
      <BRow>
        <BCol cols="12" class="d-flex justify-content-center">
          <TelegramLink />
        </BCol>
      </BRow>
    </BContainer>
  </section>
</template>
<script>
export default {
  components: {
    AuthProductSlider: () => import("../ProductSlider/AuthProductSlider"),
    TelegramLink: () => import("../TelegramLink/TelegramLink"),
    AuthTitle: () => import("../Title/AuthTitle")
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
