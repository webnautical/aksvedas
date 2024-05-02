import React, { useEffect, useState } from 'react'
import PageHeaderCom from '../../../components/admin/PageHeaderCom'
import CKEditorCom from '../../../components/CKEditorCom'
import { defaultUserIMG, generateSlug, toastifyError, toastifySuccess, imgBaseURL } from './../../../utility/Utility';
import { useDataContext } from '../../../context/ContextProvider';
import { postDataAPI } from '../../../utility/api/api';
import { validateRequired } from '../../../utility/Validate';
import { useLocation, useNavigate } from 'react-router';
import { LoadingBTN } from './../../../components/admin/LoadingBTN';

const AddProduct = () => {
    const navigate = useNavigate()
    const { categories, brand, attr, attrVal } = useDataContext();
    const [attrValList, setAttrValList] = useState([])
    const info = useLocation()
    const productDetails = info?.state ? info?.state.productDetails : null

    useEffect(() => {
        if (attrVal?.length > 0) {
            setAttrValList(attrVal)
        }
    }, []);

    const [value, setValue] = useState({
        'title': '',
        'sku': '',
        'slug': '',
        'quantity': '',
        'description': '',
        'cover': '',
        'product_img': [],
        'price': '',
        'sale_price': '',
        'product_type': '1',
        'category_id': '',
        'brand_id': '',
        'attr_id': '',
        'attrVal_id': '',
    })

    const [imgPreview, setImgPreview] = useState({
        'cover': null,
        'images': [],
    })
    const [submitLoading, setsubmitLoading] = useState(false)

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productDetails?.id) {
            setValue({
                ...value,
                'id': productDetails?.id,
                'title': productDetails?.name,
                'sku': productDetails?.sku,
                'quantity': productDetails?.quantity,
                'slug': productDetails?.slug,
                'description': productDetails?.description,
                'cover': productDetails?.cover,
                'product_img': productDetails?.product_images,
                'price': productDetails?.price,
                'sale_price': productDetails?.sale_price,
                'product_type': productDetails?.product_type,
                'category_id': productDetails?.category_id,
                'brand_id': productDetails?.brand_id,
            })
            const img = []
            productDetails.product_images.forEach((item) => {
                img.push(imgBaseURL() + item.src)
            })
            setImgPreview({ ...imgPreview, 'cover': imgBaseURL() + productDetails.cover, 'images': img })
        } else {
            setValue({
                ...value,
                'title': '',
                'sku': '',
                'slug': '',
                'quantity': '',
                'description': '',
                'cover': '',
                'product_img': [],
                'price': '',
                'sale_price': '',
                'product_type': '1',
                'category_id': '',
                'brand_id': '',
            })
        }
    }, [productDetails])

    const handleChange = (e) => {
        if (e.target.name === 'cover') {
            setValue({ ...value, 'cover': e.target.files[0] })
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImgPreview({ ...imgPreview, 'cover': imageUrl })
        } else if (e.target.name === 'title') {
            setValue({ ...value, 'title': e.target.value, 'slug': generateSlug(e.target.value) })
        } else if (e.target.name === 'attr_id') {
            setValue({ ...value, 'attr_id': e.target.value })
            const res = attrVal.filter((item) => item.attribute_id == e.target.value)
            setAttrValList(res)
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ['description']: value };
        });
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const files1 = Array.from(e.target.files);
        setValue({ ...value, product_img: [...value.product_img, ...files1] });
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImgPreview({ ...imgPreview, images: [...imgPreview.images, ...imageUrls] });
    };

    const handleRemoveImage = (type, index) => {
        if (type === 'cover') {
            setValue({ ...value, 'cover': '' })
            setImgPreview({ ...imgPreview, 'cover': null })
        } else if (type === 'images') {
            const updatedImages = imgPreview.images.filter((imageUrl, i) => i !== index);
            setImgPreview({ ...imgPreview, images: updatedImages });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const simpleProductRequired = { title: value.title, price: value.price, sale_price: value.sale_price, cover: value.cover }
        const variantProductRequired = { title: value.title, cover: value.cover }
        const validationErrors = validateRequired(value.product_type === "1" ? simpleProductRequired : variantProductRequired);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('product_type', value.product_type);
            formData.append('title', value.title);
            formData.append('slug', value.slug);
            formData.append('sku', value.sku);
            formData.append('quantity', value.quantity);
            formData.append('description', value.description);
            formData.append('price', value.price);
            formData.append('sale_price', value.sale_price);
            formData.append('category_id', value.category_id);
            formData.append('brand_id', value.brand_id);
            formData.append('cover', value.cover);
            value?.product_img?.forEach((file, index) => {
                formData.append(`product_img[${index}]`, file);
            });
            const res = await postDataAPI('product', formData)
            if (res.status) {
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                navigate('/admin/products')
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

    const handleUpdate = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const simpleProductRequired = { title: value.title, price: value.price, sale_price: value.sale_price, cover: value.cover }
        const variantProductRequired = { title: value.title, cover: value.cover }
        const validationErrors = validateRequired(value.product_type === "1" ? simpleProductRequired : variantProductRequired);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', value.id);
            formData.append('product_type', value.product_type);
            formData.append('title', value.title);
            formData.append('slug', value.slug);
            formData.append('quantity', value.quantity);
            formData.append('sku', value.sku);
            formData.append('description', value.description);
            formData.append('price', value.price);
            formData.append('sale_price', value.sale_price);
            formData.append('category_id', value.category_id);
            formData.append('brand_id', value.brand_id);
            formData.append('cover', value.cover);
            value?.product_img?.forEach((file, index) => {
                formData.append(`product_img[${index}]`, file);
            });
            const res = await postDataAPI('update-product', formData)
            if (res.status) {
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                navigate('/admin/products')
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

    console.log("value", value)


    return (
        <>
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="app-ecommerce">
                        <PageHeaderCom pageTitle={value.id ? 'Update Product' : 'Add Product'} link={'/admin/products'} linkBtnName='Product List' />
                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="card-tile mb-0">Product information</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3 col ecommerce-select2-dropdown">
                                            <label className="form-label mb-1" htmlFor="brand">
                                                Product Type
                                            </label>
                                            <select name='product_type' value={value.product_type} onChange={handleChange} className="form-select text-capitalize">
                                                <option value={1}>{'Simple'}</option>
                                                <option value={2}>{'Variant'}</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="ecommerce-product-name">Product Title</label>
                                            <input type="text" className="form-control" placeholder="Product title" name="title" onChange={handleChange} value={value.title} aria-label="Product title" /> <span className='errMsg'>{errors.title}</span>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Slug</label>
                                            <input type="text" onChange={handleChange} name="slug" value={value.slug} className="form-control" placeholder="Enter slug" aria-label="slug" />
                                            <span className='errMsg'>{errors.slug}</span>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label" htmlFor="ecommerce-product-sku">SKU</label>
                                                <input type="text" className="form-control" placeholder="SKU" name="sku" onChange={handleChange} value={value.sku} aria-label="Product SKU" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label" htmlFor="ecommerce-product-sku">Quantity</label>
                                                <input type="text" className="form-control" placeholder="Quantity" name="quantity" onChange={handleChange} value={value.quantity} aria-label="Product SKU" />
                                            </div>
                                        </div>
                                        <div className='col-12'>
                                            <label className="form-label" htmlFor="ecommerce-product-barcode">Description</label>
                                            <CKEditorCom ckValue={value?.description} handleEditorChange={handleEditorChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Media */}
                                <div className="card mb-4">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 card-title">Media</h5>
                                    </div>

                                    <div className="card-body">

                                        <div className="col-12 mt-2">
                                            <div className="img-box">
                                                <input type="file" name='cover' onChange={handleChange} />
                                                <div className='file-uploader'>
                                                    <div class="preview_upload"><h4>Cover Preview</h4>
                                                        <div>
                                                            {imgPreview.cover && <img src={imgPreview.cover} alt="Cover Preview" />}
                                                            {imgPreview.cover && <button onClick={() => handleRemoveImage('cover')}><i className='fa fa-trash' /></button>}
                                                        </div>
                                                    </div>
                                                    <span className='errMsg'>{errors.cover}</span>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="img-box mt-4">
                                            <input type="file" multiple onChange={handleImageChange} />
                                            <div class="preview_upload">
                                                {imgPreview?.images?.map((imageUrl, index) => (
                                                    <div key={index}>
                                                        <img src={imageUrl} alt="img" />
                                                        <button onClick={() => handleRemoveImage('images', index)}>
                                                            <i className='fa fa-trash' />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="col-12 col-lg-4">
                                {/* Pricing Card */}
                                {
                                    value.product_type == "1" &&
                                    <div className="card mb-4">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">Pricing</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label className="form-label">Price</label>
                                                <input type="number" className="form-control" placeholder="Price" name="price" value={value.price} onChange={handleChange} />
                                                <span className='errMsg'>{errors.price}</span>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Sale Price</label>
                                                <input type="number" className="form-control" placeholder="Sale Price" name="sale_price" value={value.sale_price} onChange={handleChange} />
                                                <span className='errMsg'>{errors.sale_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                }


                                {/* Organize Card */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Organize</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3 col ecommerce-select2-dropdown">
                                            <label className="form-label mb-1" htmlFor="brand">
                                                Brand
                                            </label>
                                            <select name='brand_id' value={value.brand_id} onChange={handleChange} className="form-select text-capitalize">
                                                <option value>Select</option>
                                                {brand?.map((item) => (
                                                    <option value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Category */}
                                        <div className="mb-3 col ecommerce-select2-dropdown">
                                            <label className="form-label mb-1 d-flex justify-content-between align-items-center" htmlFor="category-org">
                                                <span>Category</span><a href="javascript:void(0);" className="fw-medium">Add new category</a>
                                            </label>
                                            <select name='category_id' value={value.category_id} onChange={handleChange} className="form-select text-capitalize">
                                                <option value>Select</option>
                                                {categories?.map((item) => (
                                                    <option value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Status */}
                                        <div className="mb-3 col ecommerce-select2-dropdown">
                                            <label className="form-label mb-1" htmlFor="status-org">Status
                                            </label>
                                            <select id="status-org" className="select2 form-select" data-placeholder="Published">
                                                <option value>Published</option>
                                                <option value="Published">Published</option>
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-4">
                                    <div className="card-body">
                                        <button className='btn btn-label-danger w-100'>Cancel</button>
                                        {
                                            submitLoading ? <><LoadingBTN /></>
                                                :
                                                <>
                                                    {
                                                        value.id ?
                                                            <button type='button' className='btn btn-label-primary w-100 mt-2' onClick={handleUpdate}>Update Product</button>
                                                            :
                                                            <button type='button' className='btn btn-label-primary w-100 mt-2' onClick={handleSubmit}>Publish Product</button>
                                                    }
                                                </>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>

        </>
    )
}

export default AddProduct