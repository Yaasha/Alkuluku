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
}
</style>
