<template>
  <v-card>
    <v-sheet class="mx-auto" max-width="600">
      <v-slide-group show-arrows v-model="tab">
        <v-slide-group-item
          v-for="category in getCategories"
          :key="category.id"
          :value="category.id"
          v-slot="{ isSelected, toggle }"
        >
          <v-btn
            :color="isSelected ? 'primary' : undefined"
            class="ma-2"
            rounded
            @click="toggle"
          >
            {{ category.title }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="category in getCategories"
        :key="category.id"
        :value="category.id"
      >
        <v-container fluid class="scrollable-container">
          <v-row>
            <v-col
              v-for="(item, index) in getCategoryItems"
              :key="item.id"
              cols="12"
              md="3"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :title="item.name"
                  density="compact"
                  :subtitle="item.description"
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 24 : 6"
                  v-bind="props"
                  :disabled="item.loading"
                  :loading="item.loading"
                  class="mx-auto"
                  border
                >
                  <template v-slot:prepend>
                    <v-avatar :image="item.imageSrc" size="55"></v-avatar>
                  </template>
                  <template v-slot:append>
                    <!-- <div class="d-flex flex-column">
                      <v-list-item>
                        <v-text block class="subtitle-1 text-h5"> $ {{ item.price }} </v-text>
                      </v-list-item>
                    </div> -->
                    <div class="text-right">
                      <div class="text-caption font-weight-bold">
                        <v-text block class="subtitle-1 text-h5">
                          $ {{ item.price }}
                        </v-text>
                      </div>
                      <v-icon
                        size="large"
                        :color="item.isVeg ? 'green' : 'red'"
                        :icon="item.isVeg ? 'mdi-leaf' : 'mdi-food-steak'"
                      ></v-icon>
                    </div>
                  </template>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
          <!-- <v-row dense>
            <v-col v-for="(item, index) in getCategoryItems" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <MenuItem :item="item" />
            </v-col>
          </v-row> -->
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MenuItem from "./MenuItem.vue";
export default {
  data: () => ({
    tab: null,
    items: [],
  }),
  computed: {
    ...mapGetters("menu/menuDashboard", ["getCategories", "getCategoryItems"]),
  },
  methods: {
    ...mapActions("menu/menuDashboard", [
      "fetchCategories",
      "fetchCategoryItems",
    ]),
    ...mapActions("adminPanel/items", ["fetchSelectedCategory"]),

    async loadItemsForCategory(categoryId) {
      await this.fetchCategoryItems(categoryId);
      // this.items = this.getCategoryItems?.items || [];
    },
  },
  watch: {
    async tab(newValue, oldValue) {
      if (newValue) {
        await this.loadItemsForCategory(newValue);
      }
    },
  },
  async created() {
    await this.fetchCategories();
    if (this.getCategories.length > 0) {
      this.tab = this.getCategories[0].id;
      await this.loadItemsForCategory(this.tab);
    }
  },
};
</script>

<style lang="scss" scoped>
.scrollable-container {
  height: 85vh;
  overflow-y: auto;
}
</style>
