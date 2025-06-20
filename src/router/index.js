import Home from "../components/home/Home.vue";
import Menu from "../components/menu/Menu.vue";
import Contact from "../components/contact/Contact.vue";
import CategoriesDashboard from "../components/adminPanel/categories/CategoriesDashboard.vue";
import ItemsDashboard from "../components/adminPanel/items/ItemsDashboard.vue";
import AdminDashboard from "../components/adminPanel/adminDashboard/AdminDashboard.vue";
import Login from "../components/adminPanel/auth/Login.vue";
import { store } from '../store/store'; // Import Vuex store
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: "/home", component: Home },
  { path: "/menu", component: Menu },
  { path: "/admin/categories", component: CategoriesDashboard, meta: { requiresAuth: true } },
  { path: "/contact", component: Contact },
  { path: "/admin/categories/:categoryId/items", component: ItemsDashboard, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/admin/adminDashboard", component: AdminDashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// isLoggedIn function to check Firebase authentication state
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
        if(user){
          store.commit('adminPanel/auth/setAuthStatus', 'Login');
        } else {
          store.commit('adminPanel/auth/setAuthStatus', 'Logout');
        }
      },
      reject
    );
  });
}

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const currentUser = await getCurrentUser();
    console.log(currentUser);
    if (!currentUser) {
      // Update Vuex store
      store.commit('adminPanel/auth/setAuthStatus', 'Logout');
      // Redirect to login page
      next({ path: '/login' });
    } else {
      // User is authenticated, continue navigation
      next();
    }
  } else {
    // No authentication required for this route
    next();
  }
});

export default router;