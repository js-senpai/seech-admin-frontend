<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/tickets-buy"
    :get-api-data="getData"
    title="Tickets buy"
  />
</template>
<script>
export default {
  name: 'TicketsBuyPage',
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: [],
  }),
  computed: {
    fields() {
      const sortNames = ['date','col','price'];
      return Object.entries(this.$i18n.t('tickets')).map(([name,value]) => ({
        key: name,
        label: value,
          ...(sortNames.includes(name) && {
            sortable: true
          })
      }))
    },
  },
  methods: {
    async getData({queryParams = ''}) {
      console.log(this.$i18n.t(`regions.257.name`))
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/tickets-buy${queryParams ? `?${queryParams}`: ''}`);
        this.items = items.map((active,region,state,otg,...data) => ({
          ...data,
          region,
          state,
          otg,
          ...(typeof active !== 'undefined' && {
            active: active ? '🟢': '🔴'
          }),
          ...((region && region !== '-') && {
            region: this.$i18n.t(`regions.${region}.name`)
          }),
          ...((region && state && region !== '-' && state !== '-') && {
            state: this.$i18n.t(`regions.${region}.states.${state}.name`)
          }),
          ...((region && state && otg && region !== '-' && state !== '-' && otg !== '-') && {
            otg: this.$i18n.t(`regions.${region}.states.${state}.otg.${otg}`)
          }),
        }));
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
