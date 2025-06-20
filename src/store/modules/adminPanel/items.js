import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  storage
} from "../../../firebase.js";
import { ref, deleteObject } from 'firebase/storage';

import { query, orderBy, serverTimestamp } from "firebase/firestore";
import { increment } from "firebase/firestore";
import { showSnackbar } from "@/utils/snackbar.js";
import { v4 as uuidv4 } from "uuid";

const adminCategoryItems = {
  namespaced: true,
  state: {
    itemDialogData: {
      open: false,
    },
    selectedCategory: {},
  },
  getters: {
    getItemDialogData(state) {
      return state.itemDialogData;
    },
    getSelectedCategory: (state) => {
      return state.selectedCategory;
    },
  },
  mutations: {
    setItemDialogData(state, payload) {
      state.itemDialogData = payload;
    },
    setSelectedCategory(state, payload) {
      state.selectedCategory = payload;
    },
  },
  actions: {
    async fetchSelectedCategory({ commit }, payload) {
      try {
        const categoryRef = doc(db, "categories", payload);
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          const categoryData = categorySnap.data();

          // Fetch items for this category, ordered by createdAt
          const itemsQuery = query(
            collection(db, `categories/${payload}/totalItems`),
            orderBy("createdAt", "desc")
          );
          const itemsSnap = await getDocs(itemsQuery);
          const items = itemsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          categoryData.items = items;
          categoryData.totalItemsCount = items.length;
          commit("setSelectedCategory", categoryData);
        } else {
          console.log("No such document!");
          showSnackbar("No such document found", "error");
        }
      } catch (error) {
        console.error("Error fetching selected category:", error);
        showSnackbar("Error fetching selected category", "error");
      }
    },
    async addItemToCategory({ dispatch }, payload) {
      try {
        const { categoryId, item } = payload;

        let imageSrc = "";
        if (item.image) {
          const uniqueFilename = `${uuidv4()}_${item.image.name}`;
          const imageRef = ref(storage, `categories/${categoryId}/items/${uniqueFilename}`);
          await uploadBytes(imageRef, item.image);
          imageSrc = await getDownloadURL(imageRef);
        }

        const itemData = {
          ...item,
          imageSrc,
          createdAt: serverTimestamp(),
        };

        const newItemRef = doc(
          collection(db, `categories/${categoryId}/totalItems`)
        );
        await setDoc(newItemRef, itemData);

        // Update the totalItems count in the category document
        const categoryRef = doc(db, "categories", categoryId);
        await updateDoc(categoryRef, {
          totalItemsCount: increment(1),
        });

        await dispatch("fetchSelectedCategory", categoryId);
        showSnackbar("Item added successfully", "success");
      } catch (error) {
        console.error("Error adding item to category:", error);
        showSnackbar("Error adding item to category", "error");
      }
    },
    async editItem({ dispatch }, payload) {
      try {
        const { categoryId, itemId, item } = payload;

        const itemRef = doc(db, `categories/${categoryId}/totalItems`, itemId);
        await updateDoc(itemRef, item);

        await dispatch("fetchSelectedCategory", categoryId);
        showSnackbar("Item edited successfully", "success");
      } catch (error) {
        console.error("Error editing item:", error);
        showSnackbar("Error editing item", "error");
      }
    },
    async deleteItem({ dispatch }, payload) {
      try {
        const { categoryId, itemId } = payload;

        const itemRef = doc(db, `categories/${categoryId}/totalItems`, itemId);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const itemData = itemSnap.data();
          if (itemData.imageSrc) {
            const itemImageRef = ref(storage, itemData.imageSrc);
            await deleteObject(itemImageRef);
          }
        }

        await deleteDoc(itemRef);

        // Update the totalItems count in the category document
        const categoryRef = doc(db, "categories", categoryId);
        await updateDoc(categoryRef, {
          totalItemsCount: increment(-1),
        });

        await dispatch("fetchSelectedCategory", categoryId);
        showSnackbar("Item deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting item:", error);
        showSnackbar("Error deleting item", "error");
      }
    },
  },
};

export default adminCategoryItems;
