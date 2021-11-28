<template>
  <v-app id="app">
    <Menu />
    <Map />
  </v-app>
</template>

<script>
import Map from "./components/Map.vue";
import Menu from "./components/Menu.vue";
import { mapActions } from "vuex";

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
</style>
