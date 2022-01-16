export default {
  mapData: (state) => {
    let mapData = Object.keys(state.countries).map((countryId) => {
      const books = state.countryData[countryId]?.books;
      return {
        id: countryId,
        name: state.countries[countryId],
        value: books ? Object.keys(books).length : 0,
      };
    });

    return mapData;
  },
  bookData: (state) => {
    let mapData = Object.keys(state.countries).map((countryId) => {
      let books = state.countryData[countryId]?.books;
      let lastAdded = books?.length
        ? Object.values(books).reduce((a, b) => (a.addedOn > b.addedOn ? a : b))
            .addedOn
        : "";
      return {
        id: countryId,
        name: state.countries[countryId],
        bookCount: books ? Object.keys(books).length : 0,
        lastAdded,
        books: books ? Object.values(books) : [],
      };
    });

    return mapData.sort((a, b) => b.bookCount - a.bookCount);
  },
  countries: (state) => {
    let mapData = Object.keys(state.countries).map((countryId) => {
      return {
        id: countryId,
        name: state.countries[countryId],
      };
    });

    return mapData;
  },
  minMapValue: (_, getters) => {
    let minValue = Number.MAX_SAFE_INTEGER;
    for (let countryData of getters.mapData) {
      if (countryData.value < minValue) minValue = countryData.value;
    }
    return minValue;
  },
  maxMapValue: (_, getters) => {
    let maxValue = Number.MIN_SAFE_INTEGER;
    for (let countryData of getters.mapData) {
      if (countryData.value > maxValue) maxValue = countryData.value;
    }
    return maxValue;
  },
};
