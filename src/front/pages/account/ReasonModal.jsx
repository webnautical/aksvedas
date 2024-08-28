import React from 'react'
import { useState } from 'react';
import { APICALL } from '../../../utility/api/api';
import { authCustomer, toastifyError, toastifySuccess } from '../../../utility/Utility';
import supportpic from '../../../assets/img/support.png'

const ReasonModal = ({ order_id }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);

    const [value, setValue] = useState({
        'customer_id': authCustomer()?.id,
        'reason': '',
        'text': ''
    })
    const handlechange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const submitReason = async () => {
        setLoading(true)
        try {
            if (value.reason === '' || value.text === '') {
                toastifyError('Oops! Please fill out all fields before submitting.')
                return false
            }
            const formData = new FormData();
            formData.append("text", value.text);
            formData.append("reason", value?.reason);
            formData.append("customer_id", value?.customer_id);
            if(order_id){
                formData.append("order_id", order_id);
            }
            selectedImages?.forEach((file, index) => {
              formData.append(`images[${index}]`, file);
            });
            const res = await APICALL('/v1/reason', 'post', formData)
            if (res?.status) {
                toastifySuccess(res?.message)
                handleCancel()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setOpen(false)
        setValue({ ...value, 'reason': '', 'text': '', })
        setSelectedImages([])
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); 
        const maxFileSize = 7 * 1024 * 1024; 
        const maxFiles = 4; 
        const validFiles = files.filter(file => file.size <= maxFileSize);
        if (validFiles.length < files.length) {
            toastifyError("Some files were ignored because they exceed the size limit of 7MB.");
        }
        const newSelectedImages = [...selectedImages, ...validFiles];
        if (newSelectedImages.length > maxFiles) {
            toastifyError(`You can only select a maximum of ${maxFiles} images.`);
            setSelectedImages(newSelectedImages.slice(0, maxFiles));
        } else {
            setSelectedImages(newSelectedImages);
        }
    };

    const handleDeleteImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    return (
        <>
            <div className={order_id ? "support_btn" : "footer_support_btn"}> <button className='btn btn-primary' onClick={() => setOpen(true)}>Need Help ?</button></div>

            {
                open &&
                <div class="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block" }}>
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header p-0">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                            </div>
                            <div class="modal-body support_pop">
                                <h5 className='mt-5 mb-0 text-center'>Contact Us</h5>
                                <span className='text-center d-block mb-4'>Your satisfaction is our top priority</span>
                                <div className="row g-3">
                                    <div className="col-12 mb-2">
                                        <div className='my_select'>
                                            <label>Reason To Contact</label>
                                            <select
                                                name="reason"
                                                id="reason"
                                                className=' form-control'
                                                value={value.reason}
                                                onChange={handlechange}
                                            >
                                                <option value="">Select a Reason</option>
                                                <option value="Amount deducted but order not placed">Amount deducted but order not placed.</option>
                                                <option value="my payment is shown as pending">My payment is shown as pending.</option>
                                                <option value="delivery person did not try to deliver my order">Delivery person did not try to deliver my order.</option>
                                                <option value="my order is delayed">My order is delayed.</option>
                                                <option value="order is not delivered but marked as delivered">Order is not delivered but marked as delivered.</option>
                                                <option value="my order was cancelled">My order was cancelled.</option>
                                                <option value="i want to modify/cancel my order">I want to modify/cancel my order.</option>
                                                <option value="i received damaged/incorrect product">I received damaged/incorrect product.</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label>Message</label>
                                        <textarea type="text" style={{ height: '150px' }} className='form-control'
                                            name='text'
                                            value={value.text}
                                            onChange={handlechange}
                                            placeholder='Write a query.'
                                        />
                                    </div>

                                    <div className="col-12">
                                        <div className="outuploadimg">
                                            <div className="uploadimg-vdieoouter">
                                                <input type="file" accept=".jpg,.jpeg,.png" multiple onChange={handleImageChange} />
                                                <i className="fa fa-camera"></i>
                                            </div>

                                            {selectedImages.map((file, index) => (
                                                <div className="lis-timg-upload" key={index}>
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Uploaded file ${index}`}
                                                    />
                                                    <i className="fa fa-trash" onClick={() => handleDeleteImage(index)}></i>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 text-end support_btn">
                                        {
                                            loading ? <button className='btn btn-primary' type="button" disabled>
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button> :
                                                <button type='button' className='btn btn-primary' onClick={submitReason}>Submit</button>
                                        }
                                    </div>
                                </div>

                                <div className='support_img'>
                                    <img src={supportpic} alt='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ReasonModal