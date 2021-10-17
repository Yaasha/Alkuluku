<template>
  <div class="center">
    <vs-button
      class="my-auto"
      @click="active = !active"
      color="success"
      circle
      icon
      floating
    >
      <i class="bx bx-plus"></i>
    </vs-button>
    <vs-dialog :loading="loading" v-model="active">
      <template #header>
        <h4 class="not-margin">Add new book</h4>
      </template>

      <div class="con-form">
        <vs-input v-model="data.name" placeholder="Name">
          <template #icon>
            <i class="bx bxs-book"></i>
          </template>
        </vs-input>
        <vs-input v-model="data.author" placeholder="Author">
          <template #icon>
            <i class="bx bxs-user"></i>
          </template>
        </vs-input>
        <vs-select filter placeholder="Country" v-model="data.country">
          <template #icon>
            <i class="bx bx-world"></i>
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
              placeholder="Added on"
              readonly
              v-bind="attrs"
              v-on="on"
            >
              <template #icon>
                <i class="bx bxs-calendar"></i>
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
          <vs-button block @click="addBookClick(data)"> Add book </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    active: false,
    loading: false,
    data: {
      name: "",
      author: "",
      country: "",
      addedOn: "",
    },
    calendar: false,
  }),
  computed: {
    ...mapGetters(["countries"]),
    computedDateFormatted() {
      return this.formatDate(this.data.addedOn);
    },
  },
  methods: {
    ...mapActions(["addBook"]),
    addBookClick(payload) {
      this.loading = true;
      setTimeout(
        () => this.addBook(payload).then(() => (this.active = false)),
        0
      );
    },
    reset() {
      this.data.name = "";
      this.data.author = "";
      this.data.country = "";
      this.data.addedOn = this.currentDate();
    },
    currentDate() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
  },
  watch: {
    active: {
      handler() {
        this.reset();
        this.loading = false;
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
.con-form .vs-input-content,
.con-form .vs-select-content {
  margin: 10px 0px;
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
