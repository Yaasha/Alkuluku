import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "@/plugins/vuesax";
import store from "@/store";
import { mapState } from "vuex";
import VueTheMask from "vue-the-mask";
Vue.use(VueTheMask);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
  computed: {
    ...mapState(["settings"]),
  },
  watch: {
    "settings.theme": {
      handler(val) {
        this.$vs.setTheme(val);
      },
      immediate: true,
    },
  },
}).$mount("#app");
