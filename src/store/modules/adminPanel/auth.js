import { signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import {
  db,
  doc,
  getDoc,
  firebaseAuth
} from "../../../firebase.js";

const auth = {
  namespaced: true,
  state: {
    currentAdmin: null,
    authStatus: 'Logout'
  },
  getters: {
    getCurrentAdmin: (state) => state.currentAdmin,
    getAuthStatus: (state) => state.authStatus
  },
  mutations: {
    setCurrentAdmin(state, payload) {
      state.currentAdmin = payload
    },
    setAuthStatus: (state, payload) => {
      state.authStatus = payload
    }
  },
  actions: {
    loginWithFirebase: async ({ commit }, payload) => {
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        const userDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.adminLevel === payload.adminLevel) {
            const adminUser = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              adminLevel: userData.adminLevel
            };
            commit('setCurrentAdmin', adminUser);
            commit('setAuthStatus', 'Login');
            return adminUser;
          } else {
            throw new Error("Incorrect admin level");
          }
        } else {
          throw new Error("User is not an admin");
        }
      } catch (error) {
        throw error;
      }
    },
    logoutFirebase: ({ commit }) => {
      firebaseAuth.signOut();
      commit('setCurrentAdmin', null);
      commit('setAuthStatus', 'Logout');
    },
  }
};

export default auth;
