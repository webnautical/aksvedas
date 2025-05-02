import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { textSlice, toastifyError, toastifySuccess } from '../../../utility/Utility';
import { Rating } from '@mui/material';
import ItemImg from '../../../components/admin/ItemImg';
import { SOMETHING_ERR } from '../../../utility/Constants';
import { Star, StarBorderOutlined } from "@mui/icons-material";
import { useFrontDataContext } from '../../../context/FrontContextProvider';

const maxLength = 1600;
const CustomerReviewList = () => {
    const { getProducts } = useFrontDataContext()
    const [isform, setIsForm] = useState(false)
    const [rowObj, setRowObj] = useState(null)
    const [reply, setReply] = useState('')

    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Product Name</span>,
            selector: row => <span className='text-capitalize'><>{row?.product?.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Images</span>,
            selector: row => <span className='text-capitalize fw-bold d-flex'><>
                {
                    row?.images?.split(',')?.map((img, i) => (
                        <ItemImg img={img} />
                    ))
                }
            </> </span>,
        },
        {
            name: <span className='text-capitalize'>Customer Name</span>,
            selector: row => <span className='text-capitalize'><>{row.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>star</span>,
            selector: row => <><Rating name="read-only" value={row.star} readOnly /></>,
        },
        {
            name: <span className='text-capitalize'>Review</span>,
            selector: row => <><span className='text-wrap'>{textSlice(row.review, 60)} </span></>,
        },
        {
            name: <span className='text-capitalize'>Reply</span>,
            selector: row => <><span className='text-wrap'>{textSlice(row.reply, 60)}</span></>,
        },
        {
            name: <span className='text-capitalize'>status</span>,
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={parseInt(row.status)} onClick={() => changeStatus(row)} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: <span className='text-capitalize'>Created At</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-capitalize'>Actions</span>,
            cell: row => (
                <>
                    <button type='button' onClick={() => handleClick('reply', row)} class="text-body border-0 p-0">Reply</button>
                    <button type='button' onClick={() => handleDelete(row)} class="icon_btn __danger mx-2"><i className='fa fa-trash'></i></button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const [listData, setListData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [loading, setLoading] = useState(false)
    const [reviewError, setReviewError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [productList, setProductList] = useState([])
    const [reviewVal, setReviewVal] = useState({
        name: "",
        customer_id: "",
        created_at: "",
        product_id: "",
        review: "",
        images: "",
    });

    useEffect(() => {
        getListFun()
        getProductListFunc()
    }, [])

    const getProductListFunc = async () => {
        const res = await getProducts()
        setProductList(res)
    }

    const getListFun = async () => {
        setLoading(true)
        const res = await APICALL('/v1/get-reviews/admin')
        if (res?.status) {
            setFilterData(res?.data)
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
        const res = await APICALL('/v1/submit-review', 'post', param);
        if (res.status) {
            getListFun()
            toastifySuccess(`Review set as ${data?.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleDelete = async (data) => {
        setLoading(true)
        const param = {
            'id': data?.id,
            'type': "delete"
        }
        const res = await APICALL('/v1/submit-review', 'post', param);
        if (res.status) {
            getListFun()
            toastifySuccess(`Review Deleted Succesfully !!`)
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleReply = async () => {
        const params = { id: rowObj?.id, reply: reply }
        setSubmitLoading(true)
        const res = await APICALL('/v1/reply', "post", params)
        if (res?.status) {
            getListFun()
            setSubmitLoading(false)
            toastifySuccess(res?.message)
            handleClick("back")
        } else {
            setListData([])
            setSubmitLoading(false)
        }
    }

    const [rating, setRating] = useState(1);
    const handleRatingClick = (value) => {
        setRating(value);
    };

    const isImage = (file) => {
        return file.type.startsWith("image/");
    };

    const isVideo = (file) => {
        return file.type.startsWith("video/");
    };

    const handleChange = (e) => {
        setReviewVal({
            ...reviewVal,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "review") {
            if (e.target.value.trim() === "") {
                setReviewError("Write something.");
            } else {
                setReviewError("");
            }
        }
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages([...selectedImages, ...files]);
    };

    const handleDeleteImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };
    const handleReview = async () => {
        try {
            if (reviewVal.product_id.trim() === "") {
                toastifyError("Select Product")
                return;
            } else if (reviewVal.name.trim() === "") {
                toastifyError("Enter Name")
                return;
            } else if (reviewVal.review.trim() === "") {
                toastifyError("Write Review")
                return;
            }

            setSubmitLoading(true);
            const formData = new FormData();
            formData.append("product_id", reviewVal.product_id);
            formData.append("review_by", "admin");
            formData.append("star", rating);
            formData.append("name", reviewVal?.name);
            // formData.append("customer_id", reviewVal?.customer_id);
            formData.append("created_at", reviewVal?.created_at);
            formData.append("review", reviewVal?.review);
            selectedImages?.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });
            const res = await APICALL("/v1/submit-review", "post", formData);
            if (res?.status) {
                setSubmitLoading(false);
                getListFun()
                handleClick("back")
            } else {
                toastifyError(SOMETHING_ERR);
                setSubmitLoading(false);
            }
        } catch (error) {
            toastifyError(SOMETHING_ERR);
            setSubmitLoading(false);
        }
    };
    const handleClick = (type, row) => {
        if (type === "reply") {
            setRowObj(row)
            setReply(row?.reply)
            setIsForm("reply")
        } else if (type === "add-review") {
            setIsForm("add-review")
        } else if (type === "back") {
            setRowObj(null)
            setIsForm(false)
            setReply("")
            setReviewVal({ ...reviewVal, name: "", review: "", product_id: "" });
            setRating(0);
            setSelectedImages([])
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="div d-flex justify-content-between align-items-center">
                        <h4 class="py-3 mb-2"><span class=" fw-light">Aksvedas /</span> Customer Reviews</h4>
                        <div>
                            <button class="btn btn-primary buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn me-2" type='button' onClick={() => handleClick('add-review')}><span>Add Review</span></button>
                        </div>
                    </div>
                    <div className="card">
                        {
                            isform === "reply" ?
                                <>
                                    <div className="row g-3 p-3 pb-4">
                                        <div className="col-sm-12">
                                            <strong>Customer Review/Question</strong>
                                            <hr />
                                            <p><strong></strong>{rowObj?.review}</p>
                                        </div>
                                        <div className="col-sm-12">
                                            <label htmlFor="">Reply</label>
                                            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={10} className='form-control mt-2'></textarea>
                                        </div>
                                        <div className="col-12 text-end">
                                            <button type='button' onClick={() => handleClick('back')} className="btn btn-primary mx-2">Cancel</button>
                                            {submitLoading ? (
                                                <>
                                                    <button className="btn btn-primary" type="button">
                                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                        <span class="sr-only">Loading...</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button type='button' onClick={() => handleReply()} className="btn btn-primary">Reply</button>
                                            )}
                                        </div>
                                    </div>
                                </>
                                :
                                isform === "add-review" ?
                                    <>
                                        <div className="row g-3 p-3 pb-4">
                                            <div className="contact-us-inner p-0">
                                                <h2>Leave a message</h2>
                                                <div className="row">
                                                    <div className="mb-3 col-md-4">
                                                        <label htmlFor="firstName" className="form-label"> Product </label>
                                                        <select onChange={handleChange} name="product_id" value={reviewVal?.product_id} className='form-control'>
                                                            <option value="">--SELECT PRODUCT--</option>
                                                            {productList?.map((item, i) => (
                                                                <option value={item?.id}>{item.name} || {"₹" + item.sale_price}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mb-3 col-md-4">
                                                        <label htmlFor="firstName" className="form-label"> Name* </label>
                                                        <input type="text" className="form-control" id="firstName" onChange={handleChange} name="name" value={reviewVal?.name} />
                                                    </div>
                                                    <div className="mb-3 col-md-4">
                                                        <label htmlFor="date" className="form-label"> Date </label>
                                                        <input type="date" className="form-control" id="date" onChange={handleChange} name="created_at" value={reviewVal?.created_at} />
                                                    </div>
                                                    <div className="mb-3 col-md-6">
                                                        <label className="form-label d-block">Rating</label>
                                                        {[...Array(5)].map((_, index) => {
                                                            const ratingValue = index + 1;
                                                            return (
                                                                <span key={index} onClick={() => handleRatingClick(ratingValue)} >
                                                                    {ratingValue <= rating ? (
                                                                        <Star sx={{ fontSize: 30, color: "#E0A11C" }} />
                                                                    ) : (
                                                                        <StarBorderOutlined sx={{ fontSize: 30, color: "#E0A11C" }} />
                                                                    )}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    
                                                    <div className="mb-3 col-sm-12">
                                                        <label className="form-label d-block">
                                                            Upload Image & Video
                                                        </label>
                                                        <div className="outuploadimg">
                                                            <div className="uploadimg-vdieoouter">
                                                                <input type="file" accept=".jpg,.jpeg,.png,.mp4,.mov" multiple onChange={handleImageChange} />
                                                                <i className="fa fa-camera"></i>
                                                            </div>

                                                            {selectedImages.map((file, index) => (
                                                                <div className="lis-timg-upload" key={index}>
                                                                    {isImage(file) && (
                                                                        <img src={URL.createObjectURL(file)} alt={`Uploaded file ${index}`} />
                                                                    )}
                                                                    {isVideo(file) && (
                                                                        <video width="100%" controls>
                                                                            <source src={URL.createObjectURL(file)} type={file.type} />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    )}
                                                                    <i className="fa fa-trash" onClick={() => handleDeleteImage(index)} ></i>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 col-sm-12">
                                                        <label htmlFor="message" className="form-label"> {" "} Your Message{" "} </label>
                                                        <textarea className="form-control" maxLength={1600} id="message" name="review" onChange={handleChange} value={reviewVal?.review}></textarea>
                                                        <span> {maxLength - reviewVal.review.length} characters  remaining </span>
                                                    </div>
                                                    <div className="mb-3 col-sm-12 text-end">
                                                        <button type='button' onClick={() => handleClick('back')} className="btn btn-primary mx-2">Cancel</button>
                                                        {submitLoading ? (
                                                            <>
                                                                <button className="btn btn-primary mx-2" type="button">
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                    <span class="sr-only">Loading...</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button className="btn btn-primary mx-2" type="button" onClick={() => handleReview()}> Submit </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="card-datatable table-responsive">
                                        <DataTable className='cs_table_inerr'
                                            columns={columns}
                                            data={filterData}
                                            highlightOnHover
                                            pagination
                                        />
                                    </div>
                        }
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default CustomerReviewList