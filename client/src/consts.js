const defaultSettings = {
  backgroundColor: "#30303c",
  strokeColor: "#2f2f30",
  theme: "dark",
  locale: "en-GB",
  heatRules: [
    {
      min: "",
      max: "",
      minColor: "#39393b",
      maxColor: "#5c9dbd",
      gradient: true,
    },
  ],
};

const excludedCountries = [
  "AQ",
  "AX",
  "BV",
  "IM",
  "SJ",
  "TF",
  "GS",
  "MO",
  "GG",
  "JE",
  "YT",
  "NF",
  "BQ",
  "UM",
  "IO",
  "HM",
  "SH",
  "CX",
  "FK",
  "CC",
  "PN",
  "TC",
  "PM",
  "TK",
  "GU",
  "MS",
];

export { defaultSettings, excludedCountries };
