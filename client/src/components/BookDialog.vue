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
        <h3>{{ $t("yourBooks") }}</h3>
      </template>

      <vs-table>
        <template #header>
          <div class="d-flex table-header">
            <vs-input
              class="flex-grow-1"
              v-model="search"
              border
              :placeholder="$t('search')"
            />
            <vs-button
              @click="$emit('addBook')"
              circle
              icon
              floating
              color="success"
              :aria-label="$t('addBook')"
            >
              <i class="bx bx-book-add"></i>
            </vs-button>
          </div>
        </template>
        <template #thead>
          <vs-tr>
            <vs-th sort @click="items = $vs.sortData($event, items, 'name')">
              {{ $t("country") }}
            </vs-th>
            <vs-th
              sort
              @click="items = $vs.sortData($event, items, 'lastAdded')"
            >
              {{ $t("lastAdded") }}
            </vs-th>
            <vs-th
              sort
              @click="items = $vs.sortData($event, items, 'bookCount')"
            >
              {{ $t("bookCount") }}
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="country.id"
            v-for="country in $vs.getSearch(items, search)"
          >
            <vs-td class="text-left">
              {{ country.name }}
            </vs-td>
            <vs-td>
              {{ formatDate(country.lastAdded) }}
            </vs-td>
            <vs-td>
              {{ country.bookCount }}
            </vs-td>

            <template #expand>
              <vs-row
                :key="book.id"
                v-for="book in country.books"
                class="book-row"
              >
                <vs-col w="10" class="text-left my-auto">
                  <div class="book-title">{{ book.name }}</div>
                  <div class="book-subtitle">
                    <div>by {{ book.author }}</div>
                    <div>
                      {{ $t("addedOnItem") }} {{ formatDate(book.addedOn) }}
                    </div>
                  </div>
                </vs-col>
                <vs-col w="2" class="book-action">
                  <vs-button
                    icon
                    color="danger"
                    border
                    @click="
                      deleteBookClick({
                        countryId: country.id,
                        bookId: book.id,
                      })
                    "
                    :aria-label="$t('removeBook')"
                  >
                    <i class="bx bxs-trash"></i> </vs-button
                ></vs-col>
              </vs-row>
            </template>
          </vs-tr>
        </template>
      </vs-table>
    </vs-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: ["value"],
  data: () => ({
    active: false,
    loading: false,
    search: "",
    items: [],
  }),
  computed: {
    ...mapState(["user", "settings"]),
    ...mapGetters(["bookData"]),
  },
  methods: {
    ...mapActions(["deleteBook"]),
    deleteBookClick(payload) {
      this.loading = true;
      setTimeout(
        () => this.deleteBook(payload).then(() => (this.active = false)),
        0
      );
    },
    formatDate(date) {
      if (!date) return null;
      return new Date(Date.parse(date)).toLocaleDateString(
        this.settings.locale
      );
    },
  },
  watch: {
    bookData: {
      handler() {
        this.$set(this, "items", this.bookData);
      },
      immediate: true,
      deep: true,
    },
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
<style lang="scss">
.book-row {
  padding: 10px;
  border-radius: var(--vs-radius);
  font-size: 0.8rem;
}
.book-row:hover {
  background-color: #1f2024;
}
.book-title {
  font-weight: 700;
  font-size: 0.9rem;
}
.book-subtitle {
  opacity: 0.8;
  margin-left: 0.5rem;
  display: flex;
  justify-content: space-between;
}
.book-action {
  display: flex !important;
  justify-content: end !important;
}
.table-header {
  margin-top: -5px;
  margin-bottom: -5px;
}
</style>
