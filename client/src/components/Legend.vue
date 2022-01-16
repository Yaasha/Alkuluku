<template>
  <vs-card
    class="legend-container"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="clicked = !clicked"
  >
    <template #title>
      <h4>{{ $t("legend") }}</h4>
    </template>
    <template #text>
      <vs-row
        v-show="clicked || (hover && isDesktop)"
        v-for="(heatRule, i) in settings.heatRules"
        :key="i"
      >
        <vs-col class="mb-2">
          <div class="color-square" :style="heatRuleStyle(heatRule)">
            {{ heatRuleText(heatRule) }}
          </div>
        </vs-col>
      </vs-row>
    </template>
  </vs-card>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      hover: false,
      clicked: false,
      isDesktop: false,
    };
  },
  methods: {
    heatRuleStyle(heatRule) {
      let background = heatRule.minColor;
      if (heatRule.gradient) {
        background = `linear-gradient(90deg, ${heatRule.minColor} 0%, ${heatRule.maxColor} 100%)`;
      }

      return {
        background,
      };
    },
    heatRuleText(heatRule) {
      let min = isNaN(parseInt(heatRule.min))
        ? this.minMapValue
        : parseInt(heatRule.min);
      let max = isNaN(parseInt(heatRule.max))
        ? this.maxMapValue
        : parseInt(heatRule.max);

      if (min === max) return min;

      return `${min} - ${max}`;
    },
    detectDesktop() {
      this.isDesktop = !window.matchMedia("(max-width: 900px)").matches;
    },
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["minMapValue", "maxMapValue"]),
    legendContainerStyle() {
      return {
        backgroundColor: this.settings.theme === "dark" ? "#1f2024" : "#fff",
        color: this.settings.theme === "dark" ? "#fff" : "#1f2024",
      };
    },
  },
  created() {
    window.addEventListener("resize", this.detectDesktop);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.detectDesktop);
  },
};
</script>
<style>
.legend-container {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
.color-square {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: initial;
}
.legend-container .vs-card__text {
  padding-bottom: 4px !important;
}
</style>
