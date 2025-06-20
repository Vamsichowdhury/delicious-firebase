<template>
  <v-card :theme="getTheme">
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Delicious</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn v-for="item in navBarList" :key="item.value" :to="item.path">
            <v-icon class="mx-2">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'left' : undefined"
        temporary
      >
        <v-list v-if="getAuthStatus === 'Login'">
          <v-list-item
            :title="getCurrentAdmin?.email"
            prepend-avatar="https://randomuser.me/api/portraits/lego/8.jpg"
          >
            <v-tooltip activator="parent" location="top">{{
              getCurrentAdmin?.email
            }}</v-tooltip>
            <v-chip class="bg-primary">
              <p class="font-weight-bold">
                {{
                  getCurrentAdmin?.adminLevel === "superAdmin"
                    ? "Super Admin"
                    : "Admin"
                }}
              </p>
            </v-chip>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-list color="primary" density="compact" nav>
          <v-list-item
            v-for="item in navList"
            :key="item.value"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.value"
            :to="item.path"
            :active="currentRoute === item.path"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list v-if="getAuthStatus === 'Login'">
          <v-list-group prepend-icon="mdi-account" value="adminPanel">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="Admin Panel"
                :active="currentRoute.startsWith('/admin')"
              ></v-list-item>
            </template>
            <div class="admin-submenu">
              <v-list-item
                color="primary"
                to="/admin/categories"
                prepend-icon="mdi-shape"
                title="Categories"
                value="categories"
                :active="currentRoute === '/admin/categories'"
              ></v-list-item>
              <v-list-item
                color="primary"
                to="/admin/adminDashboard"
                prepend-icon="mdi-account-group"
                title="Admin Dashboard"
                value="adminDashboard"
                :active="currentRoute === '/admin/adminDashboard'"
              ></v-list-item>
            </div>
          </v-list-group>
        </v-list>
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            :prepend-icon="
              getTheme === 'light' ? 'mdi-track-light-off' : 'mdi-track-light'
            "
            :title="getTheme === 'light' ? 'Dark' : 'Light'"
            @click="handleTheme()"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            :prepend-icon="
              getAuthStatus === 'Login' ? 'mdi-logout' : 'mdi-login'
            "
            :title="getAuthStatus === 'Login' ? 'Logout' : 'Login'"
            @click="handleLogin"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <snackbar />
        <router-view color="bcg"></router-view>
        <v-bottom-navigation
          color="primary"
          grow
          v-if="!$vuetify.display.mdAndUp"
        >
          <v-btn v-for="item in navBarList" :key="item.value" :to="item.path">
            <v-icon size="x-large" color="primary">{{ item.icon }}</v-icon>
            <span>{{ item.title }}</span>
          </v-btn>
        </v-bottom-navigation>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getAuth, signOut } from "firebase/auth";
import snackbar from "./Snackbar.vue";

export default {
  data: () => ({
    value: 1,
    drawer: false,
    theme: localStorage.getItem("theme") || "light",
    navList: [
      { icon: "mdi-home", title: "Home", value: "home", path: "/home" },
      { icon: "mdi-widgets", title: "Menu", value: "menu", path: "/menu" },
      // { icon: "mdi-cart", title: "Cart", value: "cart", path: "/cart" },
      // { icon: "mdi-heart", title: "Wishlist", value: "wishlist", path: "/wishlist" },
      {
        icon: "mdi-map-marker",
        title: "Contact",
        value: "contact",
        path: "/contact",
      },
    ],
    navBarList: [
      { icon: "mdi-home", title: "Home", value: "home", path: "/home" },
      { icon: "mdi-widgets", title: "Menu", value: "menu", path: "/menu" },
      // { icon: "mdi-cart", title: "Cart", value: "cart", path: "/cart" },
      {
        icon: "mdi-map-marker",
        title: "Contact",
        value: "contact",
        path: "/contact",
      },
    ],
  }),
  computed: {
    ...mapGetters("settings/settings", ["getTheme"]),
    ...mapGetters("adminPanel/auth", ["getCurrentAdmin"]),
    ...mapGetters("adminPanel/auth", ["getAuthStatus"]),
    currentRoute() {
      return this.$route.path;
    },
  },
  // watch: {
  //     getAuthStatus(newValue) {
  //         if (newValue === 'Login') {
  //             this.navList.push(
  //                 { icon: "mdi-account", title: "Admin Panel", value: "adminPanel", path: "/admin/categories" }
  //             )
  //         }
  //     }
  // },
  methods: {
    ...mapMutations("settings/settings", ["setTheme"]),
    ...mapMutations("adminPanel/auth", ["setAuthStatus"]),

    handleTheme() {
      if (this.getTheme === "light") {
        localStorage.setItem("theme", "dark");
        this.setTheme("dark");
      } else {
        localStorage.setItem("theme", "light");
        this.setTheme("light");
      }
    },
    async handleLogin() {
      if (this.getAuthStatus === "Login") {
        try {
          await signOut(getAuth());
          this.setAuthStatus("Logout");
          this.$router.push("/login");
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-submenu {
  margin-left: -2rem;
}
</style>
