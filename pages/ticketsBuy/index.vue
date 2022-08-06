<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/tickets-buy"
    :get-api-data="getData"
    title="Tickets buy"
  >
    <template #cell(description)="data">
      <div :data-value="data.description">123</div>
    </template>
  </StatisticTable>
</template>
<script>
export default {
  name: 'TicketsBuyPage',
  components: {
    StatisticTable: () => import("~/components/StatisticTable/StatisticTable")
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: [],
  }),
  computed: {
    fields() {
      const sortNames = ['date','col'];
      return Object.entries(this.$i18n.t('ticketsBuy')).map(([name,value]) => ({
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
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/tickets-buy${queryParams ? `?${queryParams}`: ''}`);
        const getRegions = this.$i18n.t(`regions`);
        this.items = items.map(({active,region,state,otg,...data}) => ({
          ...data,
          region: getRegions[region]?.name || '-',
          state: getRegions[region]?.states[state]?.name || '-',
          otg: getRegions[region]?.states[state]?.otg[otg] || '-',
          ...(typeof active !== 'undefined' && {
            active: active ? '🟢': '🔴'
          }),
        }));
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
