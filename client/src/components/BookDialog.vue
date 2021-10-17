<template>
  <div class="center">
    <vs-button @click="active = !active" circle icon floating color="success">
      <i class="bx bx-plus"></i>
    </vs-button>
    <vs-dialog scroll overflow-hidden auto-width v-model="active">
      <template #header>
        <h3>Your books</h3>
      </template>

      <vs-table>
        <template #header>
          <vs-input v-model="search" border placeholder="Search" />
        </template>
        <template #thead>
          <vs-tr>
            <vs-th sort @click="items = $vs.sortData($event, items, 'name')">
              Country
            </vs-th>
            <vs-th
              sort
              @click="items = $vs.sortData($event, items, 'lastAdded')"
            >
              Last added
            </vs-th>
            <vs-th
              sort
              @click="items = $vs.sortData($event, items, 'bookCount')"
            >
              Books
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
              {{ country.lastAdded }}
            </vs-td>
            <vs-td>
              {{ country.bookCount }}
            </vs-td>

            <template #expand>
              <vs-row
                class="book-row"
                w="12"
                :key="book.name"
                v-for="book in country.books"
              >
                <vs-col w="10" class="text-left my-auto">
                  <div class="book-title">{{ book.name }}</div>
                  <div class="book-subtitle">
                    <div>by {{ book.author }}</div>
                    <div>(added on {{ book.addedOn }})</div>
                  </div>
                </vs-col>
                <vs-col w="2" class="book-action">
                  <vs-button
                    icon
                    color="danger"
                    border
                    @click="deleteBook({ countryId: country.id, book })"
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
  data: () => ({
    active: false,
    search: "",
    items: [],
  }),
  computed: {
    ...mapState(["user", "settings"]),
    ...mapGetters(["bookData"]),
  },
  methods: {
    ...mapActions(["deleteBook"]),
  },
  watch: {
    bookData: {
      handler() {
        this.$set(this, "items", []);
        for (let country of this.bookData) {
          this.items.push(country);
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss">
.text-left {
  text-align: left;
}
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
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
