<template>
  <div id="map" :style="{ backgroundColor: settings.backgroundColor }" />
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Map",
  data() {
    return {
      polygonSeries: null,
    };
  },
  computed: {
    ...mapState(["user", "settings"]),
    ...mapGetters(["mapData"]),
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
      min: am4core.color(this.settings.minColor),
      max: am4core.color(this.settings.maxColor),
    });

    // Exclude Antartica
    this.polygonSeries.exclude = ["AQ"];
    this.polygonSeries.data = this.mapData;

    // Make map load polygon (like country names) data from GeoJSON
    this.polygonSeries.useGeodata = true;

    // Configure series tooltip
    let polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 1;
    polygonTemplate.stroke = am4core.color(this.settings.strokeColor);

    // Create hover state and set alternative fill color
    let hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color(this.settings.hoverColor);
  },
  watch: {
    mapData: {
      handler() {
        this.polygonSeries.data = this.mapData;
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
