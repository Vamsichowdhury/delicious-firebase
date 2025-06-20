<template>
  <!-- use this




  https://vuetifyjs.com/en/components/autocompletes/#filter






 -->

  <div class="mx-4">
    <v-card elevation="24" class="mx-auto mt-16 card-border" rounded="lg" max-width="500"
      style="border: 1px solid red;">
      <v-card-item class="bg-primary">
        <v-card-title class="text-h5 text-center font-weight-bold">
          <span class="text-h5">Contact</span>
        </v-card-title>
      </v-card-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item prepend-icon="mdi-phone" title="+91 883 816 4294"></v-list-item>

        <v-divider inset></v-divider>

        <v-list-item append-icon="mdi-message-text" prepend-icon="mdi-phone" title="+91 939 034 5173"></v-list-item>

        <v-divider inset></v-divider>

        <v-list-item prepend-icon="mdi-email" title="vamsichowdhury@gmail.com"></v-list-item>

        <v-divider inset></v-divider>

        <v-list-item prepend-icon="mdi-map-marker" title="Kondapur, Hyderabad, Telangana, 500084"></v-list-item>
        <v-divider inset></v-divider>

        <!-- <v-list-item prepend-icon="mdi-earth" title="Review Us on Google">

      </v-list-item> -->
        <v-list-item prepend-icon="mdi-earth">
          <!-- <template v-slot:default="{ active, toggle }"> -->
          <a href="https://www.google.com" class="v-list-item v-list-item--link" target="_blank">
            <!-- <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon> -->
            <v-list-item-content>
              <v-list-item-title class="review">Review Us on Google</v-list-item-title>
            </v-list-item-content>
          </a>
          <!-- </template> -->
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item prepend-icon="mdi-clock">

          <span>Monday-Saturday : 9AM - 11PM</span><br />
          <span>Sunday : 9AM - 9PM</span>
        </v-list-item>
      </v-list>
      <!-- <div class="pa-2">
        <v-img rounded="lg" height="250" :src="`${process.env.BASE_URL}/uploads/image-1716305740139-735922061.jpg`"
          cover></v-img>
      </div> -->
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.review {
  margin-left: -15px;
}

.blurred {
  border: 2px solid red;
  filter: blur(5px);
  /* Adjust the blur amount as needed */
  width: 200px;
  /* Adjust width as needed */
  height: 200px;
  /* Adjust height as needed */
}
</style>
