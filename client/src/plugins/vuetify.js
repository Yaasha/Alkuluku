import Vue from "vue";
import Vuetify, {
  VSpeedDial,
  VApp,
  VMenu,
  VDatePicker,
  VColorPicker,
  VTextField,
  VCard,
  VCardText,
} from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify, {
  components: {
    VSpeedDial,
    VApp,
    VMenu,
    VDatePicker,
    VColorPicker,
    VTextField,
    VCard,
    VCardText,
  },
});

const opts = {};

export default new Vuetify(opts);
