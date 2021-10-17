export default {
  deleteBook: ({ countryData }, payload) => {
    const index = countryData[payload.countryId].books.indexOf(payload.book);
    if (index > -1) {
      countryData[payload.countryId].books.splice(index, 1);
    }
  },
};
