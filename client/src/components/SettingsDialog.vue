<template>
  <div class="center">
    <vs-dialog
      scroll
      overflow-hidden
      auto-width
      :loading="loading"
      v-model="active"
    >
      <template #header>
        <h3>Settings</h3>
      </template>

      <div class="center grid">
        <vs-row>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>Background color</span>
            <color-picker v-model="localSettings.backgroundColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>Min color</span>
            <color-picker v-model="localSettings.minColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>Max color</span>
            <color-picker v-model="localSettings.maxColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>Stroke color</span>
            <color-picker v-model="localSettings.strokeColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>Hover color</span>
            <color-picker v-model="localSettings.hoverColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <span>UI theme</span>
            <vs-select block placeholder="Theme" v-model="localSettings.theme">
              <vs-option
                v-for="theme in themes"
                :key="theme.value"
                :label="theme.name"
                :value="theme.value"
                >{{ theme.name }}</vs-option
              >
            </vs-select>
          </vs-col>
        </vs-row>
      </div>
      <template #footer>
        <vs-row class="justify-space-between">
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <vs-button block color="warn" @click="reset()">
              Reset to default
            </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <vs-button block color="dark" @click="cancel()"> Cancel </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <vs-button block color="success" @click="save()"> Save </vs-button>
          </vs-col>
        </vs-row>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ColorPicker from "@/components/ColorPicker.vue";

export default {
  props: ["value"],
  components: {
    ColorPicker,
  },
  data: () => ({
    active: false,
    loading: false,
    search: "",
    items: [],
    localSettings: {},
    themes: [
      { name: "Dark", value: "dark" },
      { name: "Light", value: "light" },
    ],
  }),
  mounted() {
    this.localSettings = JSON.parse(JSON.stringify(this.settings));
  },
  computed: {
    ...mapState(["user", "settings"]),
    ...mapGetters(["bookData"]),
  },
  methods: {
    ...mapActions(["setSettings"]),
    save() {
      this.loading = true;
      setTimeout(
        () =>
          this.setSettings(this.localSettings).then(
            () => (this.active = false)
          ),
        0
      );
    },
    cancel() {
      this.localSettings = JSON.parse(JSON.stringify(this.settings));
      this.active = false;
    },
    reset() {
      this.localSettings = JSON.parse(
        JSON.stringify({
          backgroundColor: "#30303c",
          strokeColor: "#2f2f30",
          minColor: "#39393b",
          maxColor: "#5c9dbd",
          hoverColor: "#5d7fbc",
          theme: "dark",
        })
      );
      this.save();
    },
  },
  watch: {
    active(val) {
      this.loading = false;
      this.$emit("input", val);
    },
    value(val) {
      this.active = val;
    },
  },
};
</script>
<style lang="scss"></style>
