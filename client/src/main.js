import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "@/plugins/vuesax";
import "@/plugins/vStyle";
import "@/plugins/vueToasted";
import store from "@/store";
import { mapState, mapMutations } from "vuex";
import i18n from "@/i18n";
import VueTheMask from "vue-the-mask";
import "@/registerServiceWorker";

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
      handler(val) {
        if (val) {
          let lang = val.split("-")[0];
          this.$i18n.locale = lang;

          Promise.all([
            import("@amcharts/amcharts4-geodata/data/countries2"),
            import("@amcharts/amcharts4-geodata/lang/EN.js"),
            import("@amcharts/amcharts4-geodata/lang/CS.js"),
          ])
            .then((modules) => {
              const allCountries = modules[0].default;
              const countryNames = {
                en: modules[1].default,
                cs: modules[2].default,
              };

              const countries = Object.keys(allCountries).map((countryId) => {
                return [
                  countryId,
                  countryNames[lang][countryId]
                    ? countryNames[lang][countryId]
                    : allCountries[countryId].country,
                ];
              });

              this.setCountries(Object.fromEntries(countries));
            })
            .catch((e) => {
              console.error("Error when loading lang data", e);
            });
        }
      },
      immediate: true,
    },
  },
}).$mount("#app");

Vue.use(VueTheMask);
