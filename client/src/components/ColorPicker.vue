<template>
  <v-text-field v-model="color" hide-details class="ma-0 pa-0" solo>
    <input v-mask="mask" v-model="color" style="display: none" />
    <template v-slot:append>
      <v-menu
        v-model="menu"
        top
        nudge-bottom="105"
        nudge-left="16"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <div :style="swatchStyle" v-on="on" />
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker v-model="color" flat show-swatches hide-inputs />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: ["value"],
  data: () => ({
    mask: "!#XXXXXX",
    menu: false,
  }),
  computed: {
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
    color: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    // value(val) {
    //   this.color = val;
    // },
    // color(val) {
    //   this.$emit("input", val);
    // },
  },
};
</script>
<style lang="scss"></style>
