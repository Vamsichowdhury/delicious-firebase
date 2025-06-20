<template>
  <div class="text-center">
    <v-snackbar
      v-model="getSnackbarData.show"
      :timeout="getSnackbarData.timeout"
      location="top"
      :color="getSnackbarData.color"
    >
      {{ getSnackbarData.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapGetters("snackbar/snackbar", ["getSnackbarData"]),
  },
};
</script>
