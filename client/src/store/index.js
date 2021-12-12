import Vuex from "vuex";
import Vue from "vue";

import actions from "./actions";
import state from "./state";
import mutations from "./mutations";
import getters from "./getters";

import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [vuexLocal.plugin],
});
