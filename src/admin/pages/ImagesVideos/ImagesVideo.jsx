
import React, { useEffect, useState } from 'react'
import banner from '../../../assets/img/shilajit.png'
import video from "../../../assets/img/video.mp4";
import { LoadingBTN } from '../../../components/admin/LoadingBTN';
import { validateRequired } from '../../../utility/Validate';
import { deleteDataAPI, getDataAPI, postDataAPI } from '../../../utility/api/api';
import { imgBaseURL, toastifyError, toastifySuccess } from '../../../utility/Utility';
import ItemImg from '../../../components/admin/ItemImg';
import Spinner from '../../../components/admin/Spinner';

const ImagesVideo = () => {
    const [updData, setUpdData] = useState(null)
    const [loading, setLoading] = useState(false)

    const [submitLoading, setsubmitLoading] = useState(false)
    const [webBanner, setWebBanner] = useState([])
    const [mobileBanner, setMobileBanner] = useState([])
    const [spotLightList, setSpotLightList] = useState([])
    const [imgPreview, setImgPreview] = useState(null)

    const [value, setValue] = useState({
        'type': '',
        'title': '',
        'desc': '',
        'url': '',
        'img': '',
        'status': 0,
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (updData?.id) {
            setValue({
                ...value,
                'id': updData.id,
                'type': updData.type,
                'title': updData.title == 'null' ? "": updData?.title,
                'url': updData.url == 'null' ? "": updData?.url,
                'desc': updData.desc == 'null' ? "": updData?.desc,
                'status': updData.status,
                'img': updData.img,
            })
            setImgPreview(imgBaseURL() + updData.img)
        } else {
            setValue({
                ...value,
                'type': '',
                'title': '',
                'url': '',
                'desc': '',
                'status': 0,
                'img': '',
            })
        }
    }, [updData])

    useEffect(() => {
        getDataList()
    }, [])
    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setValue({ ...value, 'img': e.target.files[0] })
            setImgPreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }
    const handleCancel = () => {
        setErrors({})
        setValue({ ...value, 'img': '', 'title': '', 'desc': '', 'status': 0, 'url': '' })
        setUpdData(null)
    }

    const getDataList = async () => {
        try {
            setLoading(true)
            const res = await getDataAPI('get-banners')
            if (res?.status) {
                const webRes = res?.data.filter((item) => item.type == "web")
                const mobileRes = res?.data.filter((item) => item.type == "mobile")
                const spotLightRes = res?.data.filter((item) => item.type == "spotlight")
                setWebBanner(webRes)
                setMobileBanner(mobileRes)
                setSpotLightList(spotLightRes)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            const res = await deleteDataAPI(`delete-banner/${id}`)
            if (res?.status) {
                toastifySuccess(res.msg)
                setLoading(false)
                getDataList()
            } else {
                setLoading(false)
                toastifyError('Something Went Wrong')
            }
        } catch (error) {
            console.log(error)
            toastifyError('Something Went Wrong')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const requiredVal = { img: value.img }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('type', value.type);
            formData.append('title', value.title);
            formData.append('url', value.url);
            formData.append('desc', value.desc);
            formData.append('status', value.status);
            formData.append('img', value.img);
            const res = await postDataAPI('add-banner', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getDataList()
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
        const requiredVal = { img: value.img }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', updData.id);
            formData.append('type', value.type);
            formData.append('title', value.title);
            formData.append('url', value.url);
            formData.append('desc', value.desc);
            formData.append('status', value.status);
            formData.append('img', value.img);
            const res = await postDataAPI('update-banner', formData)
            if (res.status) {
                handleCancel()
                setsubmitLoading(false)
                toastifySuccess(res.msg)
                getDataList()
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 class="py-3 mb-2"><span class="fw-light">Aksvedas /</span>Banner Settings </h4>
                        <button onClick={() => setValue({ ...value, 'type': 'web' })} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" className="btn btn-primary"><i className='fa fa-plus'></i>  Add New Banner</button>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="box d-flex justify-content-between">
                                        <h5><i class="fa-solid fa-desktop"></i> Website Slider Banner </h5>
                                    </div>

                                    {
                                        webBanner.length > 0 ?
                                            webBanner?.map((item, i) => (
                                                <div className="col-sm-12 col-lg-6 p_btn" key={i}>
                                                    <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                                        <img src={imgBaseURL() + item.img} alt="" style={{ width: '100%', height: '160px', objectFit: 'top' }} />
                                                    </div>
                                                    <div className="content mt-2">
                                                        <h4 className='m-0 p-0'>{item.title != 'null' && item.title }</h4>
                                                        <p className='m-0 p-0'>{item.desc != 'null' && item?.desc}</p>
                                                    </div>

                                                    <div className="c_btn d-flex">
                                                        <div className='pt-0'>
                                                            <div class={`spinner-grow ${item.status == 1 ? "text-success" : "text-danger"} `} role="status" style={{ height: '25px', width: '25px' }}>
                                                                <span class="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                        <button className='icon_btn __warning mx-2' data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" onClick={() => setUpdData(item)}><i className='fa fa-edit'></i></button>
                                                        <button className='icon_btn __danger' onClick={() => handleDelete(item.id)}><i className='fa fa-trash'></i></button>

                                                    </div>


                                                    <hr className="d-none d-sm-block d-lg-none me-4" />
                                                </div>
                                            ))
                                            :
                                            <>
                                                <h6>There are no Banner for Home Page</h6>
                                            </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <h5><i class="fa-solid fa-mobile-screen"></i> Mobile App Banner</h5>
                                    {
                                        mobileBanner.length > 0 ?
                                            mobileBanner.map((item, i) => (
                                                <div className="col-12 col-sm-6 p_btn" key={i}>
                                                    <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                                        <img src={imgBaseURL() + item.img} alt="" style={{ width: '100%', height: '160px', objectFit: 'top' }} />
                                                    </div>
                                                    {/* <button className='icon_btn c_btn __danger' onClick={() => handleDelete(item.id)}><i className='fa fa-trash'></i></button> */}

                                                    <div className="c_btn d-flex">
                                                        <div className='pt-0'>
                                                            <div class={`spinner-grow ${item.status == 1 ? "text-success" : "text-danger"} `} role="status" style={{ height: '25px', width: '25px' }}>
                                                                <span class="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                        <button className='icon_btn __warning mx-2' data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" onClick={() => { setUpdData(item); setValue({ ...value, 'type': 'mobile' }) }}><i className='fa fa-edit'></i></button>

                                                        <button className='icon_btn __danger' onClick={() => handleDelete(item.id)}><i className='fa fa-trash'></i></button>

                                                    </div>
                                                    <hr className="d-none d-sm-block d-lg-none me-4" />
                                                </div>
                                            ))
                                            :
                                            <>
                                                <h6>There are no Mobile Banner For Home Page</h6>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <h5><i class="fa-solid fa-video"></i> Spotlight Videos </h5>


                                    {
                                        spotLightList.length > 0 ?
                                            spotLightList.map((item, i) => (
                                                <div className="col-12 col-md-3" key={i}>
                                                    <div className='' style={{ position: 'relative' }}>
                                                        <video controls style={{ height: '450px', width: '100%' }}>
                                                            <source src={imgBaseURL() + item.img} type="video/mp4" />
                                                        </video>
                                                        <div className="button-video " style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                            <button className='btn __danger' style={{ width: '40px', height: '40px', borderRadius: '100%' }}><i className='fa fa-trash'></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <>
                                                <h6>There are no spotlight</h6>
                                            </>
                                    }




                                </div>
                            </div>
                        </div>
                    </div>



                </div>
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>


            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">{updData ? 'Update' : 'Add'} Banner</h5>
                    <button type="button" onClick={handleCancel} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <form className="pt-0" id="eCommerceCategoryListForm" onSubmit={updData ? handleUpdate : handleSubmit}>

                        <div className="mb-4 ecommerce-select2-dropdown">
                            <label className="form-label">Select Type</label>
                            <select id="ecommerce-category-status" className="select2 form-select" onChange={handleChange} value={value.type} name='type'>
                                <option value="web">Web</option>
                                <option value="mobile">Mobile</option>
                                <option value="spotlight">Spotlight</option>
                            </select>
                        </div>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" onChange={handleChange} name="title" value={value.title} placeholder="Enter Brand title" />
                            <span className='errMsg'>{errors.title}</span>
                        </div>

                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                type="text"
                                name='desc'
                                className='form-control w-100'
                                value={value.desc}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Image */}
                        <div className="mb-3">
                            <label className="form-label">Attachment (Recommended Banner Size - {value.type == 'web' ? "1920 * 678" : "800 * 500"}px)</label>
                            <input className="form-control" type="file" onChange={handleChange} name='file' />
                            <span className='errMsg'>{errors.img}</span>
                            {
                                imgPreview &&
                                <div className='mt-1'><img src={imgPreview} alt=""  style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'contain', background: '#ddd'}}/></div>
                            }
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Redirect URL</label>
                            <input type="url" className="form-control" onChange={handleChange} name="url" value={value.url} placeholder="Paste redirect URL here" />
                            <span className='errMsg'>{errors.url}</span>
                        </div>

                        {/* Status */}
                        <div className="mb-4 ecommerce-select2-dropdown">
                            <label className="form-label">Select category status</label>
                            <select id="ecommerce-category-status" className="select2 form-select" onChange={handleChange} value={value.status} name='status'>
                                <option value>Select category status</option>
                                <option value="1">Publish</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        {/* Submit and reset */}
                        <div className="mb-3">
                            {
                                submitLoading ? <><LoadingBTN /></> :
                                    updData ?
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Update</button>
                                        :
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Save</button>
                            }
                            <button type="reset" onClick={handleCancel} className="btn bg-label-danger" data-bs-dismiss="offcanvas">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <Spinner sppiner={loading} />

        </>
    )
}

export default ImagesVideo