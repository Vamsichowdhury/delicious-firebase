/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import colors from "vuetify/util/colors";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          // primary: colors.deepPurple.accent4,
          primary: colors.orange.darken4,
          // primary: colors.red.accent4,
          // bcg: colors.deepPurple.lighten5,
        },
      },
      dark: {
        light: false,
        colors: {
          primary: colors.orange.darken4,
          // bcg: colors.deepPurple.lighten5,
        },
      },
    },
  },
});
