import Vue from "vue";
import Vuetify, { VSpeedDial } from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify, {
  components: {
    VSpeedDial,
  },
});

const opts = {};

export default new Vuetify(opts);
