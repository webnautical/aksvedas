import { apiBaseURL, authCustomer, authUser } from "../Utility";
import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: apiBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
function getAuthToken() {
    return authUser()?.token || authCustomer()?.token
}