<template>
  <div id="map" :style="{ backgroundColor: settings.backgroundColor }" />
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { excludedCountries } from "@/consts";
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
    ...mapGetters(["mapData", "minMapValue", "maxMapValue"]),
  },
  methods: {
    async buildMap() {
      Promise.all([
        import("@amcharts/amcharts4/core"),
        import("@amcharts/amcharts4/maps"),
        import("@amcharts/amcharts4-geodata/worldLow"),
      ])
        .then((modules) => {
          const am4core = modules[0];
          const am4maps = modules[1];
          const am4geodata_worldLow = modules[2].default;

          am4core.options.disableHoverOnTransform = "touch";

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
          // set fill color
          this.polygonSeries.mapPolygons.template.adapter.add(
            "fill",
            (fill, target) => {
              for (let heatRule of this.settings.heatRules) {
                let value = target.dataItem.value;
                let heatRuleMin = isNaN(parseInt(heatRule.min))
                  ? this.minMapValue
                  : parseInt(heatRule.min);
                let heatRuleMax = isNaN(parseInt(heatRule.max))
                  ? this.maxMapValue
                  : parseInt(heatRule.max);
                if (value >= heatRuleMin && value <= heatRuleMax) {
                  if (heatRule.gradient && heatRuleMin !== heatRuleMax) {
                    var percent =
                      (value - heatRuleMin) / (heatRuleMax - heatRuleMin);
                    return new am4core.Color(
                      am4core.colors.interpolate(
                        am4core.color(heatRule.minColor).rgb,
                        am4core.color(heatRule.maxColor).rgb,
                        percent
                      )
                    );
                  } else {
                    return am4core.color(heatRule.minColor);
                  }
                }
              }
              return fill;
            }
          );

          // Exclude fake countries
          this.polygonSeries.exclude = excludedCountries;
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
          // hoverState.properties.fill = am4core.color(this.settings.hoverColor);
          hoverState.adapter.add("fill", function (fill) {
            return fill.lighten(-0.1);
          });
        })
        .catch((e) => {
          console.error("Error when creating chart", e);
        });
    },
  },
  async mounted() {
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
      async handler(newVal, oldVal) {
        if (!equal(newVal, oldVal)) {
          this.buildMap();
        }
      },
      deep: true,
    },
    "settings.heatRules": {
      async handler(newVal, oldVal) {
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
