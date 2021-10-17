import countries from "@amcharts/amcharts4-geodata/data/countries2";

export default {
  mapData: (state) => {
    let mapData = Object.keys(countries).map((countryId) => {
      const books = state.countryData[countryId]?.books;
      return {
        id: countryId,
        value: books ? Object.keys(books).length : 0,
      };
    });

    return mapData;
  },
  bookData: (state) => {
    let mapData = Object.keys(countries).map((countryId) => {
      let books = state.countryData[countryId]?.books;
      let lastAdded = books
        ? Object.values(books).reduce((a, b) => (a.addedOn > b.addedOn ? a : b))
            .addedOn
        : "";
      return {
        id: countryId,
        name: countries[countryId].country,
        bookCount: books ? Object.keys(books).length : 0,
        lastAdded,
        books: books ? Object.values(books) : [],
      };
    });

    return mapData.sort((a, b) => b.bookCount - a.bookCount);
  },
  countries: () => {
    let mapData = Object.keys(countries).map((countryId) => {
      return {
        id: countryId,
        name: countries[countryId].country,
      };
    });

    return mapData;
  },
};
