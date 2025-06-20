<template>
    <v-card>
      <v-banner color="primary" icon="mdi-shape" lines="one">
        <v-banner-text class="text-h6">
          Items
        </v-banner-text>
  
        <template v-slot:actions>
          <v-btn @click="handleItem('Add Item')" class="text-none" color="primary" min-width="92"
            variant="outlined" rounded>
            <v-icon class="mx-2">mdi-plus</v-icon>
            Add Item
          </v-btn>
        </template>
      </v-banner>
      <item-dialog />
      <v-container fluid class="scrollable-container">
        <v-row>
          <v-col v-for="(item, index) in getSelectedCategory?.items" :key="item.id" cols="12" md="3">
            <v-hover v-slot="{ isHovering, props }">
              <v-card :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 24 : 12" v-bind="props"
                :disabled="item.loading" :loading="item.loading" class="mx-auto my-12" max-width="374">
                <template v-slot:loader="{ isActive }">
                  <v-progress-linear :active="isActive" color="primary" height="4"
                    indeterminate></v-progress-linear>
                </template>
  
                <v-img height="250" :src="item.imageSrc" cover></v-img>
  
                <v-card-item>
                  <v-card-title>{{ item.name }}</v-card-title>
                </v-card-item>
                <v-divider class="mx-4"></v-divider>
  
                <v-card-text class="description-container">
                  <div class="text-subtitle-1">
                    {{ item.description }}
                  </div>
                </v-card-text>
  
                <v-divider class="mx-4"></v-divider>
                <v-card-text class="d-flex justify-space-around">
                  <v-chip class="ma-2" color="primary" variant="outlined" size="x-large">
                    Price : <p class="font-weight-bold">
                      ₹ {{ item.price }}
                    </p>
                    <v-icon icon="mdi-outline" end></v-icon>
                  </v-chip>
                </v-card-text>
                <v-divider class="mx-4 mb-1"></v-divider>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn color="medium-emphasis" text="Edit" variant="outlined"
                    @click="handleItem('Edit Item', item, index)">
                    <v-icon class="mx-2">mdi-pencil</v-icon>
                    Edit
                  </v-btn>
                  <v-btn color="error" text="Delete" variant="outlined"
                    @click="handleItem('Delete Item', item, index)">
                    <v-icon class="mx-2">mdi-delete</v-icon>
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </template>
  
  <script>
  import ItemDialog from "./ItemDialog.vue"
  import { mapActions, mapMutations, mapGetters } from "vuex";
  
  export default {
    components: {
      ItemDialog
    },
    data: () => ({
      tab: null,
    }),
  
    computed: {
      ...mapGetters("adminPanel/items", ["getSelectedCategory"]),
    },
  
    methods: {
      ...mapActions("adminPanel/items", ["fetchSelectedCategory"]),
      ...mapMutations("adminPanel/items", ["setItemDialogData"]),
  
      handleItem(operation, item, index) {
        const itemData = {
          open: true,
          operation: operation,
          data: item,
          id: this.$route?.params?.categoryId
        }
        this.setItemDialogData(itemData)
      },
    },
  
    created() {
      this.fetchSelectedCategory(this.$route?.params?.categoryId);
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .scrollable-container {
    height: 85vh;
    overflow-y: auto;
  }
  
  .description-container {
    height: 100px;
    overflow: auto;
  }
  </style>