import img1 from '../assets/img/1.png'
import dfIMG from '../assets/img/defaultImg.png'
import { toast } from 'react-toastify';
import logoimg from '../assets/img/logosite.png'
var CryptoJS = require("crypto-js");
export const defaultUserIMG = img1
export const defaultIMG = dfIMG
export const logo = logoimg

export const imgBaseURL = () => {
    // const hostname = window.location.hostname
    // if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     return "http://127.0.0.1:8000/storage/";
    // } else {
    // }
    return "https://aksvedas.webupdatecenter.com/storage/"
}
export const apiBaseURL = () => {
    // const hostname = window.location.hostname
    // if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     return "http://127.0.0.1:8000/api";
    // } else {
    // }
    return "https://aksvedas.webupdatecenter.com/api"
}
export const apiVersion = () => {
    return "/v1/"
}


export const encryptSessionStorageData = (name, data, key) => {
    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    sessionStorage.setItem(name, encryptData)
}

export const dycryptSessionStorageData = (encryptData, key) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData
}

export const authUser = () => {
    if (sessionStorage.getItem('web-secret')) {
        return dycryptSessionStorageData(sessionStorage.getItem('web-secret'), "DoNotTryToAccess")
    } else {
        return null
    }
}

export const encryptLocalStorageData = (name, data, key) => {
    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    localStorage.setItem(name, encryptData)
}

export const dycryptLocalStorageData = (encryptData, key) => {
    var bytes = CryptoJS.AES.decrypt(encryptData, key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData
}



export const authCustomer = () => {
    if (localStorage.getItem('customer-secret')) {
        return dycryptSessionStorageData(localStorage.getItem('customer-secret'), "DoNotTryToAccess")
    } else {
        return null
    }
}

export const generateSlug = (str) => {
    return str.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');
};

export const toastifySuccess = (message) => {
    toast.success(`${message}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
    });
};

export const toastifyError = (message) => {
    toast.error(`${message}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
    });
};

export function filterListByValue(list, searchValues, exactMatchKeys = []) {
    if (!Object.values(searchValues).some(values => values.length > 0)) {
        return list;
    }
    return list.filter(item => {
        return Object.entries(searchValues).every(([key, values]) => {
            if (values.length === 0) {
                return true;
            }
            if (exactMatchKeys.includes(key)) {
                return values.some(searchValue => {
                    return item[key] == searchValue;
                });
            }
            return values.some(searchValue => {
                return item[key].toLowerCase().includes(searchValue.toLowerCase());
            });
        });
    });
}

export const getPercentageOff = (price, sale_price) => {
    const percentage = ((price - sale_price) / price) * 100;
    return percentage.toFixed(2);
}

export const checkItem = (item, textType) => {
    if (item) {
        return item
    } else {
        if (textType === 1) {
            return "Not updated"
        } else {
            return "---"
        }
    }
}

export const textSlice = (text, char) => {

    if (text.length > char) {
        return text.slice(0, char) + "...";
    }else{
        return text
    }

}