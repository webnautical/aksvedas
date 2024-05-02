import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDataAPI, postDataAPI } from '../utility/api/api';
import { authCustomer } from '../utility/Utility';
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
    const [allData, setAllData] = useState(null)
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


    const getCustomerDetails = async () => {
        const res = await getDataAPI(`/v1/customer-details/${authCustomer()?.id}`)
        if (res?.status) {
            setCustomerDetails(res?.data)
        } else {
            setCustomerDetails(null)
        }
    }

    const getWishlistFun = async () => {
        try {
            const param = { customer_id: authCustomer()?.id }
            const res = await postDataAPI('/v1/get-wishlist', param)
            if (res?.status) {
                setWishlistData(res?.data)
            } else {
                setWishlistData([])
            }
        } catch (error) {
            setWishlistData([])
        }
    }

    const getCartFun = async () => {
        try {
            const param = { customer_id: authCustomer()?.id }
            const res = await postDataAPI('/v1/get-cart', param)
            console.log("res",res)
            if (res?.status) {
                setCartData(res?.data)
            } else {
                setCartData([])
            }
        } catch (error) {
            setCartData([])
        }
    }

    const getHomeDataFun = async () => {
        try {
            const res = await getDataAPI('/v1/get-home-page/web')
            if (res?.status) {
                setAllData(res?.data)
            } else {
                setAllData(null)
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <ContextData.Provider value={{
            customerDetails, getCustomerDetails, getWishlistFun, wishlistData,
            categories, brand, contextLoading, products, fetchData,
            getHomeDataFun,allData,
            getCartFun,cartData,
        }}>
            {children}
        </ContextData.Provider>
    );
};