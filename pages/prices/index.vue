<template>
  <StatisticMultiTable
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
    StatisticMultiTable: () => import("~/components/StatisticMultiTable/StatisticMultiTable")
  },
  layout: 'auth',
  middleware: 'isAuthenticated',
  data: () => ({
    items: []
  }),
  methods: {
    async getData({queryParams = ''}) {
      try {
        const { data: { items = [] } } = await this.$axios.get(`${this.$config.backendUrl}/prices${queryParams ? `?${queryParams}`: ''}`);
        this.items = items.map(({name,list = []}) => ({
          name: this.$i18n.t(`products.${name.replace('List','')}`),
          list: [{
            ...Object.assign({},...list.map(({name,value}) => ({
              [name]: value
            })))
          }],
          fields: list.map(data => ({
            key: data.name,
            label: this.$i18n.t(`products.productsList.${name}.${data.name}`)
          }))
        }))
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
