<template>
  <div id="menu">
    <v-speed-dial
      v-if="user.email"
      v-model="speedDial"
      direction="bottom"
      transition="slide-y-transition"
      open-on-hover
    >
      <template v-slot:activator>
        <vs-button
          @click.stop="
            if (allowClick) {
              bookDialog = !bookDialog;
              speedDial = false;
            }
          "
          circle
          icon
          floating
          color="success"
          :aria-label="$t('showBooks')"
        >
          <i class="bx bx-book"></i>
        </vs-button>
      </template>
      <vs-button
        @click="addBook = !addBook"
        circle
        icon
        floating
        color="success"
        :aria-label="$t('addBook')"
      >
        <i class="bx bx-book-add"></i>
      </vs-button>
      <vs-button
        @click="settings = !settings"
        circle
        icon
        floating
        :aria-label="$t('settings')"
      >
        <i class="bx bx-cog"></i>
      </vs-button>
      <vs-button
        @click="logout"
        circle
        icon
        floating
        color="danger"
        :aria-label="$t('logout')"
      >
        <i class="bx bx-log-out-circle"></i>
      </vs-button>
    </v-speed-dial>
    <login v-else></login>
    <settings-dialog v-model="settings" />
    <add-book-dialog v-model="addBook" />
    <book-dialog v-model="bookDialog" @addBook="addBook = !addBook" />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {
    AddBookDialog: () => import("@/components/AddBookDialog.vue"),
    BookDialog: () => import("@/components/BookDialog.vue"),
    SettingsDialog: () => import("@/components/SettingsDialog.vue"),
    Login: () => import("@/components/Login.vue"),
  },
  data() {
    return {
      settings: false,
      addBook: false,
      bookDialog: false,
      speedDial: false,
      allowClick: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
  watch: {
    speedDial(val) {
      setTimeout(() => (this.allowClick = val), 50);
    },
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
