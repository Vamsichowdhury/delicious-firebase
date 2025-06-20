// store/modules/adminCategories.js
import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebase.js";
import { query, orderBy, serverTimestamp, writeBatch } from "firebase/firestore";
import { showSnackbar } from "@/utils/snackbar.js";
import { deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const adminCategories = {
  namespaced: true,
  state: {
    categories: [],
    selectedCategory: {},
    categoryDialogData: {
      open: false,
    },
  },
  getters: {
    getCategories: (state) => {
      return state.categories;
    },
    getSelectedCategory: (state) => {
      return state.selectedCategory;
    },
    getCategoryDialogData(state) {
      return state.categoryDialogData;
    },
  },
  mutations: {
    setCategories(state, payload) {
      state.categories = payload;
    },
    setSelectedCategory(state, payload) {
      state.selectedCategory = payload;
    },
    setCategoryDialogData(state, payload) {
      state.categoryDialogData = payload;
    },
  },
  actions: {
    async fetchSelectedCategory({ commit }, payload) {
      try {
        const categoryRef = doc(db, "categories", payload);
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          commit("setSelectedCategory", {
            id: payload,
            ...categorySnap.data(),
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching selected category:", error);
        showSnackbar("Error fetching selected category", "error");
      }
    },
    async fetchCategories({ commit }) {
      try {
        const categoriesQuery = query(
          collection(db, "categories"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(categoriesQuery);
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });
        commit("setCategories", categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showSnackbar("Error fetching categories", "error");
      }
    },
    async createCategory({ dispatch }, payload) {
      try {
        let imageSrc = "";
        if (payload.image) {
          const uniqueFilename = `${uuidv4()}_${payload.image.name}`;
          const imageRef = ref(storage, `categories/${uniqueFilename}`);
          await uploadBytes(imageRef, payload.image);
          imageSrc = await getDownloadURL(imageRef);
        }

        const categoryData = {
          title: payload.title,
          description: payload.description,
          imageSrc: imageSrc,
          createdAt: serverTimestamp(),
          totalItemsCount: 0,
        };

        await setDoc(doc(collection(db, "categories")), categoryData);
        await dispatch("fetchCategories");
        showSnackbar("Category created successfully", "success");
      } catch (error) {
        console.error("Error creating category:", error);
        showSnackbar("Error creating category", "error");
      }
    },
    async editCategory({ dispatch }, { id, category }) {
      try {
        if (!id) {
          throw new Error("ID is undefined");
        }

        let imageSrc = category.imageSrc;
        if (category.image) {
          const imageRef = ref(storage, `categories/${category.image.name}`);
          await uploadBytes(imageRef, category.image);
          imageSrc = await getDownloadURL(imageRef);
        }

        const categoryData = {
          title: category.title,
          description: category.description,
          ...(imageSrc && { imageSrc }),
        };

        const categoryRef = doc(db, "categories", id);
        await updateDoc(categoryRef, categoryData);
        await dispatch("fetchCategories");
        showSnackbar("Category updated successfully", "success");
      } catch (error) {
        console.error("Error updating category:", error);
        showSnackbar("Error updating category", "error");
      }
    },
    async deleteCategory({ dispatch }, payload) {
      try {
        const categoryRef = doc(db, "categories", payload);
        const categorySnap = await getDoc(categoryRef);

        if (categorySnap.exists()) {
          const categoryData = categorySnap.data();
          if (categoryData.imageSrc) {
            const imageRef = ref(storage, categoryData.imageSrc);
            await deleteObject(imageRef);
          }

          const itemsQuery = query(
            collection(db, `categories/${payload}/totalItems`)
          );
          const itemsSnapshot = await getDocs(itemsQuery);
          const batch = writeBatch(db);

          itemsSnapshot.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            if (itemData.imageSrc) {
              const itemImageRef = ref(storage, itemData.imageSrc);
              deleteObject(itemImageRef).catch(console.error);
            }
            batch.delete(itemDoc.ref);
          });

          await batch.commit();
          await deleteDoc(categoryRef);
          await dispatch("fetchCategories");
          showSnackbar("Category deleted successfully", "success");
        } else {
          throw new Error("No such document!");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        showSnackbar("Error deleting category", "error");
      }
    },
  },
};

export default adminCategories;
