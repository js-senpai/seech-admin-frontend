<template>
  <div></div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'auth',
  middleware: 'isAuthenticated'
}
</script>
