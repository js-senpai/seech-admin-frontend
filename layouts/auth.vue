<template>
  <div class="auth-layout bg-light">
    <Header/>
    <BContainer fluid>
      <BRow>
        <BCol sm="2" class="d-none d-md-block bg-white shadow min-vh-100">
          <SidebarNavigation/>
        </BCol>
        <BCol sm="10" md="10" >
          <Nuxt />
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>
<script>
import Header from "../components/Header/Header";
import SidebarNavigation from "../components/SidebarNavigation/SidebarNavigation";
export default {
  components: {SidebarNavigation, Header}
}
</script>
