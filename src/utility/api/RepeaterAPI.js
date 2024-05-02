import { authCustomer, toastifyError, toastifySuccess } from "../Utility"
import { postDataAPI } from "./api"

export const addToCartRepeater = async (data,getWishlistFun,getCartFun) => {
    const {product_id, qnt} = data
    try {
        const param = { customer_id: authCustomer()?.id, product_id: product_id, qnt: qnt }
        const res = await postDataAPI('/v1/add-cart', param)
        if (res?.status) {
            toastifySuccess(res?.msg)
            getWishlistFun()
            getCartFun()
        } else {
            toastifyError('Product can not be added in wishlist')
        }
    } catch (error) {
        toastifyError('Server error')
    }
}