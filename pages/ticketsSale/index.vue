<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/ticketsSale"
    :get-api-data="getData"
    :title="$t('ticketsSale.title')"
    :update-selected-tickets="updateSelectedTickets"
    selectable
  />
</template>
<script>
export default {
  name: 'TicketsSalePage',
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
      const sortNames = ['date','col','price'];
      const filterData = Object.entries(this.$i18n.t('ticketsSale.table.headers')).map(([name,value]) => ({
        key: name,
        label: value,
        ...(sortNames.includes(name) && {
          sortable: true
        })
      }));
      return [
        {key: 'checked',label: ''},
        ...filterData,
      ]
    },
  },
  methods: {
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/tickets-sale${queryParams ? `?${queryParams}`: ''}`);
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
    async updateSelectedTickets(){
      try {
        await this.$axios.post(`${this.$config.backendUrl}/selected-tickets`,{
          isSale: true,
          tickets: this.items.map(({_id,checked = false}) => ({
            _id,checked
          }))
        })
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
