<template>
  <div id="menu">
    <v-speed-dial
      v-model="fab"
      direction="bottom"
      open-on-hover
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <vs-button circle icon floating color="success">
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <vs-button circle icon floating>
        <i class="bx bx-cog"></i>
      </vs-button>
      <vs-button circle icon floating color="danger">
        <i class="bx bx-log-out-circle"></i>
      </vs-button>
    </v-speed-dial>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
#menu {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 99999999;
}
</style>
