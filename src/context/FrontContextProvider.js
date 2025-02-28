import React, { createContext, useContext, useState, useEffect } from 'react';
import { APICALL, deleteDataAPI, getDataAPI, postDataAPI } from '../utility/api/api';
import { authCustomer, toastifyError, toastifySuccess } from '../utility/Utility';
import FrontLoding from '../components/FrontLoding';
import { useLocation } from 'react-router';
const ContextData = createContext();
export const useFrontDataContext = () => useContext(ContextData);
export const FrontContextProvider = ({ children }) => {
    const [contextLoading, setContextLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brand, setBrand] = useState([]);
    const [products, setProducts] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({})
    const [wishlistData, setWishlistData] = useState([])
    const [cartData, setCartData] = useState([])
    const [orderList, setOrderList] = useState([])
    const [allData, setAllData] = useState(null)
    const [webAttr, setWebAttr] = useState(null)
    const [shippingDetails, setShippingDetails] = useState(null)
    const pathname = useLocation()?.pathname
    const [offcanvas, setOffcanvas] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData();
        getCustomerDetails()
        getHomeDataFun()
        getCartFun()
        getWishlistFun()
    }, []);

    const fetchData = async () => {
        try {
            const categoryData = await getCategory();
            const brandData = await getBrand();
            const productData = await getProducts();
            setProducts(productData)
            setCategories(categoryData);
            setBrand(brandData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const [reviewList, setReviewList] = useState([])

    const getFuxedReviewList = async () => {
        try {
            const res = await APICALL("get-admin-review");
            if (res?.status) {
                setReviewList(res?.data);
            } else {
                setReviewList([]);
            }
        } catch (error) {
            setReviewList([]);
        }
    };

    const getWebAttrFun = async () => {
        try {
            const res = await APICALL("get-ayurved-experience/web_attr");
            if (res?.status) {
                const obj = res?.data[0]
                setWebAttr(obj)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProducts = async () => {
        const params = {
            'type': 'all'
        }
        const res = await postDataAPI('/v1/get-products', JSON.stringify(params))
        if (res?.status) {
            return res.data;
        } else {
            return [];
        }
    }

    const getCategory = async () => {
        const res = await getDataAPI('/v1/get-category')
        if (res?.status) {
            return res.data;
        } else {
            return [];
        }
    }

    const getBrand = async () => {
        const res = await getDataAPI('/get-brand')
        if (res?.status) {
            return res.data;
        } else {
            return [];
        }
    }


    const getCustomerDetails = async (id) => {
        const customer_id = authCustomer()?.id ? authCustomer()?.id : id
        const res = await getDataAPI(`/v1/customer-details/${customer_id}`)
        if (res?.status) {
            setCustomerDetails(res?.data?.data)
            setShippingDetails(res?.data?.shippingDetails)
        } else {
            setCustomerDetails(null)
        }
    }

    const getWishlistFun = async () => {
        try {
            const allProducts = await getProducts();
            if (authCustomer()?.id) {
                const param = { customer_id: authCustomer()?.id }
                const res = await postDataAPI('/v1/get-wishlist', param)
                if (res?.status) {
                    setWishlistData(res?.data)
                } else {
                    setWishlistData([])
                }
            } else {
                const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const matchedProducts = allProducts.filter(product =>
                    wishlist.some(item => item.id === product.id)
                );
                const wishlistFormatted = matchedProducts.map(product => {
                    return {
                        product_id: product.id,
                        product: {
                            ...product,
                        }
                    };
                });
                setWishlistData(wishlistFormatted);
            }
        } catch (error) {
            setWishlistData([])
        }
    }

    const getCartFun = async (type) => {
        try {
            const allProducts = await getProducts();

            if (authCustomer()?.id) {
                const param = { customer_id: authCustomer()?.id }
                const res = await postDataAPI('/v1/get-cart', param)
                if (res?.status) {
                    setCartData(res?.data)
                    if (type === 1) {
                        setOffcanvas(true)
                    }
                } else {
                    setCartData([])
                }
            } else {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const matchedProducts = allProducts.filter(product =>
                    cart.some(item => item.product_id === product.id)
                );
                const cartFormatted = matchedProducts.map(product => {
                    const cartItem = cart.find(item => item.product_id === product.id) || {};
                    return {
                        product_id: product?.id,
                        qnt: cartItem?.qnt || "1",
                        product_items_id: cartItem?.product_items_id || null,
                        name: product?.name || "Unknown Product",
                        category_id: product?.category_id || "0",
                        cover: product?.cover || "default_cover.png",
                        sku: product?.sku || "N/A",
                        price: product?.price || "0",
                        sale_price: product?.sale_price || product?.price || "0",
                        subscription_price: cartItem?.subscription_price || null,
                        subscription_sale_price: cartItem?.subscription_sale_price || null,
                        subscription_days: cartItem?.subscription_days || null,
                        subscription_discount: cartItem?.subscription_discount || null,
                        subscription_id: cartItem?.subscription_id || null
                    };
                });
                setCartData(cartFormatted)
                if (type === 1) {
                    setOffcanvas(true)
                }
            }
        } catch (error) {
            setCartData([])
        }
    }

    const getHomeDataFun = async () => {
        setLoading(true)
        try {
            const res = await getDataAPI('/v1/get-home-page/web')
            if (res?.status) {
                setAllData(res?.data)
                setLoading(false)
            } else {
                setAllData(null)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const getOrderListFun = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/v1/get-orders', 'post', { customer_id: authCustomer()?.id })
            if (res?.status) {
                setOrderList(res?.data)
                setLoading(false)
            } else {
                setOrderList(null)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const addProductInWishlistFun = async (id) => {
        try {
            const customer = authCustomer();
            if (customer?.id) {
                const param = { customer_id: authCustomer()?.id, product_id: id }
                const res = await postDataAPI('/v1/add-wishlist', param)
                if (res?.status) {
                    getWishlistFun()
                    toastifySuccess(res?.msg)
                } else {
                    toastifyError('Product can not be added in wishlist')
                }
            } else {
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const productIndex = wishlist.findIndex(product => product.id === id);
                if (productIndex === -1) {
                    wishlist.push({ id });
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                } else {
                    wishlist.splice(productIndex, 1);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                }
                getWishlistFun();
            }
        } catch (error) {
            toastifyError('Server error')
        }
    }

    const removeCartItemFun = async (id) => {
        try {
            if (authCustomer()?.id) {
                const res = await deleteDataAPI(`v1/remove-cart/${id}`)
                if (res?.status) {
                    toastifySuccess(res.msg)
                    getCartFun()
                } else {
                    toastifyError('Something Went Wrong')
                }
            } else {
                if(id === "clear"){
                    localStorage.removeItem('cart');
                }else{
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart = cart.filter(item => item.product_id !== id);
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
                getCartFun()
            }
        } catch (error) {
            toastifyError('Something Went Wrong')
        }
    }

    return (
        <>
            <ContextData.Provider value={{
                customerDetails, getCustomerDetails, getWishlistFun, wishlistData,
                categories, brand, contextLoading, products, fetchData,
                getHomeDataFun, allData,
                getCartFun, cartData,
                getOrderListFun, orderList,
                getProducts,
                removeCartItemFun, addProductInWishlistFun,
                shippingDetails,
                getWebAttrFun, webAttr,
                reviewList, getFuxedReviewList,
                offcanvas, setOffcanvas, loading
            }}>
                {children}
            </ContextData.Provider>
        </>
    );
};