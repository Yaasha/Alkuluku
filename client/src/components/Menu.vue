<template>
  <div id="menu">
    <v-speed-dial
      direction="bottom"
      open-on-hover
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <book-dialog />
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
import BookDialog from "@/components/BookDialog.vue";

export default {
  components: {
    BookDialog,
  },
};
</script>
<style scoped>
#menu {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 99999999;
}
</style>
