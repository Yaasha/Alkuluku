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
            sm="6"
            xs="12"
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
            sm="6"
            xs="12"
          >
            <span>{{ $t("strokeColor") }}</span>
            <color-picker v-model="localSettings.strokeColor" />
          </vs-col>
          <vs-col
            class="pa-2 my-auto"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="3"
            sm="6"
            xs="12"
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
            sm="6"
            xs="12"
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
        <vs-row class="mt-2">
          <vs-col>
            <span class="mx-auto">{{ $t("mapColorRules") }}</span>
            <vs-table>
              <template #thead>
                <vs-tr>
                  <vs-th class="text-center">{{ $t("minValue") }}</vs-th>
                  <vs-th>{{ $t("minValueColor") }}</vs-th>
                  <vs-th>{{ $t("maxValue") }}</vs-th>
                  <vs-th>{{ $t("maxValueColor") }}</vs-th>
                  <vs-th>{{ $t("gradient") }}</vs-th>
                  <vs-th>{{ $t("deleteRule") }}</vs-th>
                </vs-tr>
              </template>
              <template #tbody>
                <vs-tr
                  :key="i"
                  v-for="(heatRule, i) in localSettings.heatRules"
                  :data="heatRule"
                >
                  <vs-td max-width="150px">
                    <vs-input
                      class="input-number"
                      v-mask="'#####'"
                      v-model="heatRule.min"
                      :placeholder="$t('min')"
                    />
                  </vs-td>
                  <vs-td>
                    <color-picker v-model="heatRule.minColor" />
                  </vs-td>
                  <vs-td>
                    <vs-input
                      class="input-number"
                      v-mask="'#####'"
                      v-model="heatRule.max"
                      :placeholder="$t('max')"
                    />
                  </vs-td>
                  <vs-td>
                    <color-picker
                      v-model="heatRule.maxColor"
                      :disabled="!heatRule.gradient"
                    />
                  </vs-td>
                  <vs-td>
                    <vs-checkbox
                      v-model="heatRule.gradient"
                      class="input-checkbox"
                    >
                      <template #icon> <i class="bx bx-check"></i> </template>
                    </vs-checkbox>
                  </vs-td>
                  <vs-td>
                    <vs-button
                      :disabled="i === 0"
                      icon
                      color="danger"
                      border
                      @click.stop="localSettings.heatRules.splice(i, 1)"
                      :aria-label="$t('deleteRule')"
                    >
                      <i class="bx bxs-trash"></i>
                    </vs-button>
                  </vs-td>
                </vs-tr>
                <vs-tr>
                  <vs-td colspan="6">
                    <vs-button
                      @click="
                        localSettings.heatRules.push(
                          JSON.parse(JSON.stringify(defaultHeatRule))
                        )
                      "
                      icon
                      color="success"
                      class="mx-auto"
                      :aria-label="$t('addRule')"
                    >
                      <i class="bx bx-plus"></i>
                      {{ $t("addRule") }}
                    </vs-button>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
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
            xs="12"
          >
            <vs-button
              block
              color="warn"
              @click="reset()"
              :aria-label="$t('resetToDefault')"
            >
              {{ $t("resetToDefault") }}
            </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
            xs="12"
          >
            <vs-button
              block
              color="dark"
              @click="cancel()"
              :aria-label="$t('cancel')"
            >
              {{ $t("cancel") }}
            </vs-button>
          </vs-col>
          <vs-col
            class="px-2"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            w="4"
            xs="12"
          >
            <vs-button
              block
              color="success"
              @click="save()"
              :aria-label="$t('save')"
            >
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
import { defaultSettings } from "@/consts";

export default {
  props: ["value"],
  components: {
    ColorPicker: () => import("@/components/ColorPicker.vue"),
  },
  data() {
    return {
      active: false,
      loading: false,
      search: "",
      items: [],
      localSettings: {},
      defaultHeatRule: defaultSettings.heatRules[0],
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
      this.localSettings = JSON.parse(JSON.stringify(defaultSettings));
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
<style lang="scss">
.input-number div input {
  max-width: 75px;
  margin-left: auto;
  margin-right: auto;
}
.input-checkbox .vs-checkbox-con {
  margin-left: auto;
  margin-right: auto;
}
</style>
