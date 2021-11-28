import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "@/plugins/vuesax";
import store from "@/store";
import { mapState, mapMutations } from "vuex";
import i18n from "@/i18n";
import VueTheMask from "vue-the-mask";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  i18n,
  render: (h) => h(App),
  computed: {
    ...mapState(["settings"]),
  },
  methods: {
    ...mapMutations(["setCountries"]),
  },
  watch: {
    "settings.theme": {
      handler(val) {
        this.$vs.setTheme(val);
      },
      immediate: true,
    },
    "settings.locale": {
      async handler(val) {
        if (val) {
          let lang = val.split("-")[0];
          this.$i18n.locale = lang;

          const countries = await import(
            `@amcharts/amcharts4-geodata/lang/${lang.toUpperCase()}`
          );
          this.setCountries(countries.default);
        }
      },
      immediate: true,
    },
  },
}).$mount("#app");

Vue.use(VueTheMask);
