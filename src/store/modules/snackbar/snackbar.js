const snackbar = {
  namespaced: true,
  state: {
    snackbar: {
      text: "",
      color: "",
      timeout: 2000,
      show: false,
    },
  },
  getters: {
    getSnackbarData: (state) => {
      return state.snackbar;
    },
  },
  mutations: {
    setSnackbar(state, { text, color }) {
      state.snackbar.text = text;
      state.snackbar.color = color;
      state.snackbar.show = true;
    },
  },
  actions: {},
};

export default snackbar;
