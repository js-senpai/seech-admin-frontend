<template>
  <div class="account">
    <BContainer fluid>
      <BRow>
        <BCol cols="12">
          <h1 class="my-3">{{$t('account.title')}}</h1>
        </BCol>
        <BCol md="2">
          <b-form-group
            :label="$t('account.form.name')"
            label-for="name"
          >
            <b-form-input
              id="name"
              :value="user.name"
              disabled
            />
          </b-form-group>
        </BCol>
        <BCol md="2">
          <b-form-group
            :label="$t('account.form.phone')"
            label-for="phone"
          >
            <b-form-input
              id="phone"
              :value="user.phone"
              disabled
            />
          </b-form-group>
        </BCol>
        <BCol md="2">
          <b-form-group
            :label="$t('account.form.region')"
            label-for="region"
          >
            <b-form-select
              id="region"
              v-model="region"
              :options="regionsOptions"
            />
          </b-form-group>
        </BCol>
        <BCol md="2">
          <b-form-group
            :label="$t('account.form.state')"
            label-for="state"
          >
            <b-form-select
              id="state"
              v-model="countryState"
              :options="statesOptions"
            />
          </b-form-group>
        </BCol>
        <BCol md="2">
          <b-form-group
            :label="$t('account.form.otg')"
            label-for="otg"
          >
            <b-form-select
              id="otg"
              v-model="countryOtg"
              :options="otgOptions"
              :disabled="!statesOptions.length"
            />
          </b-form-group>
        </BCol>
        <BCol md="2" class="d-flex align-items-center justify-content-center justify-content-md-between">
          <b-button  class="custom-btn dark   round-circle mt-3" variant="success" :disabled="isDisabled" @click="update()">{{$t('buttons.accept')}}</b-button>
        </BCol>
      </BRow>
    </BContainer>
    </div>
</template>
<script>
export default {
  layout: 'auth',
  middleware: 'isAuthenticated',
  async asyncData({$axios,$config}) {
    const { data: { user } } = await $axios.get(`${$config.backendUrl}/user`)
    return {
      region: user.region,
      countryState: user.countryState,
      countryOtg: user.countryOtg
    }
  },
  computed: {
    isDisabled(){
      return !this.region || !this.countryState || !this.countryOtg || !this.regionsOptions.length || !this.statesOptions.length || !this.otgOptions.length
    },
    user(){
      return this.$auth.user
    },
    regionsOptions(){
      return Object.entries(this.$i18n.t('regions')).map(([key,data]) => ({
        text: data.name,
        value: key
      }))
    },
    statesOptions(){
      return Object.entries(this.$i18n.t('regions'))
        .filter(([key]) => +this.region === +key)
        .flatMap(([_,region]) => Object.entries(region.states))
        .flatMap(([key,data]) => ({
          text: data.name,
          value: key
        }))
    },
    otgOptions(){
      return Object.entries(this.$i18n.t('regions'))
        .filter(([key]) => +this.region === +key)
        .flatMap(([_,region]) => Object.entries(region.states))
        .filter(([key]) => +this.countryState === +key)
        .flatMap(([_,state]) => Object.entries(state.otg))
        .flatMap(([value,text]) => ({
          text,
          value
        }))
    },
  },
  methods: {
    async update(){
      try {
        await this.$axios.put(`${this.$config.backendUrl}/user`,{
          region: +this.region,
          countryState: +this.countryState,
          countryOtg: +this.countryOtg
        });
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
