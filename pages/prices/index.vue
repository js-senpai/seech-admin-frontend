<template>
  <StatisticTable
    :data.sync="items"
    :fields="fields"
    redirect-path="/prices"
    :get-api-data="getData"
    :title="$t('prices.title')"
    disable-active
    disable-types
  />
</template>

<script>
export default {
  name: 'PricesPage',
  components: {
    StatisticTable: () => import("~/components/StatisticTable/StatisticTable")
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: [],
    fields: []
  }),
  methods: {
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/prices${queryParams ? `?${queryParams}`: ''}`);
        this.items = [{
          ...Object.assign({},...items.map(({name,value}) => ({
            [name]: value
          })))
        }];
        this.fields = items.map(({name,title}) => ({
          [name]: title
        }))
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
