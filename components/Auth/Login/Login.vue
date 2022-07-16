<template>
  <BContainer>
    <BRow>
      <BCol class="d-flex align-items-center justify-content-center login-container">
        <client-only>
          <VueTelegramLogin
            mode="callback"
            :telegram-login="botName"
            @callback="telegramCallback" />
        </client-only>

      </BCol>
    </BRow>
  </BContainer>
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
