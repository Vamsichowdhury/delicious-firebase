import axios from 'axios'

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

const domain = `${process.env.BASE_URL}/api`

const getSelectedCategoryAPI = async (id) => {
    let url = `${domain}/admin/categories/${id}`;
    return await axios.get(url)
};

const getAllCategoriesAPI = async () => {
    let url = `${domain}/admin/categories`;
    return await axios.get(url)
};

const createCategoryAPI = async (payload) => {
    let url = `${domain}/admin/categories`;
    return await axios.post(url, payload)
};

const editCategoryAPI = async ({ id, category }) => {
    let url = `${domain}/admin/categories/${id}`;
    return await axios.put(url, category)
};

const deleteCategoryAPI = async (payload) => {
    let url = `${domain}/admin/categories/${payload}`;
    return await axios.delete(url)
};
const addItemToCategoryAPI = async (payload) => {
    let url = `${domain}/admin/categories/${payload?.categoryId}/items`;
    return await axios.post(url, payload.item)
};

const editItemAPI = async ({ itemId, categoryId, item }) => {
    let url = `${domain}/admin/categories/${categoryId}/items/${itemId}`;
    return await axios.put(url, item)
};

const deleteItemAPI = async ({ itemId, categoryId }) => {
    let url = `${domain}/admin/categories/${categoryId}/items/${itemId}`;
    return await axios.delete(url)
};

const loginAdminAPI = async (payload) => {
    let url = `${domain}/admin/login`;
    return await axios.post(url, payload)
};

export {
    getSelectedCategoryAPI,
    getAllCategoriesAPI,
    createCategoryAPI,
    deleteCategoryAPI,
    editCategoryAPI,
    addItemToCategoryAPI,
    editItemAPI,
    deleteItemAPI,
    loginAdminAPI,
}