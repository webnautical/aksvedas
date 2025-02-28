import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { getDataAPI, postDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import ItemImg from '../../../components/admin/ItemImg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { defaultIMG, defaultUserIMG, getProductType, imgBaseURL, toastifyError, toastifySuccess } from '../../../utility/Utility';
import { LoadingBTN } from '../../../components/admin/LoadingBTN';
import { useDataContext } from '../../../context/ContextProvider';
import { validateRequired } from '../../../utility/Validate';
import DeleteModal, { closeModal } from '../../../components/admin/DeleteModal';
import CKEditorCom from '../../../components/CKEditorCom';
import ProductContents from './product-contents/ProductContents';
const ProductDetails = () => {
    const navigate = useNavigate()
    const info = useLocation()
    const productDetails = info?.state?.productDetails
    const { attr, attrVal } = useDataContext();

    const [attrValueList, setAttrValueList] = useState([])

    const [submitLoading, setsubmitLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedID, setSelectedID] = useState(null)
    const [productVariantDetails, setProductVariantDetails] = useState({})
    const [productBenefitsList, setProductBenefitsList] = useState([])
    const [productBenefitsDetails, setProductBenefitsDetails] = useState({})

    const extractUniqueAttributeNames = (data) => {
        const attributeNames = new Set();
        data.forEach((row) => {
            row.product_attribute.forEach((attribute) => {
                attributeNames.add(attribute.attribute.name);
            });
        });
        return Array.from(attributeNames);
    };

    const createDynamicAttributeColumns = (attributeNames) => {
        return attributeNames.map((name) => ({
            name: name,
            selector: (row) => {
                const attribute = row.product_attribute.find((attr) => attr.attribute.name === name);
                return attribute ? attribute.attribute_value.value : '---';
            },
        }));
    };

    const uniqueAttributeNames = extractUniqueAttributeNames(listData);
    const dynamicAttributeColumns = createDynamicAttributeColumns(uniqueAttributeNames);

    const columns = [
        {
            name: 'Cover',
            selector: row => <>
                <div className='d-flex multi-list-img'>
                    {
                        row.images.map((item, i) => (
                            <ItemImg img={item?.src} />
                        ))
                    }
                </div>
            </>,
        },
        ...dynamicAttributeColumns,
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Sale Price',
            selector: row => row.sale_price,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={row.status} onClick={() => changeStatus(row)} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },

        {
            name: 'Action',
            selector: row => <>
                <Link to={'#'} className='icon_btn __danger mx-1' data-bs-target="#deleteModal" data-bs-toggle="modal" onClick={() => { setSelectedID(row.id) }}><i className='fa fa-trash' /></Link>
                <button onClick={() => setProductVariantDetails(row)} className='icon_btn __warning' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><i className='fa fa-pencil' /></button>
            </>,
        },
    ];

    const [value, setValue] = useState({
        'product_id': productDetails?.id,
        'attr_id': '',
        'attrVal_id': '',
        'price': '',
        'sale_price': '',
        'product_img': [],
        'status': 0,
    });

    const [imgPreview, setImgPreview] = useState({
        'cover': null,
        'images': [],
    })


    useEffect(() => {
        getListFun()
    }, [])

    const [variantAttr, setVariantAttr] = useState([])
    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setValue({ ...value, 'cover': e.target.files[0] })
        } else if (e.target.name === 'attr_id') {
            setValue({ ...value, 'attr_id': e.target.value })
            const data = attrVal.filter((item) => item.attribute_id == e.target.value)
            setAttrValueList(data)
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const addMoreProductAttr = () => {
        const requiredVal = { attr_id: value.attr_id, attrVal_id: value.attrVal_id }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const newData = {
                'attr_name_id': value.attr_id,
                'attr_value_id': value.attrVal_id,
            };
            setVariantAttr(prevValues => [...prevValues, newData]);
            setValue({ ...value, 'attr_id': '', 'attrVal_id': '' })
        }
    }
    const valueArr = {
        'attr_name_id': value.attr_id,
        'attr_value_id': value.attrVal_id,
    }
    const newArr = [...variantAttr, valueArr.attr_name_id !== "" && valueArr]

    useEffect(() => {
        if (productVariantDetails?.id) {
            const data = attrVal.filter((item) => item.attribute_id == productVariantDetails?.attribute?.id)
            setAttrValueList(data)

            setValue({
                ...value,
                'product_id': productDetails?.id,
                'id': productVariantDetails?.id,
                'attr_id': productVariantDetails?.attribute?.id,
                'attrVal_id': productVariantDetails?.attribute_value?.id,
                'price': productVariantDetails?.price,
                'sale_price': productVariantDetails?.sale_price,
                'product_img': productVariantDetails?.images,
                'status': productVariantDetails?.price,
            })
            const img = []
            productVariantDetails.images.forEach((item) => {
                img.push(imgBaseURL() + item.src)
            })
            setImgPreview({ ...imgPreview, 'images': img })
        } else {
            setValue({
                ...value,
                'product_id': productDetails?.id,
                'attr_id': '',
                'attrVal_id': '',
                'price': '',
                'sale_price': '',
                'product_img': [],
                'status': 0,
            })
        }
    }, [productVariantDetails])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const files1 = Array.from(e.target.files);
        setValue({ ...value, product_img: [...value.product_img, ...files1] });
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImgPreview({ ...imgPreview, images: [...imgPreview.images, ...imageUrls] });
    };

    const handleCancel = () => {
        setErrors({})
        setValue({ ...value, 'attr_id': '', 'id': '', 'attrVal_id': '', 'price': '', 'sale_price': '', 'status': 0 })
        setBenefitsVal({ ...benefitsVal, 'title': '', 'desc': '', 'id': '', 'product_id': '' })
        setImgPreview({ ...imgPreview, 'images': [] })
        setVariantAttr([])
    }

    const getListFun = async () => {
        setLoading(true)
        const params = {
            'product_id': productDetails?.id
        }
        const res = await postDataAPI('/get-product-variant', params)
        if (res?.status) {
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const changeStatus = async (data) => {
        setLoading(true)
        const param = {
            'id': data?.id,
            'status': data.status === 1 ? 0 : 1
        }
        const res = await postDataAPI('change-product-variant-status', param)
        if (res.status) {
            getListFun()
            toastifySuccess(`Product varinat set as ${data.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else if (res?.error?.slug?.length > 0) {
            toastifyError(res?.error?.slug[0])
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        const param = {
            id: selectedID
        }
        const res = await postDataAPI(`delete-product-variant`, param)
        if (res.status) {
            setLoading(false)
            getListFun()
            toastifySuccess('Products deleted succesfully')
            closeModal('deleteModal');
            setSelectedID(null)
        } else {
            toastifySuccess('Products can not be deleted')
            setLoading(false)
        }
    }

    const addProductVariant = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const requiredVal = { price: value.price, sale_price: value.sale_price, attr_id: value.attr_id, attrVal_id: value.attrVal_id }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('product_id', value.product_id);
            formData.append('price', value.price);
            formData.append('sale_price', value.sale_price);
            formData.append('attributes', JSON.stringify(newArr));
            value?.product_img?.forEach((file, index) => {
                formData.append(`product_img[${index}]`, file);
            });

            const res = await postDataAPI('add-product-variant', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getListFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }

    const updateProductVariant = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const requiredVal = { price: value.price, sale_price: value.sale_price, attr_id: value.attr_id, attrVal_id: value.attrVal_id }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', value.id);
            formData.append('product_id', value.product_id);
            formData.append('price', value.price);
            formData.append('sale_price', value.sale_price);
            formData.append('attr_id', value.attr_id);
            formData.append('attrVal_id', value.attrVal_id);
            value?.product_img?.forEach((file, index) => {
                formData.append(`product_img[${index}]`, file);
            });
            const res = await postDataAPI('update-product-variant', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getListFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }

    const handleRemoveImage = (type, index) => {
        if (type === 'cover') {
            setValue({ ...value, 'cover': '' })
            setImgPreview({ ...imgPreview, 'cover': null })
        } else if (type === 'images') {
            const updatedImages = imgPreview.images.filter((imageUrl, i) => i !== index);
            setImgPreview({ ...imgPreview, images: updatedImages });
        }
    };

    const [subPage, setSubPage] = useState(null)
    const setTabsPage = (page) => {
        setSubPage(page)
    }

    const [benefitsVal, setBenefitsVal] = useState({
        'product_id': productDetails?.id,
        'title': '',
        'desc': ''
    })

    const handleEditorChange = (value) => {
        setBenefitsVal((prevValues) => {
            return { ...prevValues, ['desc']: value };
        });
    }

    const addProductBenefits = async () => {
        setsubmitLoading(true)
        const requiredVal = { title: benefitsVal.title, desc: benefitsVal.desc }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('product_id', benefitsVal.product_id);
            formData.append('title', benefitsVal.title);
            formData.append('desc', benefitsVal.desc);
            const res = await postDataAPI('add-product-benefits', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getProductBenefitsFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }
    const updateProductBenefits = async () => {
        setsubmitLoading(true)
        const requiredVal = { title: benefitsVal.title, desc: benefitsVal.desc }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', benefitsVal.id);
            formData.append('product_id', benefitsVal.product_id);
            formData.append('title', benefitsVal.title);
            formData.append('desc', benefitsVal.desc);
            const res = await postDataAPI('update-product-benefits', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getProductBenefitsFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }

    const getProductBenefitsFun = async () => {
        setLoading(true)
        const params = {
            'product_id': productDetails?.id
        }
        const res = await postDataAPI('/get-product-benefits', params)
        if (res?.status) {
            setProductBenefitsList(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const deleteProductBenefits = async (item) => {
        setLoading(true)
        const param = { id: item?.id }
        const res = await postDataAPI(`delete-product-benefits`, param)
        if (res.status) {
            setLoading(false)
            getProductBenefitsFun()
            toastifySuccess('Products benefits deleted succesfully')
        } else {
            toastifySuccess('Products benefits can not be deleted')
            setLoading(false)
        }
    }

    useEffect(() => {
        if (productBenefitsDetails?.id) {
            setBenefitsVal({
                ...benefitsVal,
                'product_id': productBenefitsDetails?.product_id,
                'id': productBenefitsDetails?.id,
                'title': productBenefitsDetails?.title,
                'desc': productBenefitsDetails?.desc,
            })
        } else {
            setBenefitsVal({
                ...benefitsVal,
                'product_id': productDetails?.id,
                'title': '',
                'desc': '',
            })
        }
    }, [productBenefitsDetails])

    const handleEdit = () => {
        navigate(`/admin/add-products`, { state: { productDetails: productDetails } });
    }

    useEffect(() => {
        getAttachements()
    }, [])
    const [attachments, setAttachments] = useState('')
    const handleAttachmentsChange = (e) => {
        setAttachments(e.target.files[0])
        // setValue({ ...value, 'img': e.target.files[0] })
        // const imageUrl = URL.createObjectURL(e.target.files[0]);
    }
    const [attLoad, setAttLoad] = useState(false)
    const uploadattachments = async () => {
        try {
            setAttLoad(true)
            const formData = new FormData();
            formData.append('product_id', productDetails?.id);
            formData.append('type', 'attachment');
            formData.append('img', attachments);
            const res = await postDataAPI('uploadattachments', formData)
            if (res.status) {
                toastifySuccess(res.msg)
                getAttachements()
                setAttLoad(false)
            } else {
                toastifyError('Something Went Wrong')
                setAttLoad(false)
            }
        } catch (error) {
            setAttLoad(false)
        }finally{
            setAttLoad(false)
        }
    }
    const [attachmentData, setAttachmentData] = useState(null)
    const getAttachements = async () => {
        setLoading(true)
        try {
            const params = { product_id: productDetails?.id, type: 'attachment' }
            const res = await postDataAPI('get-product-content', params)
            if (res.status) {
                 const lastIndex = res.data.length - 1;
                setAttachmentData(res.data[lastIndex]);
            } else {
                setAttachmentData(null)
            }
        } catch (error) {
            setAttachmentData(null)
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">

                    <h4 class="py-3 mb-2"><span class=" fw-light">Aksvedas /</span> Edit Product</h4>
                    <div className="row">
                        <div className="col-md-12 admin-product-details">
                            <ul className="nav nav-pills slide_cat mb-4">
                                <li className="nav-item"><button onClick={() => setTabsPage(null)} className={`nav-link ${subPage == null ? 'active' : ''}`}> Product Details</button></li>

                                {
                                    productDetails?.product_type === 2 &&
                                    <li className="nav-item"><button onClick={() => setTabsPage('product-variants')} className={`nav-link ${subPage == 'product-variants' ? 'active' : ''}`}> Variants</button></li>
                                }

                                <li className="nav-item"><button onClick={() => { setTabsPage('product-benefits'); getProductBenefitsFun() }} className={`nav-link ${subPage == 'product-benefits' ? 'active' : ''}`}> Benefits</button></li>

                                <li className="nav-item"><button onClick={() => { setTabsPage('know-about') }} className={`nav-link ${subPage == 'know-about' ? 'active' : ''}`}> Know About</button></li>

                                <li className="nav-item"><button onClick={() => { setTabsPage('key-ingredients') }} className={`nav-link ${subPage == 'key-ingredients' ? 'active' : ''}`}> Key Ingredients</button></li>

                                <li className="nav-item"><button onClick={() => { setTabsPage('use-off') }} className={`nav-link ${subPage == 'use-off' ? 'active' : ''}`}> Use Off</button></li>

                                <li className="nav-item"><button onClick={() => { setTabsPage('recommended with') }} className={`nav-link ${subPage == 'recommended with' ? 'active' : ''}`}> Recommended With</button></li>

                                <li className="nav-item"><button onClick={() => { setTabsPage('faq') }} className={`nav-link ${subPage == 'faq' ? 'active' : ''}`}> FAQ</button></li>
                                <li className="nav-item"><button onClick={() => { setTabsPage('attachments') }} className={`nav-link ${subPage == 'attachments' ? 'active' : ''}`}> Attachments</button></li>
                            </ul>
                        </div>

                        {
                            subPage == null ?
                                <>
                                    <div className="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <div className="customer-avatar-section">
                                                    <div className="d-flex align-items-center flex-column">
                                                        <img className="img-fluid rounded my-3" src={imgBaseURL() + productDetails?.cover} height={110} width={110} alt="User avatar" />
                                                        <div className="customer-info text-center">
                                                            <h4 className="mb-1">{productDetails?.name}</h4>
                                                            <small>Product ID #{productDetails?.id}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="info-container">
                                                    <small className="d-block pt-2 border-top fw-normal text-uppercase  my-2">DETAILS</small>
                                                    <ul className="list-unstyled">
                                                        <li className="mb-3">
                                                            <span className="fw-medium me-2">Brand Name:</span>
                                                            <span>{productDetails?.brand?.name}</span>
                                                        </li>
                                                        <li className="mb-3">
                                                            <span className="fw-medium me-2">Category:</span>
                                                            <span>{productDetails?.category?.name}</span>
                                                        </li>
                                                        <li className="mb-3">
                                                            <span className="fw-medium me-2">Status:</span>
                                                            {productDetails?.status === 1 ? <><span className="p-1 bg-label-success">Active</span></> : <><span className="badge bg-label-danger">Deactive</span></>}
                                                        </li>
                                                        <li className="mb-3">
                                                            <span className="fw-medium me-2">Product Type:</span>
                                                            {getProductType(productDetails?.product_type)}
                                                        </li>
                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
                                        <div className="row text-nowrap">
                                            <div className="col-md-12 mb-2">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-info d-flex justify-content-between">
                                                            <div className="mb-1 gap-1">
                                                                <h4 className="text-primary mb-0">₹{productDetails?.price}</h4>
                                                                <p className="mb-0"> Price</p>
                                                            </div>
                                                            <div className="mb-1 gap-1">
                                                                <h4 className="text-primary mb-0">₹{productDetails?.sale_price}</h4>
                                                                <p className="mb-0"> Selling Price</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between  mt-4 mb-1 gap-1 text-center text-capitalize">
                                                            <div className="mb-1 gap-1">
                                                                <div>
                                                                    {/* <img src={productDetails?.brand?.cover ? imgBaseURL() + productDetails?.brand?.cover : defaultIMG} alt="" style={{ height: '30px', width: '30px', objectFit: 'contain', background: '#ddd', borderRadius: '5px' }} /> */}
                                                                    <h4 className="text-warning mb-0">{productDetails?.brand?.name}</h4>
                                                                </div>
                                                                <p className="mb-0 text-start"> Brand</p>
                                                            </div>

                                                            <div className="mb-1 gap-1">
                                                                <div>
                                                                    <img src={productDetails?.brand?.cover ? imgBaseURL() + productDetails?.category?.cover : defaultIMG} alt="" style={{ height: '30px', width: '30px', objectFit: 'contain', background: '#ddd', borderRadius: '5px' }} />
                                                                    <h4 className="text-warning mb-0">{productDetails?.category?.name}</h4>
                                                                </div>
                                                                <p className="mb-0"> Category</p>
                                                            </div>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <span><strong>Product Description</strong></span>
                                                            <div className='d-block text-wrap mt-2'> <div dangerouslySetInnerHTML={{ __html: productDetails?.description }} /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                productDetails?.product_type === 1 &&
                                                <div className="col-md-12 mb-4">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="card-icon">
                                                                <div className="avatar">
                                                                    Product Images
                                                                </div>
                                                            </div>
                                                            <div className="card-info">
                                                                <div className="d-flex align-items-baseline mb-1 gap-3">
                                                                    {
                                                                        productDetails?.product_images?.map((item) => (
                                                                            <img className="img-fluid rounded" style={{ width: '83px' }} src={item.src ? imgBaseURL() + item.src : defaultIMG} height={160} width={160} alt="User avatar" />
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>


                                        <div className='col-md-12 mt-3'>
                                            <div className="card-body card mb-3">
                                                <div className="d-flex flex-column justify-content-center gap-2 gap-sm-0">
                                                    <h5 className="mt-4 mb-0 d-flex flex-wrap gap-2 align-items-center justify-content-between pb-3">{productDetails?.name}
                                                        {productDetails.quantity > 0 ? <span className="p-1 bg-label-success" style={{ fontSize: '14px' }}>In Stock</span> : <span className="badge bg-label-danger">Out of Stock</span>}
                                                    </h5>
                                                    <p className="">{productDetails?.name}</p>

                                                </div>
                                                <div className="d-flex align-content-center justify-content-end flex-wrap gap-3">

                                                    <button type="button" onClick={() => handleEdit()} className="global_tra_btn">{"Edit "}</button>
                                                    <Link to={'/admin/products'} className="btn btn-primary text-capitalize">{'Product List'}</Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </>
                                :
                                subPage == 'product-variants' ?
                                    <>
                                        <div className="col-12">
                                            <div className="card">
                                                <div className='p-3'>
                                                    <div className='row justify-content-between'>
                                                        <div className='col-md-6'>
                                                            <h6>{productDetails?.name}'s Variant</h6>
                                                        </div>
                                                        <div className='col-md-6 text-end'>
                                                            <button className='btn btn-label-primary' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">Add Variant <i className='fa fa-plus' /></button>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="card-datatable table-responsive">
                                                                <DataTable
                                                                    columns={columns}
                                                                    data={listData}
                                                                    dense
                                                                    highlightOnHover
                                                                    selectableRowsHighlight
                                                                    pagination
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </>
                                    :
                                    subPage == 'product-benefits' ?
                                        <>
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className='p-3'>
                                                        <div className='row justify-content-between align-items-center top_min_header' >
                                                            <div className='col-md-6'>
                                                                <h6 className='m-0'>{productDetails?.name}'s Benefits</h6>
                                                            </div>
                                                            <div className='col-md-6 text-end' >
                                                                <button className='global_tra_btn' type="button" data-bs-toggle="offcanvas" data-bs-target="#productBenefits" aria-controls="offcanvasExample">Add Product Benefits <i className='fa fa-plus' /></button>
                                                            </div>
                                                        </div>
                                                        <div className="row my-3" style={{ borderTop: '1px solid #ececec' }}>
                                                            {
                                                                productBenefitsList.length > 0 ?
                                                                    productBenefitsList.map((item, i) => (
                                                                        <div className="col-12">
                                                                            <div className="title_box benifits p-2 mt-2">
                                                                                <h4 style={{ fontSize: '18px' }} className='m-0 d-flex justify-content-between'>{i + 1}. {item?.title}
                                                                                    <div>
                                                                                        <button onClick={() => setProductBenefitsDetails(item)} className='icon_btn __warning mx-2' type="button" data-bs-toggle="offcanvas" data-bs-target="#productBenefits" aria-controls="productBenefits"><i className='fa fa-pencil' /></button>

                                                                                        <button className='icon_btn __danger' type="button" onClick={() => deleteProductBenefits(item)}><i className='fa fa-trash' /></button>
                                                                                    </div>
                                                                                </h4>
                                                                                <div className='inner_benf-its' dangerouslySetInnerHTML={{ __html: item?.desc }} />
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                    :
                                                                    <div className='col-12 mt-5 text-center'>
                                                                        <h5>There are no benefits added on this product</h5>
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </>

                                        :
                                        subPage == 'attachments' ?
                                            <>
                                                <div className="col-12">
                                                    <div className="card">
                                                        <div className='p-3'>
                                                            <div className='row justify-content-between align-items-center top_min_header' >
                                                                <div className='col-md-6'>
                                                                    <h6 className='m-0'>{productDetails?.name}'s attachments</h6>
                                                                </div>
                                                            </div>
                                                            <div className="row my-3" style={{ borderTop: '1px solid #ececec' }}>
                                                                <div className="col-12">
                                                                    <label className="form-label">Attachment</label>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                    <input className="form-control" type="file" onChange={handleAttachmentsChange} name='img' />
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <button className='btn btn-primary' type='button' onClick={() => uploadattachments()}>Upload Attachments</button>
                                                                </div>
                                                            </div>
                                                            {
                                                                attachmentData?.img &&
                                                                <div>
                                                                    <Link to={imgBaseURL() + attachmentData?.img} target='_blank'>View Attachement</Link>
                                                                </div>
                                                            }
                                                        </div>

                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <ProductContents page={subPage} productTitle={productDetails?.name} productID={productDetails?.id} />
                                            </>
                        }


                    </div>


                </div>
                <div className="content-backdrop fade" />
            </div>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">{value?.id ? 'Update' : 'Add'} Product Variant</h5>
                    <button type="button" onClick={handleCancel} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <form className="pt-0" onSubmit={value?.id ? updateProductVariant : addProductVariant}>

                        {
                            variantAttr?.map((data) => (
                                <>
                                    <div className='row'>
                                        <div className="col-6">
                                            <label className="form-label" htmlFor="attr">Attribute</label>
                                            <select value={data.attr_name_id} className="form-select text-capitalize" disabled>
                                                <option value>Select</option>
                                                {attr?.map((item) => (
                                                    <option value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-6">
                                            <label className="form-label" htmlFor="attr-value">Attribute Value</label>
                                            <select value={data.attr_value_id} className="form-select text-capitalize" disabled>
                                                <option value>Select</option>
                                                {attrVal?.map((item) => (
                                                    <option value={item.id}>{item.value}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ))
                        }

                        <div className="mb-3 ecommerce-select2-dropdown">
                            <label className="form-label" htmlFor="attr">Attribute</label>
                            <select name='attr_id' value={value.attr_id} onChange={handleChange} className="form-select text-capitalize">
                                <option value>Select</option>
                                {attr?.map((item) => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <span className='errMsg'>{errors.attr_id}</span>
                        </div>

                        <div className="mb-1">
                            <label className="form-label" htmlFor="attr-value">Attribute Value</label>
                            <select name='attrVal_id' value={value.attrVal_id} onChange={handleChange} className="form-select text-capitalize">
                                <option value>Select</option>
                                {attrValueList?.map((item) => (
                                    <option value={item.id}>{item.value}</option>
                                ))}
                            </select>
                            <span className='errMsg'>{errors.attrVal_id}</span>
                        </div>
                        <div className="mb-3 text-end">
                            <button type='button' className="btn bg-label-danger" onClick={() => addMoreProductAttr()}>Add more</button>
                        </div>

                        <div className="">
                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label">Price</label>
                                    <input type="number" className="form-control" name="price" value={value.price} onChange={handleChange} />
                                    <span className='errMsg'>{errors.price}</span>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label className="form-label">Sale Price</label>
                                        <input type="number" className="form-control" name="sale_price" value={value.sale_price} onChange={handleChange} />
                                        <span className='errMsg'>{errors.sale_price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Attachment</label>
                            <input className="form-control" type="file" onChange={handleImageChange} name='file' />

                            <div class="preview_upload">
                                {imgPreview?.images?.map((imageUrl, index) => (
                                    <div key={index} className='text-center'>
                                        <img src={imageUrl} alt="img" />
                                        <button type='button' className='icon_btn __danger' onClick={() => handleRemoveImage('images', index)}>
                                            <i className='fa fa-trash' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            {
                                submitLoading ? <><LoadingBTN /></> :
                                    value?.id ?
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Update</button>
                                        :
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Save</button>
                            }
                            <button type="reset" onClick={handleCancel} className="btn bg-label-danger" data-bs-dismiss="offcanvas">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="productBenefits" aria-labelledby="productBenefitsLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="productBenefitsLabel">{benefitsVal?.id ? 'Update' : 'Add'} Product Benefits</h5>
                    <button type="button" onClick={handleCancel} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className='col-12'>
                        <label className="form-label" htmlFor="ecommerce-product-barcode">Title</label>
                        <input type="text" className='form-control' name='title' value={benefitsVal.title} placeholder='Title' onChange={(e) => setBenefitsVal({ ...benefitsVal, 'title': e.target.value })} />
                        <span className='errMsg'>{errors.title}</span>
                    </div>

                    <div className='col-12 my-3'>
                        <label className="form-label" htmlFor="ecommerce-product-barcode">Description</label>
                        <CKEditorCom ckValue={benefitsVal?.desc} handleEditorChange={handleEditorChange} />
                        <span className='errMsg'>{errors.desc}</span>
                    </div>

                    <div className="mb-3">
                        {
                            submitLoading ? <><LoadingBTN /></> :
                                benefitsVal?.id ?
                                    <button type="button" className="btn btn-primary me-sm-3 me-1 data-submit" onClick={updateProductBenefits}>Update</button>
                                    :
                                    <button type="button" className="btn btn-primary me-sm-3 me-1 data-submit" onClick={addProductBenefits}>Save</button>
                        }
                        <button type="reset" onClick={handleCancel} className="btn bg-label-danger" data-bs-dismiss="offcanvas">Cancel</button>
                    </div>
                </div>
            </div>

            <DeleteModal id={'deleteModal'} handleFunc={handleDelete} loading={loading} />
            <Spinner sppiner={loading} />

        </>
    )
}

export default ProductDetails