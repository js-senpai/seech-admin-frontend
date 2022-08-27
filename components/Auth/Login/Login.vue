<template>
  <client-only>
    <VueTelegramLogin
      class="telegram-login"
      mode="callback"
      :telegram-login="botName"
      @callback="telegramCallback" />
  </client-only>
</template>
<script>
export default {
  computed: {
    botName() {
      return this.$config.botName
    }
  },
  methods: {
    async telegramCallback(user){
      try {
        await this.$auth.loginWith("local", {
          data: user
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
<style lang="scss">
@import "scss/index";
</style>
