<template>
  <div id="map" :style="{ backgroundColor: settings.backgroundColor }" />
</template>

<script>
import { mapState, mapGetters } from "vuex";
const equal = require("fast-deep-equal");

export default {
  name: "Map",
  data() {
    return {
      polygonSeries: null,
      chart: null,
    };
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["mapData"]),
  },
  methods: {
    buildMap() {
      Promise.all([
        import("@amcharts/amcharts4/core"),
        import("@amcharts/amcharts4/maps"),
        import("@amcharts/amcharts4-geodata/worldLow"),
        import("@amcharts/amcharts4/themes/animated"),
      ])
        .then((modules) => {
          const am4core = modules[0];
          const am4maps = modules[1];
          const am4geodata_worldLow = modules[2].default;
          const am4themes_animated = modules[3].default;

          am4core.options.disableHoverOnTransform = "touch";

          // Themes begin
          am4core.useTheme(am4themes_animated);
          // Themes end

          if (this.chart) this.chart.dispose();

          // Create map instance
          this.chart = am4core.create("map", am4maps.MapChart);

          // Set map definition
          this.chart.geodata = am4geodata_worldLow;

          // Set projection
          this.chart.projection = new am4maps.projections.Miller();

          // Create map polygon series
          this.polygonSeries = this.chart.series.push(
            new am4maps.MapPolygonSeries()
          );

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
        })
        .catch((e) => {
          console.error("Error when creating chart", e);
        });
    },
  },
  mounted() {
    this.buildMap();
  },
  watch: {
    mapData: {
      handler(newVal, oldVal) {
        if (!equal(newVal, oldVal)) {
          this.polygonSeries.data = this.mapData;
        }
      },
      deep: true,
    },
    settings: {
      handler(newVal, oldVal) {
        if (!equal(newVal, oldVal)) {
          this.buildMap();
        }
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
