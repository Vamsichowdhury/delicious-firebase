
import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  firebaseAuth,
  setDoc
} from "../../../firebase.js";
import { query, orderBy, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser, updatePassword } from "firebase/auth";
import { showSnackbar } from "@/utils/snackbar.js";
import { firebaseConfig } from "../../../firebase.js";
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
const adminDashboard = {
  namespaced: true,
  state: {
    admins: [],
  },
  getters: {
    getAdmins: (state) => state.admins,
  },
  mutations: {
    setAdmins(state, admins) {
      state.admins = admins;
    },
  },
  actions: {
    async registerAdmin({ dispatch }, payload) {
      console.log({payload});
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);

        // Create admin document in Firestore
        const adminData = {
          email: payload.email,
          adminLevel: payload.adminLevel,
          password: payload.password,
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "admins", userCredential.user.uid), adminData);

        await dispatch('setAllAdmins');
        showSnackbar("Admin registered successfully", "success");
        return { success: true, data: { id: userCredential.user.uid, ...adminData } };
      } catch (error) {
        console.error("Error registering admin:", error);
        showSnackbar("Error registering admin", "error");
        return { success: false, error: error.message };
      }
    },
    async setAllAdmins({ commit }) {
      try {
        const adminsQuery = query(
          collection(db, "admins"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(adminsQuery);
        const admins = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        commit('setAdmins', admins);
        return { success: true, data: admins };
      } catch (error) {
        console.error("Error fetching admins:", error);
        showSnackbar("Error fetching admins", "error");
        return { success: false, error: error.message };
      }
    },
    // async deleteAdmin({ dispatch }, id) {
    //   try {
    //     // Delete from Firebase Authentication
    //     const user = await firebaseAuth.getUser(id);
    //     await deleteUser(user);

    //     // Delete from Firestore
    //     await deleteDoc(doc(db, "admins", id));

    //     await dispatch('setAllAdmins');
    //     showSnackbar("Admin deleted successfully", "success");
    //     return { success: true };
    //   } catch (error) {
    //     console.error("Error deleting admin:", error);
    //     showSnackbar("Error deleting admin", "error");
    //     return { success: false, error: error.message };
    //   }
    // },
    async deleteAdmin({ dispatch }, payload) {
      try {
        console.log({payload});
        const { id, email, password } = payload;
    
        // Initialize a separate Firebase app instance
        const tempApp = initializeApp(firebaseConfig, 'tempApp');
        const tempAuth = getAuth(tempApp);
    
        // Sign in as the user to be deleted
        await signInWithEmailAndPassword(tempAuth, email, password);
    
        // Delete the user
        await deleteUser(tempAuth.currentUser);
    
        // Delete from Firestore
        await deleteDoc(doc(db, "admins", id));
        // Sign out from the temporary auth instance
        await signOut(tempAuth);
       
        await dispatch('setAllAdmins');
        showSnackbar("Admin deleted successfully", "success");
        return { success: true };
      } catch (error) {
        console.error("Error deleting admin:", error);
        showSnackbar("Error deleting admin", "error");
        return { success: false, error: error.message };
      }
    },
    async editAdmin({ dispatch }, payload) {
      try {
        const { id, ...updateData } = payload;

        // Update in Firestore
        await updateDoc(doc(db, "admins", id), updateData);

        // If password is changed, update in Firebase Authentication
        if (payload.password) {
          const user = await firebaseAuth.getUser(id);
          await updatePassword(user, payload.password);
        }

        await dispatch('setAllAdmins');
        showSnackbar("Admin updated successfully", "success");
        return { success: true, data: payload };
      } catch (error) {
        console.error("Error editing admin:", error);
        showSnackbar("Error editing admin", "error");
        return { success: false, error: error.message };
      }
    },
  }
};

export default adminDashboard;
