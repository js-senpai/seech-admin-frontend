<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/"
    :get-api-data="getData"
    title="KPI"
  />
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: [],
  }),
  computed: {
    fields() {
      return Object.entries(this.$i18n.t('kpi')).map(([name,value]) => ({
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
