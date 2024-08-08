import React, { useEffect, useState } from 'react'
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useParams } from 'react-router-dom';
import { imgBaseURL, toastifyError, toastifySuccess } from '../../../utility/Utility';
import CKEditorCom from '../../../components/CKEditorCom';
import { SERVER_ERR, SOMETHING_ERR } from './../../../utility/Constants';

const StaticPages = () => {
    const [loading, setLoading] = useState(false)
    const { route } = useParams()
    const pageTitle = route.replace(/-/g, ' ');
    const [pageData, setPageData] = useState(null)

    const [value, setValue] = useState({
        'id': '',
        'title': '',
        'route': route,
        'content': '',
        'content_2': '',
        'image': ''
    })
    const [imgPreview, setImgPreview] = useState({
        image: null,
    });
    useEffect(() => {
        if (pageData?.id) {
            setValue({
                ...value,
                'id': pageData?.id,
                'title': pageData?.title,
                'route': pageData?.route,
                'content': pageData?.content,
                'content_2': pageData?.content_2 != null ? pageData?.content_2 : '',
                'image': pageData?.image,
                'updated_at': pageData?.updated_at,
            })
            setImgPreview({ ...imgPreview, image: imgBaseURL() + pageData?.image });
        } else {
            setValue({
                ...value,
                'id': '',
                'title': pageTitle,
                'route': route,
                'content': '',
                'content_2': '',
                'image': ''
            })
        }
    }, [pageData])

    useEffect(() => {
        if (route) {
            getPageData()
        }
    }, [route])

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setValue({ ...value, image: e.target.files[0] });
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImgPreview({ ...imgPreview, image: imageUrl });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }
    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["content"]: value };
        });
    };
    const handleEditorChange2 = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["content_2"]: value };
        });
    };

    const getPageData = async () => {
        setLoading(true)
        try {
            const res = await APICALL(`/get-page/${route}`);
            if (res?.status) {
                setPageData(res?.data)
                setLoading(false)
            } else {
                setPageData(null)
                setLoading(false)
            }
        } catch (error) {
            setPageData(null)
            setLoading(false)
        }
    }

    const handlePageForm = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("id", value.id);
            formData.append("title", value.title);
            formData.append("route", value.route);
            formData.append("content", value.content);
            formData.append("content_2", value.content_2);
            formData.append("image", value.image);
            const res = await APICALL(`/page`, 'post', formData);
            if (res?.status) {
                toastifySuccess('Content Updated Successfully')
                getPageData()
                setLoading(false)
            } else {
                setLoading(false)
                toastifyError(SOMETHING_ERR)
            }
        } catch (error) {
            setLoading(false)
            toastifyError(SERVER_ERR)
        }
    }

        console.log("route",route)
    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="row">
                        <div className="col-12 col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0 text-capitalize">{pageTitle}</h5>
                                    {/* <div className="d-flex align-content-center flex-wrap gap-2">
                                        <Link to={`#`} className="btn btn-primary">Add New</Link>
                                    </div> */}
                                </div>
                                <div className="row g-3 px-3 pb-4">
                                    <div className="col-sm-6">
                                        <label htmlFor="">Title</label>
                                        <input type="text" name='title' value={value.title} onChange={handleChange} className='form-control' placeholder='Title' />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="">Route</label>
                                        <input type="text" name='route' value={value.route} onChange={handleChange} className='form-control' placeholder='Route' />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="ecommerce-product-barcode" > Content</label>
                                        <CKEditorCom ckValue={value?.content} handleEditorChange={handleEditorChange} />
                                    </div>
                                    {
                                        route == 'about-us' &&
                                        <>
                                            <div className="col-12">
                                                <label className="form-label" htmlFor="ecommerce-product-barcode" > Content 2</label>
                                                <CKEditorCom ckValue={value?.content_2} handleEditorChange={handleEditorChange2} />
                                            </div>
                                            <div className="col-sm-12">
                                                <label htmlFor="">About Image</label>
                                                <div className="img-box">
                                                    <div className="file-uploader">
                                                        <label className="global_file_upload_deisgn" for="mediaone">
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"
                                                                style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve"
                                                            >
                                                                <g><path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae" ></path>
                                                                </g>
                                                            </svg>

                                                            <p className="m-0">Upload file Here</p>
                                                            <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                            <span className="image_class" style={{fontWeight:'400!important', fontSize:'14px!important'}}>Image Resolution: 627px ×  627px </span>
                                                            <input type="file" name="image" id="mediaone" onChange={handleChange} />
                                                        </label>
                                                        <div class="preview_upload">
                                                            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                                                {imgPreview.image && (
                                                                    <img src={imgPreview.image} alt="Cover Preview" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className="col-12 text-end">
                                        <span>Last Update {timeAgo(value.updated_at)}</span> <button type='button' onClick={() => handlePageForm()} className="btn btn-primary">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default StaticPages