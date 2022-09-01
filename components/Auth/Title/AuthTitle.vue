<template>
  <div class="auth-title">
    <div class="auth-title__item">
      <a class="light-btn auth-title__link" target="_blank" href="https://t.me/seech_bot">{{ $t('auth.links.sell') }}</a>
    </div>
    <div class="auth-title__item">
      {{ $t('auth.title.first') }}
    </div>
    <div class="auth-title__item">
      <a class="light-btn auth-title__link" href="https://t.me/seech_bot" target="_blank">{{$t('auth.links.buy')}}</a>
    </div>
    <div class="auth-title__item font-weight-bold">
      {{ $t('auth.title.second') }}
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
 @import "scss/index";
</style>
