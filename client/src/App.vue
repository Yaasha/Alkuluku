<template>
  <v-app id="app">
    <Menu />
    <Map />
    <v-style>
      {{ scrollBarStyle }}
    </v-style>
  </v-app>
</template>

<script>
import Map from "./components/Map.vue";
import Menu from "./components/Menu.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  components: {
    Map,
    Menu,
  },
  methods: {
    ...mapActions(["getUserData"]),
  },
  created() {
    this.getUserData().catch(() => {});
  },
  computed: {
    ...mapState(["settings"]),
    scrollBarStyle() {
      return `
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          display: block;
          background: ${this.settings.theme === "dark" ? "#1f2024" : "#fff"};
        }
        ::-webkit-scrollbar-thumb {
          background: ${this.settings.theme === "dark" ? "#fff" : "#1f2024"};
          border-radius: 5px;
        }`;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
html {
  overflow: hidden !important;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.toasted.bubble {
  border-radius: 0 12px 12px 0 !important;
  font-size: 0.9rem !important;
  -webkit-transition: height 0.25s ease !important;
  transition: height 0.25s ease !important;
  border-radius: 12px !important;
  z-index: 999 !important;
}
.toasted.bubble.success {
  background: #45c83a !important;
  -webkit-box-shadow: 6px 6px 0 0 rgba(69, 200, 58, 0.3) !important;
  box-shadow: 6px 6px 0 0 rgba(69, 200, 58, 0.3) !important;
}
.toasted.bubble.error {
  background: #ff4658 !important;
  -webkit-box-shadow: 6px 6px 0 0 rgba(255, 70, 88, 0.3) !important;
  box-shadow: 6px 6px 0 0 rgba(255, 70, 88, 0.3) !important;
}
</style>
