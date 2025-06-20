<template>
    <v-card class="menu-item-card" elevation="2" rounded="lg">
      <div class="d-flex">
        <v-img
          :src="item.imageSrc"
          :alt="item.title"
          class="flex-shrink-0"
          width="60"
          height="60"
          cover
          :style="{ objectPosition: 'center' }"
        ></v-img>
        <div class="flex-grow-1 pa-2">
          <div class="d-flex flex-column justify-space-between h-100">
            <div>
              <div class="text-subtitle-2 font-weight-medium text-truncate">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis text-truncate">{{ item.description }}</div>
            </div>
            <div class="flex justify-space-between align-center mt-1">
              <!-- <v-btn
                density="compact"
                variant="tonal"
                size="x-small"
                @click="showDetails = true"
              >
                View More
              </v-btn> -->
              <div class="text-right">
                <div class="text-caption font-weight-bold">{{ item.price }}</div>
                <v-icon
                  size="x-small"
                  :color="item.isVeg ? 'green' : 'red'"
                  :icon="item.isVeg ? 'mdi-leaf' : 'mdi-food-steak'"
                ></v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <v-dialog v-model="showDetails" max-width="400px">
        <v-card>
          <v-card-title class="text-h6">{{ item.title }}</v-card-title>
          <v-card-text>
            <p class="text-body-2">{{ item.description }}</p>
            <p class="text-body-2"><strong>Ingredients:</strong> {{ item.ingredients.join(', ') }}</p>
            <p class="text-body-2"><strong>Allergens:</strong> {{ item.allergens.join(', ') }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showDetails = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'MenuItemCard',
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showDetails: false,
      };
    },
  };
  </script>
  
  <style scoped>
  .menu-item-card {
    transition: all 0.2s ease;
  }
  .menu-item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  </style>