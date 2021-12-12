<template>
  <div class="center">
    <vs-dialog :loading="loading" v-model="active">
      <template #header>
        <h4 class="not-margin">{{ $t("addNewBook") }}</h4>
      </template>

      <div class="con-form">
        <vs-input
          v-model="data.name"
          :placeholder="$t('name')"
          @blur="validateField('name')"
        >
          <template #icon>
            <i class="bx bxs-book"></i>
          </template>
          <template #message-danger>
            <div class="text-left">{{ errors.name }}</div>
          </template>
        </vs-input>
        <vs-input
          v-model="data.author"
          :placeholder="$t('author')"
          @blur="validateField('author')"
        >
          <template #icon>
            <i class="bx bxs-user"></i>
          </template>
          <template #message-danger>
            <div class="text-left">{{ errors.author }}</div>
          </template>
        </vs-input>
        <vs-select
          filter
          :placeholder="$t('country')"
          v-model="data.country"
          @blur="validateField('country')"
        >
          <template #icon>
            <i class="bx bx-world"></i>
          </template>
          <template #message-danger>
            <div class="text-left">{{ errors.country }}</div>
          </template>
          <vs-option
            :key="country.id"
            v-for="country in countries"
            :label="country.name"
            :value="country.id"
          >
            {{ country.name }}
          </vs-option>
        </vs-select>
        <v-menu
          v-model="calendar"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <vs-input
              v-model="computedDateFormatted"
              :placeholder="$t('addedOn')"
              readonly
              v-bind="attrs"
              v-on="on"
              @change="validateField('addedOn')"
            >
              <template #icon>
                <i class="bx bxs-calendar"></i>
              </template>
              <template #message-danger>
                <div class="text-left">{{ errors.addedOn }}</div>
              </template>
            </vs-input>
          </template>
          <v-date-picker
            v-model="data.addedOn"
            no-title
            dark
            @input="calendar = false"
          ></v-date-picker>
        </v-menu>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button
            :disabled="disabled"
            block
            @click="addBookClick(data)"
            :aria-label="$t('addBook')"
          >
            {{ $t("addBook") }}
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  props: ["value"],
  data: () => ({
    active: false,
    loading: false,
    data: {
      name: "",
      author: "",
      country: "",
      addedOn: "",
    },
    errors: {
      name: "",
      author: "",
      country: "",
      addedOn: "",
    },
    calendar: false,
  }),
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["countries"]),
    computedDateFormatted() {
      return this.formatDate(this.data.addedOn);
    },
    disabled() {
      return !!(
        this.errors.name ||
        this.errors.author ||
        this.errors.country ||
        this.errors.addedOn
      );
    },
  },
  methods: {
    ...mapActions(["addBook"]),
    addBookClick(payload) {
      if (
        this.validateField("name") &&
        this.validateField("author") &&
        this.validateField("country") &&
        this.validateField("addedOn")
      ) {
        this.loading = true;
        setTimeout(
          () => this.addBook(payload).then(() => (this.active = false)),
          0
        );
      }
    },
    reset() {
      this.data.name = "";
      this.data.author = "";
      this.data.country = "";
      this.data.addedOn = this.currentDate();

      this.errors.name = "";
      this.errors.author = "";
      this.errors.country = "";
      this.errors.addedOn = "";
    },
    currentDate() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    formatDate(date) {
      if (!date) return null;
      return new Date(Date.parse(date)).toLocaleDateString(
        this.settings.locale
      );
    },
    validateField(field) {
      if (this.data[field] === "") {
        this.errors[field] = this.$t("fieldCannotBeEmpty");
        return false;
      } else {
        this.errors[field] = "";
        return true;
      }
    },
  },
  watch: {
    value(val) {
      this.active = val;
    },
    active: {
      handler(val) {
        this.reset();
        this.loading = false;
        this.$emit("input", val);
      },
      immediate: true,
    },
  },
};
</script>
<style>
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}
.con-form {
  width: 100%;
}
.con-form .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.con-form .flex a {
  font-size: 0.8rem;
  opacity: 0.7;
}
.con-form .flex a:hover {
  opacity: 1;
}
.con-form .vs-checkbox-label {
  font-size: 0.8rem;
}
.con-form .vs-input-parent,
.con-form .vs-select-content {
  margin: 15px 0px;
  width: calc(100%);
  min-width: 100%;
}
.con-form .vs-input-content .vs-input,
.con-form .vs-select-content .vs-select {
  width: 100%;
}
.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
}
.footer-dialog .vs-button {
  margin: 0px;
}
.vs-select__options__content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
