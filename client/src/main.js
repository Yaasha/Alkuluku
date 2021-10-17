import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "@/plugins/vuesax";
import store from "@/store";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
  mounted() {
    this.$vs.setTheme("dark");
  },
}).$mount("#app");
