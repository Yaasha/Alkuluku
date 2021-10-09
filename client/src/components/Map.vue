<template>
  <div
    id="map"
    :style="{ backgroundColor: userData.settings.backgroundColor }"
  />
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import countries from "@amcharts/amcharts4-geodata/data/countries2";

export default {
  name: "Map",
  data() {
    return {
      polygonSeries: null,
      userData: {
        email: "",
        name: "",
        id: null,
        settings: {
          backgroundColor: "#30303c",
          strokeColor: "#2f2f30",
          minColor: "#39393b",
          maxColor: "#5c9dbd",
          hoverColor: "#5d7fbc",
        },
        mapData: {
          CZ: {
            id: "CZ",
            value: 150,
          },
          RU: {
            id: "RU",
            value: 21,
          },
          DE: {
            id: "DE",
            value: 5,
          },
        },
      },
    };
  },
  mounted() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create("map", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    this.polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    this.polygonSeries.heatRules.push({
      property: "fill",
      target: this.polygonSeries.mapPolygons.template,
      min: am4core.color(this.userData.settings.minColor),
      max: am4core.color(this.userData.settings.maxColor),
    });

    // Exclude Antartica
    this.polygonSeries.exclude = ["AQ"];
    this.updateData();

    // Make map load polygon (like country names) data from GeoJSON
    this.polygonSeries.useGeodata = true;

    // Configure series tooltip
    let polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 1;
    polygonTemplate.stroke = am4core.color(this.userData.settings.strokeColor);

    // Create hover state and set alternative fill color
    let hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color(
      this.userData.settings.hoverColor
    );
  },
  methods: {
    updateData() {
      let mapData = Object.keys(countries).map((countryId) => {
        return {
          id: countryId,
          value: this.userData.mapData[countryId]?.value || 0,
        };
      });
      this.polygonSeries.data = mapData;
    },
  },
  watch: {
    "userData.mapData": {
      handler() {
        this.updateData();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
