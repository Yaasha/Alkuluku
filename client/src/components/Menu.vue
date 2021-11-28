<template>
  <div id="menu">
    <v-speed-dial
      v-if="user.email"
      direction="bottom"
      open-on-hover
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <book-dialog />
      </template>
      <vs-button @click="settings = !settings" circle icon floating>
        <i class="bx bx-cog"></i>
      </vs-button>
      <vs-button @click="logout" circle icon floating color="danger">
        <i class="bx bx-log-out-circle"></i>
      </vs-button>
    </v-speed-dial>
    <login v-else></login>
    <settings-dialog v-model="settings" />
  </div>
</template>
<script>
import BookDialog from "@/components/BookDialog.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import Login from "@/components/Login.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    BookDialog,
    SettingsDialog,
    Login,
  },
  data() {
    return {
      settings: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["logout"]),
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
