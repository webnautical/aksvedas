import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDataAPI, postDataAPI } from '../utility/api/api';
const ContextData = createContext();
export const useDataContext = () => useContext(ContextData);
export const ContextProvider = ({ children }) => {
    const [contextLoading, setContextLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brand, setBrand] = useState([]);
    const [attr, setAtrr] = useState([]);
    const [attrVal, setAtrrVal] = useState([]);
    const [countData, setCountData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const countData = await getCount();
            setCountData(countData)
            const categoryData = await getCategory();
            const brandData = await getBrand();
            const arrtData = await getAttr();
            const arrtValData = await getAttrVal();
            setAtrr(arrtData)
            setAtrrVal(arrtValData)
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
        const param = {
            type: 'sub-categories',
        }
        const res = await postDataAPI('/get-categories', param)
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

    const getAttr = async () => {
        const res = await getDataAPI('/get-attribute')
        if (res?.status) {
            return res.data;
        } else {
            return [];
        }
    }
    const getCount = async () => {
        setContextLoading(true)
        const res = await getDataAPI('/get-count')
        if (res?.status) {
            setContextLoading(false)
            return res.data;
        } else {
            setContextLoading(false)
            return [];
        }
    }
    const getAttrVal = async () => {
        const res = await getDataAPI('/get-attribute-value')
        if (res?.status) {
            return res.data;
        } else {
            return [];
        }
    }
    return (
        <ContextData.Provider value={{ categories, brand,attr,attrVal,countData,contextLoading,getProducts, fetchData}}>
            {children}
        </ContextData.Provider>
    );
};