import http from "@/plugins/axios";

export default {
  deleteBook: ({ commit, dispatch }, payload) => {
    commit("deleteBook", payload);
    return dispatch("postCountryData");
  },
  addBook: ({ commit, dispatch }, payload) => {
    commit("addBook", payload);
    return dispatch("postCountryData");
  },
  postCountryData: ({ commit, state }) => {
    const data = {
      data: state.countryData,
    };
    return http.post("/country-data", data).then((res) => {
      commit("setCountryData", res.data.data);
    });
  },
  setSettings: ({ commit }, payload) => {
    const data = {
      data: payload,
    };
    return http.post("/settings", data).then(() => {
      commit("setSettings", payload);
    });
  },
  getUserData: ({ commit, dispatch }) => {
    return http.get("/user-data").then((res) => {
      commit("setUserData", res.data.data);
      dispatch("getSettings");
      dispatch("getCountryData");
    });
  },
  getSettings: ({ commit }) => {
    return http.get("/settings").then((res) => {
      commit("setSettings", res.data.data);
    });
  },
  getCountryData: ({ commit }) => {
    return http.get("/country-data").then((res) => {
      commit("setCountryData", res.data.data);
    });
  },
  login: ({ dispatch }, payload) => {
    const data = {
      email: payload.email,
      password: payload.password,
    };
    return http.post("/login", data).then(() => {
      dispatch("getUserData");
    });
  },
  register: ({ dispatch }, payload) => {
    const data = {
      email: payload.email,
      password: payload.password,
    };
    return http.post("/register", data).then(() => {
      dispatch("getUserData");
    });
  },
  logout: () => {
    return http.post("/logout").then(() => {
      window.location.reload();
    });
  },
};
