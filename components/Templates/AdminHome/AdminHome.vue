<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/"
    :get-api-data="getData"
    :title="$t('kpi.title')"
  />
</template>

<script>
export default {
  components: {
    StatisticTable: () => import("~/components/Ui/StatisticTable/StatisticTable")
  },
  data: () => ({
    items: [],
  }),
  computed: {
    fields() {
      return Object.entries(this.$i18n.t('kpi.table.headers')).map(([name,value]) => ({
        [name]: value
      }))
    },
  },
  methods: {
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/kpi${queryParams ? `?${queryParams}`: ''}`);
        this.items = items;
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
