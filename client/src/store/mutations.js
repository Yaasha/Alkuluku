import Vue from "vue";
import { defaultSettings } from "@/consts";

function guid() {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

export default {
  deleteBook: ({ countryData }, payload) => {
    return Vue.delete(countryData[payload.countryId].books, payload.bookId);
  },
  addBook: ({ countryData }, payload) => {
    let id = guid();

    if (!countryData[payload.country]?.books) {
      Vue.set(countryData, payload.country, { id: payload.country, books: {} });
    }
    return Vue.set(countryData[payload.country].books, id, {
      id: id,
      name: payload.name,
      author: payload.author,
      addedOn: payload.addedOn,
    });
  },
  setSettings: (state, payload) => {
    Object.assign(state.settings, JSON.parse(JSON.stringify(payload)));
  },
  setCountries: (state, payload) => {
    state.countries = payload;
  },
  setUserData: (state, payload) => {
    state.user.email = payload.email;
  },
  setCountryData: (state, payload) => {
    state.countryData = payload;
  },
  clearState: (state) => {
    state.user = { email: null };
    state.settings = defaultSettings;
    state.countryData = {};
  },
};
