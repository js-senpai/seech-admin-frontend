<template>
  <a :href="url" class="light-link">
    <slot />
    {{ text }}
  </a>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
      default: ''
    },
    text: {
      type: String,
      required: true,
      default: ''
    },
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
