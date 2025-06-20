import {store} from '../store/store';

export const  showSnackbar = (text, color) => {
    store.commit('snackbar/snackbar/setSnackbar', { text: text, color: color });
}