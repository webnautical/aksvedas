import React, { useEffect, useState } from 'react'
import HTMLContent from '../../../components/HTMLContent';
import Spinner from '../../../components/admin/Spinner';
import CKEditorCom from '../../../components/CKEditorCom';
import { APICALL } from '../../../utility/api/api';
import { Rating, Typography } from '@mui/material';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';
import { SOMETHING_ERR } from '../../../utility/Constants';

const FixedReviews = () => {
    const [loading, setLoading] = useState();
    const [reviewList, setReviewList] = useState([]);
    const [updData, setUpdData] = useState(null);
    const [page, setPage] = useState(false);
    useEffect(() => {
        getDataFun();
    }, []);

    const getDataFun = async () => {
        try {
            setLoading(true);
            const res = await APICALL("get-admin-review");
            if (res?.status) {
                setReviewList(res?.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [value, setValue] = useState({
        name: "",
        review: "",
        star: 3,
    });

    useEffect(() => {
        if (updData?.id) {
            setValue({
                ...value,
                id: updData.id,
                name: updData.name,
                review: updData.review,
                star: updData.star,
            });
        } else {
            setValue({
                ...value,
                name: "",
                review: "",
                star: 3,
            });
        }
    }, [updData]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });

    };
    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["review"]: value };
        });
    };

    const handleReview = async () => {
        if(value.name === "" && value.review === ""){
            toastifyError("Name and Review are required !!")
            return false
        }
        setLoading(true)
        try {
            const res = await APICALL('/submit-fixed-review', 'post', value);
            if (res?.status) {
                setPage(false)
                toastifySuccess("Review Save Changes !!")
                getDataFun()
                setValue({ ...value, 'name': '', 'review': '', 'star': '', 'id': '' })
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
                        <span class="fw-light">Aksvedas /</span>Homepage Content
                    </h4>
                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-12 col-lg-12">
                                        <h5 className="d-flex justify-content-between">
                                            {" "}
                                            Reviews
                                            <button
                                                className="icon_btn __warning mx-2"
                                                type="button"
                                                onClick={() => setPage(true)}
                                            >
                                                <i className="fa fa-plus" />
                                            </button>
                                        </h5>
                                        <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">
                                            {page ? (
                                                <div className="upd-box">
                                                    <div className="row">
                                                        <div className="col-12 col-md-6">
                                                            <label className="form-label">Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={handleChange}
                                                                name="name"
                                                                value={value.name}
                                                                placeholder="Name"
                                                            />
                                                            <span className="errMsg">{errors.name}</span>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Typography component="legend">Controlled</Typography>
                                                            <Rating
                                                                name="simple-controlled"
                                                                value={value.star}
                                                                onChange={(event, newValue) => {
                                                                    setValue({ ...value, 'star': newValue });
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="col-12 col-md-12 my-4">
                                                            <CKEditorCom
                                                                ckValue={value?.review}
                                                                handleEditorChange={handleEditorChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="btn-box mt-2 text-end">
                                                        <button type="button" className="btn btn-primary me-sm-3 me-1"
                                                            onClick={() => {
                                                                setPage(false);
                                                                setValue({ ...value, 'name': '', 'review': '', 'star': '', 'id': '' });
                                                            }}
                                                        > Cancel </button>
                                                        <button type="button" className="btn btn-primary" onClick={() => handleReview()}>Update</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="row">
                                                        {
                                                            reviewList?.map((item, i) => (
                                                                <div className="col-md-4">
                                                                    <div className="section_images">
                                                                        <div className='d-flex justify-content-between'>
                                                                            <h4 className='mb-0 pb-0'>{item?.name}</h4>
                                                                            <button className="icon_btn __warning mx-2" type="button" onClick={() => { setPage(true); setUpdData(item) }}>
                                                                                <i className="fa fa-pencil" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="fs-15 rating_box">
                                                                            <Rating name="read-only" value={item?.star} readOnly />
                                                                        </div>
                                                                        <HTMLContent data={item?.review} />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )}
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

export default FixedReviews