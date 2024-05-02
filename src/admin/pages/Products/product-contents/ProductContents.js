import React, { useEffect, useState } from 'react'
import CKEditorCom from '../../../../components/CKEditorCom'
import { LoadingBTN } from '../../../../components/admin/LoadingBTN'
import { postDataAPI } from '../../../../utility/api/api'
import { validateRequired } from '../../../../utility/Validate'
import { imgBaseURL, toastifyError, toastifySuccess } from '../../../../utility/Utility'
import Spinner from '../../../../components/admin/Spinner'
import MultiPageData from './MultiPageData'

const ProductContents = (props) => {
    const { page, productID, productTitle } = props
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contentData, setContentData] = useState([])
    const [updData, setUpdData] = useState(null)

    const [value, setValue] = useState({
        'id': '',
        'product_id': productID,
        'type': '',
        'title': '',
        'desc': '',
        'img': ''
    })
    useEffect(() => {
        if(updData?.id){
            setValue({
                ...value,
                'id': updData?.id,
                'product_id': productID,
                'type': page,
                'title': updData?.title,
                'desc': updData?.desc,
                'img': updData?.img
            })
            setImgPreview({ ...imgPreview, 'img': imgBaseURL() +updData?.img })

        }
        else if (page) {
            setValue({
                ...value,
                'id': '',
                'product_id': productID,
                'type': page,
                'title': '',
                'desc': '',
                'img': ''
            })
        }else{
            setValue({
                ...value,
                'id': '',
                'product_id': productID,
                'type': page,
                'title': '',
                'desc': '',
                'img': ''
            })
        }
    }, [page,updData])
    const [imgPreview, setImgPreview] = useState({
        'img': null,
    })
    const [errors, setErrors] = useState({})

    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ['desc']: value };
        });
    }
    
    const handleChange = (e) => {
        if (e.target.name === 'img') {
            setValue({ ...value, 'img': e.target.files[0] })
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImgPreview({ ...imgPreview, 'img': imageUrl })
        } else {
            setValue({ ...value, [e.target.name]: e.target.value })
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitLoading(true)
            const required_field = { title: value.title, desc: value.desc }
            const validationErrors = validateRequired(required_field);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                const formData = new FormData();
                formData.append('product_id', value.product_id);
                formData.append('type', value.type);
                formData.append('title', value.title);
                formData.append('desc', value.desc);
                formData.append('img', value.img);
                const res = await postDataAPI('add-product-content', formData)
                if (res.status) {
                    toastifySuccess(res.msg)
                    setSubmitLoading(false)
                    getProductContents()
                } else {
                    toastifyError('Something Went Wrong')
                    setSubmitLoading(false)
                }

            } else {
                setSubmitLoading(false)
            }

        } catch (error) {
            setSubmitLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            setSubmitLoading(true)
            const required_field = { title: value.title, desc: value.desc }
            const validationErrors = validateRequired(required_field);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                const formData = new FormData();
                formData.append('id', value.id);
                formData.append('title', value.title);
                formData.append('desc', value.desc);
                formData.append('img', value.img);
                const res = await postDataAPI('update-product-content', formData)
                if (res.status) {
                    toastifySuccess(res.msg)
                    setSubmitLoading(false)
                    getProductContents()
                } else {
                    toastifyError('Something Went Wrong')
                    setSubmitLoading(false)
                }

            } else {
                setSubmitLoading(false)
            }

        } catch (error) {
            setSubmitLoading(false)
        }
    }

    const handleCancel = () => {
        setErrors({})
        setValue({ ...value, 'product_id': '', 'id': '', 'title': '', 'desc': '', 'img': '' })
        setImgPreview({ ...imgPreview, 'img': null })
        setUpdData(null)
    }

    useEffect(() => {
        if (page) {
            getProductContents()
        }
    }, [page])

    const getProductContents = async () => {
        setLoading(true)
        try {
            const params = { product_id: productID, type: page }
            const res = await postDataAPI('get-product-content', params)
            if (res.status) {
                setContentData(res?.data)
                setLoading(false)
            } else {
                setContentData([])
                setLoading(false)
            }
        } catch (error) {
            setContentData([])
            setLoading(false)
        }
    }

    useEffect(() => {
        if(updData?.action == "delete"){
            handleDelete()
        }
    },[updData])

    const handleDelete = async () => {
        setLoading(true)
        try {
            const params = { product_id: productID, id: updData?.id }
            const res = await postDataAPI('delete-product-content', params)
            if (res.status) {
                setLoading(false)
                getProductContents()
                toastifySuccess('Content removed successfully')
                setUpdData(null)
            } else {
                setLoading(false)
                toastifyError("Something wen't wrong")
            }
        } catch (error) {
            setLoading(false)
            toastifyError("Server error")
        }
    }

    return (
        <>
            <div className="col-12">
                <div className="card">
                    <div className='p-3'>
                        <div className='row justify-content-between' >
                            <div className='col-md-6'>
                                <h6>{productTitle}</h6>
                            </div>
                            <div className='col-md-6 text-end' >
                                <button className='btn btn-label-primary' type="button" data-bs-toggle="offcanvas" data-bs-target="#productContents" aria-controls="offcanvasExample">Add</button>
                            </div>
                        </div>
                        {
                            page == 'know-about' || page == 'key-ingredients' || page == 'use-off' || page == 'recommended with' || page == 'faq' ?
                                <>
                                    <MultiPageData contentData={contentData} page={page} setUpdData={setUpdData}/>
                                </>
                                :
                                <></>
                        }
                    </div>
                </div>
            </div>


            <div className="offcanvas offcanvas-end" tabIndex={-1} id="productContents" aria-labelledby="productBenefitsLabel">
                <div className="offcanvas-header mb-0 pb-0">
                    <div>
                        <h5 className="offcanvas-title text-uppercase" id="productBenefitsLabel">{value?.id ? 'Update' : 'Add'} {page.replace(/-/g, ' ')}</h5>
                        <p>{productTitle}</p>
                    </div>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                    <br />
                </div>
                <div className="offcanvas-body">
                    <div className='col-12'>
                        <label className="form-label" htmlFor="ecommerce-product-barcode">Title</label>
                        <input type="text" className='form-control' name='title' value={value.title} placeholder='Title' onChange={handleChange} />
                        <span className='errMsg'>{errors.title}</span>
                    </div>

                    <div className='col-12 my-3'>
                        <label className="form-label" htmlFor="ecommerce-product-barcode">Description</label>
                        <CKEditorCom ckValue={value?.desc} handleEditorChange={handleEditorChange} />
                        <span className='errMsg'>{errors.desc}</span>
                    </div>

                    {
                        page !== 'faq' &&
                        <div className="mb-3">
                            <label className="form-label">Attachment</label>
                            <input className="form-control" type="file" onChange={handleChange} name='img' />

                            <div class="preview_upload">
                                {
                                    imgPreview?.img &&
                                    <div className='text-center'>
                                        <img src={imgPreview?.img} alt="img" />
                                        <button type='button' className='icon_btn __danger' onClick={() => handleRemoveImage('images')}>
                                            <i className='fa fa-trash' />
                                        </button>
                                    </div>
                                }
                            </div>
                            <span className='errMsg'>{errors.img}</span>
                        </div>
                    }

                    <div className="mb-3">
                        {
                            submitLoading ? <><LoadingBTN /></> :
                                value?.id ?
                                    <button type="button" className="btn btn-primary me-sm-3 me-1 data-submit" onClick={handleUpdate}>Update</button>
                                    :
                                    <button type="button" className="btn btn-primary me-sm-3 me-1 data-submit" onClick={handleSubmit}>Save</button>
                        }
                        <button type="reset" onClick={handleCancel} className="btn bg-label-danger" data-bs-dismiss="offcanvas">Cancel</button>
                    </div>
                </div>
            </div>

            <Spinner sppiner={loading} />

        </>
    )
}

export default ProductContents