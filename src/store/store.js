import { createStore } from 'vuex';
import menuDashboard from './modules/menu/menuDashboard'
import settings from './modules/settings/settings'
import snackbar from './modules/snackbar/snackbar'
import auth from './modules/adminPanel/auth'
import categories from "./modules/adminPanel/categories"
import items from "./modules/adminPanel/items"
import adminDashboard from "./modules/adminPanel/adminDashboard"


export const store = createStore({
    modules: {
        menu: {
            namespaced: true,
            modules: {
                menuDashboard
            }
        },
        settings: {
            namespaced: true,
            modules: {
                settings
            }
        },
        snackbar: {
            namespaced: true,
            modules: {
                snackbar
            }
        },
        adminPanel: {
            namespaced: true,
            modules: {
                auth,
                categories,
                items,
                adminDashboard
            }
        },
    }
});

