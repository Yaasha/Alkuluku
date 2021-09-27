<template>
  <div id="map" />
</template>

<script>
export default {
  name: "Map",
  mounted() {
    google.charts.load("current", {
      packages: ["geochart"],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);
    function drawRegionsMap() {
      var data = google.visualization.arrayToDataTable([
        ["Country", "Popularity"],
        ["Germany", 200],
        ["United States", 300],
        ["Brazil", 400],
        ["Canada", 500],
        ["France", 600],
        ["RU", 700],
      ]);

      var options = {};
      var chart = new google.visualization.GeoChart(
        document.getElementById("map")
      );
      chart.draw(data, options);
    }
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
