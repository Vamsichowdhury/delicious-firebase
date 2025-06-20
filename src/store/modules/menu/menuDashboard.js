import { db, collection, getDocs, doc, getDoc } from "../../../firebase.js";
import { orderBy, query } from "firebase/firestore";

const categories = {
    namespaced: true,
    state: {
        categories: [],
        selectedCategory: null,
        categoryItems: [],
    },
    getters: {
        getCategories: (state) => {
            return state.categories
        },
        getSelectedCategory: (state) => {
            return state.selectedCategory
        },
        getCategoryItems: (state) => {
            return state.categoryItems
        },
    },
    mutations: {
        setCategories(state, payload) {
            state.categories = payload
        },
        setSelectedCategory(state, payload) {
            state.selectedCategory = payload
        },
        setCategoryItems(state, payload) {
            state.categoryItems = payload
        },
    },
    actions: {
        fetchCategories: async ({ commit }) => {
            try {
                const categoriesQuery = query(
                    collection(db, "categories"),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(categoriesQuery);
                const categories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                commit('setCategories', categories);
                return { success: true, data: categories };
            } catch (error) {
                console.error("Error fetching categories:", error);
                return { success: false, error: error.message };
            }
        },
        fetchCategoryItems: async ({ commit }, categoryId) => {
            try {
                const categoryRef = doc(db, "categories", categoryId);
                const categoryDoc = await getDoc(categoryRef);

                if (categoryDoc.exists()) {
                    const categoryData = categoryDoc.data();
                    commit('setSelectedCategory', { id: categoryDoc.id, ...categoryData });

                    const itemsQuery = query(
                        collection(db, `categories/${categoryId}/totalItems`),
                        orderBy("createdAt", "desc")
                    );
                    const itemsSnapshot = await getDocs(itemsQuery);
                    const items = itemsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    commit('setCategoryItems', items);
                    return { success: true, data: items };
                } else {
                    console.error("Category not found");
                    return { success: false, error: "Category not found" };
                }
            } catch (error) {
                console.error("Error fetching category items:", error);
                return { success: false, error: error.message };
            }
        },
    }
};

export default categories;