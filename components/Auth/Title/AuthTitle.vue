<template>
  <div class="auth-title">
    <div class="auth-title__item">
       <LightLink :text="$t('auth.links.sell')" url="https://t.me/seech_bot" />
    </div>
    <div class="auth-title__item">
      {{ $t('auth.title.first') }}
    </div>
    <div class="auth-title__item">
      <LightLink :text="$t('auth.links.buy')" url="https://t.me/seech_bot" />
    </div>
    <div class="auth-title__item font-weight-bold">
      {{ $t('auth.title.second') }}
    </div>
  </div>
</template>
<script>
export default {
  components: {
    LightLink: () => import("../../Ui/Links/LightLink")
  }
}
</script>
<style lang="scss">
 @import "scss/index";
</style>
