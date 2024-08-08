import React, { useEffect, useState } from 'react'
import Spinner from '../../../components/admin/Spinner';
import CKEditorCom from '../../../components/CKEditorCom';
import { APICALL } from '../../../utility/api/api';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';
import { SOMETHING_ERR } from '../../../utility/Constants';
import ItemImg from '../../../components/admin/ItemImg';
import AvailableOn from './AvailableOn';

const Utils = () => {
    const [loading, setLoading] = useState();
    const [imgPreview, setImgPreview] = useState({
        logo: "",
        available_on: "",
        payment_we_accept: "",
    });

    const [value, setValue] = useState({
        logo: "",
        available_on: "",
        payment_we_accept: "",
        footer_text: "",
        copyright: "",
        map_url: "",
        fb_icon: "",
        fb_url: "",
        ig_icon: "",
        ig_url: "",
        twitter_icon: "",
        twitter_url: "",
        yt_icon: "",
        yt_url: "",
        email: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getDataFun();
    }, []);

    const getDataFun = async () => {
        try {
            setLoading(true);
            const res = await APICALL("get-ayurved-experience/web_attr");
            if (res?.status) {
                const obj = res?.data[0]
                setValue({
                    ...value, 
                    'copyright': obj?.copyright, 
                    'footer_text': obj?.footer_text, 
                    'available_on': obj.available_on, 
                    'logo': obj.logo, 
                    'payment_we_accept': obj.payment_we_accept,
                    'map_url': obj.map_url,
                    fb_icon: obj.fb_icon,
                    fb_url: obj.fb_url,
                    ig_icon: obj.ig_icon,
                    ig_url: obj.ig_url,
                    twitter_icon: obj.twitter_icon,
                    twitter_url: obj.twitter_url,
                    yt_icon: obj.yt_icon,
                    yt_url: obj.yt_url,
                    email: obj.email,
                })
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "logo") {
            setValue({ ...value, logo: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, logo: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else if (e.target.name === "available_on") {
            setValue({ ...value, available_on: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, available_on: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else if (e.target.name === "payment_we_accept") {
            setValue({ ...value, payment_we_accept: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, payment_we_accept: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleEditorChange1 = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["footer_text"]: value };
        });
    };
    const handleEditorChange2 = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["copyright"]: value };
        });
    };

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("type", 'web_attr');
            formData.append("logo", value.logo);
            formData.append("available_on", value.available_on);
            formData.append("payment_we_accept", value.payment_we_accept);
            formData.append("footer_text", value.footer_text);
            formData.append("copyright", value.copyright);
            formData.append("map_url", value.map_url);
            formData.append("fb_icon", value.fb_icon);
            formData.append("fb_url", value.fb_url);
            formData.append("ig_icon", value.ig_icon);
            formData.append("ig_url", value.ig_url);
            formData.append("yt_icon", value.yt_icon);
            formData.append("yt_url", value.yt_url);
            formData.append("twitter_icon", value.twitter_icon);
            formData.append("twitter_url", value.twitter_url);
            formData.append("email", value.email);
            const res = await APICALL('/save-utils', 'post', formData);
            if (res?.status) {
                toastifySuccess("Update Successfully !!")
                getDataFun()
            } else {
                toastifyError(SOMETHING_ERR)
                setLoading(false)
            }
        } catch (error) {
            toastifyError(SOMETHING_ERR);
            setLoading(false)
        }
    }
    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 class="py-3 mb-2">
                        <span class="fw-light">Aksvedas /</span> Utils
                    </h4>

                    <AvailableOn />
                    
                    {/* LOGO  */}
                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row">
                                            {/* Logo */}
                                            <div className="col-12 col-md-4">
                                                <h5 className="d-flex justify-content-between"> LOGO</h5>
                                                <div class="file-uploader">
                                                    <label className="global_file_upload_deisgn" for="logo">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            width="32" height="32" viewBox="0 0 32 32"
                                                            style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve"
                                                        >
                                                            <g> <path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae"></path>
                                                            </g>
                                                        </svg>
                                                        <p className="m-0">Upload file Here</p>
                                                        <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                        <p>Image Resolution: 266 × 50</p>
                                                        <input className="form-control d-none" type="file" onChange={handleChange} name="logo" id="logo" />
                                                    </label>
                                                    <span className="errMsg">{errors.logo}</span>
                                                    {imgPreview?.logo ? (
                                                        <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.logo} alt="" /></div>
                                                    ) : <ItemImg img={value?.logo} />}
                                                </div>
                                            </div>

                                            {/* AVAILABLE ON */}
                                            <div className="col-12 col-md-4">
                                                <h5 className="d-flex justify-content-between"> AVAILABLE ON</h5>
                                                <div class="file-uploader">
                                                    <label className="global_file_upload_deisgn" for="available_on">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            width="32" height="32" viewBox="0 0 32 32"
                                                            style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve"
                                                        >
                                                            <g> <path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae"></path>
                                                            </g>
                                                        </svg>
                                                        <p className="m-0">Upload file Here</p>
                                                        <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                        <p>Image Resolution: 464 × 27</p>
                                                        <input className="form-control d-none" type="file" onChange={handleChange} name="available_on" id="available_on" />
                                                    </label>
                                                    <span className="errMsg">{errors.available_on}</span>
                                                    {imgPreview?.available_on ? (
                                                        <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.available_on} alt="" /></div>
                                                    ) : <ItemImg img={value?.available_on} />}
                                                </div>
                                            </div>

                                            {/* PAYMENTS WE ACCEPT */}
                                            <div className="col-12 col-md-4">
                                                <h5 className="d-flex justify-content-between"> PAYMENTS WE ACCEPT</h5>
                                                <div class="file-uploader">
                                                    <label className="global_file_upload_deisgn" for="payment_we_accept">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            width="32" height="32" viewBox="0 0 32 32"
                                                            style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve"
                                                        >
                                                            <g> <path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae"></path>
                                                            </g>
                                                        </svg>
                                                        <p className="m-0">Upload file Here</p>
                                                        <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                        <p>Image Resolution: 202 × 33</p>
                                                        <input className="form-control d-none" type="file" onChange={handleChange} name="payment_we_accept" id="payment_we_accept" />
                                                    </label>
                                                    <span className="errMsg">{errors.payment_we_accept}</span>
                                                    {imgPreview?.payment_we_accept ? (
                                                        <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.payment_we_accept} alt="" /></div>
                                                    ) : <ItemImg img={value?.payment_we_accept} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SOCIAL ICON */}
                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row g-3 pb-3">
                                            <h5 className="d-flex justify-content-between mb-0 pb-0"> Social Media</h5>
                                            {/* <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>Facebook Icon</label>
                                                <input type="text" className='form-control' name='fb_icon' value={value.fb_icon} onChange={handleChange} />
                                            </div> */}
                                            <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>Facebook url</label>
                                                <input type="text" className='form-control' name='fb_url' value={value.fb_url} onChange={handleChange} />
                                            </div>
                                            {/* <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>instrgram Icon</label>
                                                <input type="text" className='form-control' name='ig_icon' value={value.ig_icon} onChange={handleChange} />
                                            </div> */}
                                            <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>instrgram url</label>
                                                <input type="text" className='form-control' name='ig_url' value={value.ig_url} onChange={handleChange} />
                                            </div>
                                            {/* <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>twitter Icon</label>
                                                <input type="text" className='form-control' name='twitter_icon' value={value.twitter_icon} onChange={handleChange} />
                                            </div> */}
                                            <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>twitter url</label>
                                                <input type="text" className='form-control' name='twitter_url' value={value.twitter_url} onChange={handleChange} />
                                            </div>
                                            {/* <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>youtube Icon</label>
                                                <input type="text" className='form-control' name='yt_icon' value={value.yt_icon} onChange={handleChange} />
                                            </div> */}
                                            <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>youtube url</label>
                                                <input type="text" className='form-control' name='yt_url' value={value.yt_url} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row g-3 pb-3">
                                            <h5 className="d-flex justify-content-between mb-0 pb-0"> All emails will be sent to : </h5>
                                            <div className="col-12 col-md-3">
                                                <label htmlFor="" className='text-capitalize'>Email</label>
                                                <input type="text" className='form-control' name='email' value={value.email} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row pb-3">
                                            <div className="col-12 col-md-4">
                                                <h5 className="d-flex justify-content-between"> Footer Text</h5>
                                                <CKEditorCom
                                                    ckValue={value?.footer_text}
                                                    handleEditorChange={handleEditorChange1}
                                                />
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <h5 className="d-flex justify-content-between"> Copyright</h5>
                                                <CKEditorCom
                                                    ckValue={value?.copyright}
                                                    handleEditorChange={handleEditorChange2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row pb-3">
                                            <div className="col-12 col-md-12">
                                                <h5 className="d-flex justify-content-between"> Contact Map</h5>
                                                <input type="text" className='form-control' placeholder='Paste your location' name='map_url' value={value.map_url} onChange={handleChange} />
                                            </div>
                                            <div className="col-12 col-md-12 mt-2">
                                                <iframe
                                                    title="Map"
                                                    src={value.map_url}
                                                    width="100%"
                                                    height="350"
                                                    style={{ border: 0 }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row">
                                            <div className="btn-box mt-2 text-end">
                                                <button type="button" className="btn btn-primary" onClick={() => handleSubmit()}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="content-backdrop fade" />
                <Spinner sppiner={loading} />
            </div>

        </>
    )
}

export default Utils