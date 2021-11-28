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
        <h3>{{ $t("settings") }}</h3>
      </template>

      <div class="center grid">
        <vs-row>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("backgroundColor") }}</span>
            <color-picker v-model="localSettings.backgroundColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("minColor") }}</span>
            <color-picker v-model="localSettings.minColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("maxColor") }}</span>
            <color-picker v-model="localSettings.maxColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("strokeColor") }}</span>
            <color-picker v-model="localSettings.strokeColor" />
          </vs-col>
          <vs-col
            class="pa-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("hoverColor") }}</span>
            <color-picker v-model="localSettings.hoverColor" />
          </vs-col>
          <vs-col
            class="pa-2 my-auto"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("uiTheme") }}</span>
            <vs-select block v-model="localSettings.theme">
              <vs-option
                v-for="theme in themes"
                :key="theme.value"
                :label="theme.name"
                :value="theme.value"
                >{{ theme.name }}</vs-option
              >
            </vs-select>
          </vs-col>
          <vs-col
            class="pa-2 my-auto"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
          >
            <span>{{ $t("language") }}</span>
            <vs-select block v-model="localSettings.locale">
              <vs-option
                v-for="lang in languages"
                :key="lang.value"
                :label="lang.name"
                :value="lang.value"
                >{{ lang.name }}</vs-option
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
              {{ $t("resetToDefault") }}
            </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <vs-button block color="dark" @click="cancel()">
              {{ $t("cancel") }}
            </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
          >
            <vs-button block color="success" @click="save()">
              {{ $t("save") }}
            </vs-button>
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
  data() {
    return {
      active: false,
      loading: false,
      search: "",
      items: [],
      localSettings: {},
    };
  },
  computed: {
    ...mapState(["user", "settings"]),
    ...mapGetters(["bookData"]),
    themes() {
      return [
        { name: this.$t("dark"), value: "dark" },
        { name: this.$t("light"), value: "light" },
      ];
    },
    languages() {
      return [
        { name: this.$t("englishUS"), value: "en-US" },
        { name: this.$t("englishUK"), value: "en-GB" },
        { name: this.$t("czech"), value: "cs-CZ" },
      ];
    },
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
          locale: "en-GB",
        })
      );
      this.save();
    },
  },
  watch: {
    value(val) {
      this.active = val;
    },
    active: {
      handler(val) {
        this.loading = false;
        this.$emit("input", val);
        this.localSettings = JSON.parse(JSON.stringify(this.settings));
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss"></style>
