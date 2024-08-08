import { authCustomer, toastifyError, toastifySuccess } from "../Utility"
import { APICALL, postDataAPI } from "./api"

export const addToCartRepeater = async (data, getWishlistFun, getCartFun, toast = 0, offcanvas = 0) => {
    const { product_id, qnt } = data
    try {
        const param = { customer_id: authCustomer()?.id, product_id: product_id, qnt: qnt, subscription_id : data?.subscription_id }
        const res = await postDataAPI('/v1/add-cart', param)
        if (res?.status) {
            if (toast == 0) {
                // toastifySuccess(res?.msg)
            }
            getWishlistFun()
            getCartFun(offcanvas)
        } else {
            toastifyError('Product can not be added in Cart')
        }
    } catch (error) {
        // toastifyError('Server error')
    }
}

export const cartQntChange = async (data) => {
    const { product_id, qnt } = data
    try {
        const param = { customer_id: authCustomer()?.id, product_id: product_id, qnt: qnt, type: 'qntchange' }
        await postDataAPI('/v1/add-cart', param)
    } catch (error) {
        console.log(error)
    }
}

export const getPageData = async (page) => {
    try {
        const res = await APICALL(`/get-page/${page}`);
        if (res?.status) {
            return res
        }
    } catch (error) {
        console.log(error)
    }
}