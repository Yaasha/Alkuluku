import countries from "@amcharts/amcharts4-geodata/data/countries2";

export default {
  mapData: (state) => {
    let mapData = Object.keys(countries).map((countryId) => {
      return {
        id: countryId,
        value: state.countryData[countryId]?.books.length || 0,
      };
    });

    return mapData;
  },
  bookData: (state) => {
    let mapData = Object.keys(countries).map((countryId) => {
      let books = state.countryData[countryId]?.books;
      let lastAdded = books
        ? books.reduce((a, b) => (a.addedOn > b.addedOn ? a : b)).addedOn
        : "";
      return {
        id: countryId,
        name: countries[countryId].country,
        bookCount: state.countryData[countryId]?.books.length || 0,
        lastAdded,
        books: books || [],
      };
    });

    return mapData.sort((a, b) => b.bookCount - a.bookCount);
  },
};
