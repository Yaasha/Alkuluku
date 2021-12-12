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
          @click.stop="if (allowClick) bookDialog = !bookDialog;"
          circle
          icon
          floating
          color="success"
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
      >
        <i class="bx bx-book-add"></i>
      </vs-button>
      <vs-button @click="settings = !settings" circle icon floating>
        <i class="bx bx-cog"></i>
      </vs-button>
      <vs-button @click="logout" circle icon floating color="danger">
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
import BookDialog from "@/components/BookDialog.vue";
import AddBookDialog from "@/components/AddBookDialog.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import Login from "@/components/Login.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    AddBookDialog,
    BookDialog,
    SettingsDialog,
    Login,
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
