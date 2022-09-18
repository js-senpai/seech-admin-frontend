<template>
  <div class="error-img">
    <div class="error-img__container">
      <b-img-lazy src="~/assets/img/errors/img.svg" class="error-img__icon" />
      <div class="error-img__title">{{$t('errors.notFound.img')}}</div>
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
