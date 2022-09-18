<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/admin/ticketsBuy"
    :get-api-data="getData"
    :title="$t('ticketsBuy.title')"
    :update-selected-tickets="updateSelectedTickets"
    selectable
  />
</template>
<script>
export default {
  name: 'TicketsBuyPage',
  components: {
    StatisticTable: () => import("@/components/Ui/StatisticTable/StatisticTable")
  },
  layout: 'auth',
  middleware: ['isAuthenticated','isAdmin'],
  data: () => ({
    items: [],
  }),
  computed: {
    fields() {
      const sortNames = ['date','col'];
      const filterData = Object.entries(this.$i18n.t('ticketsBuy.table.headers')).map(([name,value]) => ({
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
    async updateSelectedTickets(){
      try {
        await this.$axios.post(`${this.$config.backendUrl}/selected-tickets`,{
          isSale: false,
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
