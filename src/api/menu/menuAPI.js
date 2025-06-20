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

const getAllCategoriesAPI = async () => {
    let url = `${domain}/categories`;
    return await axios.get(url)
};
export {
    getAllCategoriesAPI,
}