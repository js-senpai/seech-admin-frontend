<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/admin/kpiMonthly"
    :get-api-data="getData"
    :title="$t('kpiMonthly.title')"
    disable-active
    disable-dates
  />
</template>

<script>
export default {
  name: 'KpiMonthlyPage',
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
      return Object.entries(this.$i18n.t('kpiMonthly.table.headers')).map(([name,value]) => ({
        [name]: value
      }))
    },
  },
  methods: {
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/kpi-monthly${queryParams ? `?${queryParams}`: ''}`);
        this.items = items;
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
