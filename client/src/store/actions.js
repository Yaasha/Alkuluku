export default {
  deleteBook: ({ commit }, payload) => {
    return commit("deleteBook", payload);
  },
  addBook: ({ commit }, payload) => {
    return commit("addBook", payload);
  },
};
