import Vue from "vue";
import App from "./App.vue";
import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import store from "@/store";

Vue.config.productionTip = false;

Vue.use(Vuesax, {});

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
