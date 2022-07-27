<template>
  <div class="main-page shadow bg-white p-2 rounded mt-3">
    <h2 class="mb-4">KPI</h2>
    <b-table
      id="statistic-table"
      :items="items"
      :fields="fields"
      small
    />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'auth',
  middleware: 'isAuthenticated',
  async asyncData({ $axios, $config  }) {
    const { data: { items = [] } } = await $axios.get(`${$config.backendUrl}/kpi`)
    const fields = [
      {
        key: 'totalUsers',
        label: 'Всього користувачів'
      },
      {
        key: 'activeUsers',
        label: 'Активні користувачі'
      },
      {
        key: 'ratingOfService',
        label: 'Оцінка сервісу'
      },
      {
        key: 'totalNewReg',
        label: 'К-ть нових реєстрацій'
      },
      {
        key: 'totalSaleTickets',
        label: 'К-ть тікетів на продаж'
      },
      {
        key: 'totalBuyTickets',
        label: 'К-ть тікетів на покупку'
      }
    ]
    return { items,fields }
  },
}
</script>
