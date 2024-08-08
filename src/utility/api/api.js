import { axiosInstance } from "./interceptor"

export const getDataAPI = async (endpoint) => {
    try {
        const res = await axiosInstance.get(endpoint)
        if (res?.data?.status) {
            const response = {
                status: res?.data?.status,
                msg: res?.data?.message,
                data: res?.data?.data
            }
            return response
        } else {
            const response = {
                status: res?.data?.status,
            }
            return response
        }
    } catch (error) {
        const response = {
            status: false,
            error : error?.response?.data.errors
        }
        return response
    }
}

export const postDataAPI = async (endpoint, params) => {
    try {
        const res = await axiosInstance.post(endpoint, params)
        if (res?.data?.status) {
            const response = {
                status: res?.data?.status,
                msg: res?.data?.message,
                data: res?.data?.data
            }
            return response
        } else {
            const response = {
                status: res?.data?.status,
            }
            return response
        }
    } catch (error) {
        const response = {
            status: false,
            error : error?.response?.data.errors
        }
        return response
    }
}

export const deleteDataAPI = async (endpoint) => {
    try {
        const res = await axiosInstance.delete(endpoint)
        if (res?.data?.status) {
            const response = {
                status: res?.data?.status,
                msg: res?.data?.message,
                data: res?.data?.data
            }
            return response
        } else {
            const response = {
                status: res?.data?.status,
            }
            return response
        }
    } catch (error) {
        const response = {
            status: false,
            error : error
        }
        return response
    }
}

export const APICALL = async (endPoint = '', method = 'GET',value = null) => {
    try {
        const response = await axiosInstance({
            method: method,
            url: endPoint,
            data: value
        });
        return response.data;
    } catch (error) {
        return error;
    }
}