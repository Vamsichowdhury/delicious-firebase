const categories = {
    namespaced: true,
    state: {
        theme: localStorage.getItem("theme") || "light"
    },
    getters: {
        getTheme(state) {
            return state.theme
        },
    },
    mutations: {
        setTheme(state, payload) {
            state.theme = payload
        },
    },
    actions: {
    }
};

export default categories
