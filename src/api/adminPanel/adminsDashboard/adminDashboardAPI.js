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

const registerAdminAPI = async (payload) => {
    let url = `${domain}/admin/adminDashboard/register`;
    return await axios.post(url, payload)
};
const getAllAdminsAPI = async (payload) => {
    let url = `${domain}/admin/adminDashboard/allAdmins`;
    return await axios.post(url, payload)
};
const deleteAdminAPI = async (id) => {
    let url = `${domain}/admin/adminDashboard/deleteAdmin/${id}`;
    return await axios.delete(url)
};
const editAdminAPI = async (payload) => {
    let url = `${domain}/admin/adminDashboard/editAdmin/${payload?._id}`;
    return await axios.put(url, payload)
};
export {
    registerAdminAPI,
    getAllAdminsAPI,
    deleteAdminAPI,
    editAdminAPI
}