import React, { useEffect, useState } from "react";
import { APICALL, deleteDataAPI, postDataAPI } from "../../../utility/api/api";
import Spinner from "../../../components/admin/Spinner";
import {
    imgBaseURL,
    toastifyError,
    toastifySuccess,
} from "../../../utility/Utility";
import ItemImg from "../../../components/admin/ItemImg";
import { validateRequired } from "../../../utility/Validate";

const ProductKBMobile = () => {
    const [loading, setLoading] = useState();
    const [updData, setUpdData] = useState(null);
    const [page, setPage] = useState("");

    const [list, setList] = useState([])
    useEffect(() => {
        getDataFun();
    }, []);

    const [value, setValue] = useState({
        id: "",
        img1: "",
    });
    useEffect(() => {
        if (updData?.id) {
            setValue({
                ...value,
                id: updData.id,
                img1: updData.img1,
            });
        } else {
            setValue({
                ...value,
                img1: "",
            });
        }
    }, [updData]);
    const [errors, setErrors] = useState({});

    const getDataFun = async () => {
        try {
            setLoading(true);
            const res = await APICALL("get-ayurved-experience/product-knowledge-base-mobile");
            if (res?.status) {
                setList(res?.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [imgPreview, setImgPreview] = useState({
        img2: "",
    });

    const handleChange = (e) => {
        if (e.target.name === "img1") {
            setValue({ ...value, img1: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, img1: e.target.result });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const requiredVal = {
            img1: value.img1,
        };
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append("type", 'product-knowledge-base-mobile');
            formData.append("id", value.id);
            formData.append("title", 'mobile-banner');
            formData.append("img1", value.img1);
            const res = await postDataAPI("product-knowledge-base", formData);
            if (res.status) {
                getDataFun();
                toastifySuccess(res.msg);
                setLoading(false);
                handleCancel()
            } else {
                toastifyError("Something Went Wrong");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const res = await deleteDataAPI(`delete-home-content/${id}`)
            if (res?.status) {
                getDataFun();
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleCancel = () => {
        setPage(null)
        setValue({
            ...value, id: "", img1: "",
        });
    }

    return (
        <>
            <div className="card mb-4">
                <div className="card-widget-separator-wrapper">
                    <div className="card-body card-widget-separator">
                        <div className="row gy-4 gy-sm-1">
                            <div className="col-sm-12 col-lg-12">
                                <h5 className="d-flex justify-content-between">
                                 <div>   Product Knowledge Base Mobile <span style={{fontSize:'12px'}}>(Banner Size 	800 * 500 px)</span></div>
                                    <button
                                        className="btn btn-primary text-capitalize"
                                        type="button"
                                        onClick={() => setPage("updateDashboard")}
                                    >
                                        <i className="fa fa-plus" /> Add New
                                    </button>
                                </h5>
                                <div className="justify-content-between align-items-start pb-3 pb-sm-0 card-widget-3">
                                    {page == "updateDashboard" ? (
                                        <div className="upd-box">
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <div class="file-uploader">
                                                        <label
                                                            className="global_file_upload_deisgn"
                                                            for="imagesec"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                version="1.1"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                width="32"
                                                                height="32"
                                                                viewBox="0 0 32 32"
                                                                style={{ enableBackground: 'new 0 0 512 512' }}
                                                                xmlSpace="preserve"
                                                            >
                                                                <g>
                                                                    <path
                                                                        d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                                                        fill="#a5a3ae"
                                                                    ></path>
                                                                </g>
                                                            </svg>

                                                            <p className="m-0">Upload file Here</p>
                                                            <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                            <span className="image_class" style={{ fontWeight: '400!important', fontSize: '14px!important' }}>Image Resolution: 800 * 500 </span>

                                                            <input
                                                                className="form-control d-none"
                                                                type="file"
                                                                onChange={handleChange}
                                                                name="img1"
                                                                id="imagesec"
                                                            />
                                                        </label>
                                                        <span className="errMsg">{errors.img2}</span>
                                                        {imgPreview?.img1 ? (
                                                            <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.img1} alt="" /></div>
                                                        ) : <ItemImg img={value?.img1} />}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="btn-box mt-2 text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary me-sm-3 me-1"
                                                    onClick={() => handleCancel()}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleSubmit}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="">
                                                <div className="row">
                                                    {
                                                        list?.map((item, i) => (
                                                            <div className="col-sm-6">
                                                                <div className="">
                                                                    <img src={imgBaseURL() + item?.img1} alt="" style={{width : '100%'}} />
                                                                </div>
                                                                <div>
                                                                    <button className="icon_btn __warning mx-2" type="button" onClick={() => { setPage("updateDashboard"); setUpdData(item) }}
                                                                    ><i className="fa fa-pencil" />
                                                                    </button>
                                                                    <button className="icon_btn __danger mx-2" type="button" onClick={() => handleDelete(item.id)}
                                                                    ><i className="fa fa-trash" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner sppiner={loading} />

        </>
    )
}

export default ProductKBMobile