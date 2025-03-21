import img1 from '../assets/img/revie-user.png'
import dfIMG from '../assets/img/defaultImg.png'
import { toast } from 'react-toastify';
import logoimg from '../assets/img/logosite.png'
import { utils, writeFileXLSX } from 'xlsx';
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
    // return "https://aksvedas.webupdatecenter.com/storage/"
    return "https://aksvedas.com/storage/"
}
export const apiBaseURL = () => {
    // const hostname = window.location.hostname
    // if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     return "http://127.0.0.1:8000/api";
    // } else {
    // }
    // return "https://aksvedas.webupdatecenter.com/api"
    return "https://aksvedas.com/api"
}
export const apiVersion = () => {
    return "/v1/"
}

export const formatdedDate = (date) => {
    if (!(date instanceof Date)) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return '';
        }
        date = parsedDate;
    }

    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
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
    toast.dismiss();

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
    return Math.ceil(percentage); // Next higher integer
};


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

    if (text?.length > char) {
        return text.slice(0, char) + "...";
    } else {
        return text
    }

}
export const textFormated = (text) => {
    const words = text.split('-');
    const formattedText = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formattedText;
};

export const stringToArray = (str) => {
    if (!str) return [];
    const stringArray = str.split(',');
    const numberArray = stringArray.map((item) => {
        const parsed = parseInt(item.trim(), 10);
        return isNaN(parsed) ? null : parsed;
    });
    return numberArray.filter(item => item !== null);
};


export const getProductType = (type) => {
    return <>
        <span className="text-capitalize">
            {type === 1 ? (
                <>
                    <span className="bg-success text-white btn btn-sm">Simple</span>
                </>
            ) : type === 2 ? (
                <>
                    <span className="bg-warning text-white btn btn-sm">Variant</span>
                </>
            ): type === 3 ? (
                <>
                    <span className="bg-warning text-white btn btn-sm">Bundle</span>
                </>
            ) : (
                <>
                    <span className="bg-info text-white btn btn-sm">Subscription</span>
                </>
            )}
        </span>
    </>
}

export const productslider = {
    autoplay: true,
    autoplayTimeout: 4000,
    smartSpeed: 800,
    margin: 30,
    dots: false,
    nav: true,
    autoplayHoverPause: true,
    responsiveClass: true,
    infinite: true,

    navText: [
        '<i class="fa fa-chevron-left"></i>',
        '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
    responsive: {
        0: {
            items: 1.2,
            nav: false,
        },
        600: {
            items: 2.5,
            nav: false,
        },
        1000: {
            items: 3,
            margin: 10,
        },
        1250: {
            items: 4,
        },
    },
};

export const getReviewStar = (star) => {
    return <>
        {
            star === 5 ?
                <>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                    <i className="fa fa-star fa-star"></i>
                </>
                :
                star === 4 ?
                    <>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa fa-star fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </>
                    :
                    star === 3 ?
                        <>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa fa-star fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                        </>
                        :
                        star === 2 ?
                            <>
                                <i className="fa fa-star fa-star"></i>
                                <i className="fa fa-star fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                            </>
                            :
                            star === 1 ?
                                <>
                                    <i className="fa fa-star fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                    <i className="fa-regular fa-star"></i>
                                </>
                                :
                                <></>
        }
    </>
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const handleDownloadExcel = (dataSource: any, sheetName: string, fileName: string) => {
    const ws = utils.json_to_sheet(dataSource);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    writeFileXLSX(wb, `${fileName}.xlsx`);
    // writeFileXLSX(wb, `${fileName}.pdf`);
};

export const getStatusColor = (status) => {
    const lowerCaseStatus = status?.toLowerCase();
    switch (lowerCaseStatus) {
        case 'delivered':
            return { color: 'white', bg: 'green' };
        case 'shipped':
            return { color: 'white', bg: 'green' };
        case 'out for delivery':
            return { color: 'white', bg: 'green' };
        case 'out for pickup':
            return { color: 'white', bg: 'green' };
        case 'pending':
            return { color: 'white', bg: '#ddad67' };
        case 'cancellation requested':
            return { color: 'white', bg: '#ddad67' };
        case 'cancelled':
            return { color: 'white', bg: 'red' };
        case 'lost':
            return { color: 'white', bg: 'red' };
        default:
            return { color: 'black', bg: 'white' };
    }
};
