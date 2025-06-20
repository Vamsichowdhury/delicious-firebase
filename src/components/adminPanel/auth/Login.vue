<template>
  <div style="height: 90vh" class="d-flex align-start pa-4 mt-6">
    <v-card
      class="text-center mx-auto"
      elevation="12"
      max-width="400"
      rounded="lg"
      width="100%"
      style="border: 2px solid red"
    >
      <v-card-item class="bg-primary">
        <v-card-title class="text-h5 text-center font-weight-bold">
          <span class="text-h5 mr-6">Login</span>
        </v-card-title>
      </v-card-item>
      <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
        <v-text-field
          v-model="email"
          type="email"
          color="primary"
          label="Enter email"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          color="primary"
          label="Enter password"
          variant="outlined"
        ></v-text-field>
        <v-container fluid class="d-flex flex-column">
          <p class="py-5 pr-8 font-weight-bold">Login as:</p>
          <v-divider></v-divider>
          <v-radio-group
            inline
            v-model="adminLevel"
            class="d-flex justify-space-between"
          >
            <v-radio color="primary" label="Admin" value="admin"></v-radio>
            <v-radio
              color="primary"
              label="Super Admin"
              value="superAdmin"
            ></v-radio>
          </v-radio-group>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn
          :disabled="!isValid"
          color="primary"
          variant="flat"
          block
          @click="handleLogin()"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <v-snackbar
    :color="snackbarColor"
    v-model="snackbar"
    :timeout="timeout"
    location="top"
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      adminLevel: null,
      email: "",
      password: "",
      isValid: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      snackbarColor: null,
    };
  },
  computed: {
    isValid() {
      return this.email && this.password && this.adminLevel;
    },
  },
  methods: {
    ...mapActions("adminPanel/auth", ["loginWithFirebase"]),
    ...mapMutations("adminPanel/auth", ["setCurrentAdmin", "setAuthStatus"]),

    async handleLogin() {
      if (this.email && this.password && this.adminLevel) {
        const user = {
          adminLevel: this.adminLevel,
          email: this.email,
          password: this.password,
        };
        try {
          const response = await this.loginWithFirebase(user);
          if (response) {
            // User is signed in
            const { uid, email } = response;
            // const idToken = await response.user.getIdToken();
            this.setCurrentAdmin({
              _id: uid,
              adminLevel: this.adminLevel,
              email,
            });
            this.setAuthStatus("Login");
            this.$router.push("/admin/categories");
          }
        } catch (error) {
          this.handleSnackbar(error.message, "error", 3000);
        }
      } else {
        this.handleSnackbar("Please fill all fields", "error", 3000);
      }
    },
    handleSnackbar(text, color, time) {
      this.snackbar = true;
      this.text = text;
      this.snackbarColor = color;
      this.timeout = time;
    },
  },
};
</script>