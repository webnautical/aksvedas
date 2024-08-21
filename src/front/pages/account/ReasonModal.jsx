import React from 'react'
import { useState } from 'react';
import { APICALL } from '../../../utility/api/api';
import { authCustomer, toastifyError, toastifySuccess } from '../../../utility/Utility';
import SpinnerBTN from '../../../components/SpinnerBTN';

const ReasonModal = ({order_id}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState({
        'customer_id': authCustomer()?.id,
        'order_id': order_id,
        'reason': '',
        'text': ''
    })
    const handlechange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const submitReason = async () => {
        setLoading(true)
        try {
            if(value.reason === '' || value.text === ''){
                toastifyError('Oops! Please fill out all fields before submitting.')
                return false
            }
            const res = await APICALL('/v1/reason', 'post', value)
            if (res?.status) {
                toastifySuccess(res?.message)
                handleCancel()
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleCancel =() =>{
        setOpen(false)
        setValue({...value, 'reason' : '', 'text' : ''})
    }

    return (
        <>
            <button className='btn btn-primary' onClick={() => setOpen(true)}>Need Help ?</button>

            {
                open &&
                <div class="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block" }}>
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header p-0">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                            </div>
                            <div class="modal-body">
                                    <h5>Raise an issue</h5>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <select
                                            name="reason"
                                            id="reason"
                                            className='form-control'
                                            value={value.reason}
                                            onChange={handlechange}
                                        >
                                            <option value="">Select Reason</option>
                                            <option value="Amount deducted but order not placed">Amount deducted but order not placed.</option>
                                            <option value="my payment is shown as pending">My payment is shown as pending.</option>
                                            <option value="delivery person did not try to deliver my order">Delivery person did not try to deliver my order.</option>
                                            <option value="my order is delayed">My order is delayed.</option>
                                            <option value="order is not delivered but marked as delivered">Order is not delivered but marked as delivered.</option>
                                            <option value="my order was cancelled">My order was cancelled.</option>
                                            <option value="i want to modify/cancel my order">I want to modify/cancel my order.</option>
                                            <option value="i received damaged/incorrect product">I received damaged/incorrect product.</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <textarea type="text" className='form-control'
                                            name='text'
                                            value={value.text}
                                            onChange={handlechange}
                                            placeholder='Write a query.'
                                        />
                                    </div>
                                    <div className="col-12 text-end">
                                        <button className='btn btn-primary mx-2' onClick={() => handleCancel()}>Cancel</button>
                                        {
                                            loading ? <button className='btn btn-primary' type="button" disabled>
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button> :
                                                <button type='button' className='btn btn-primary' onClick={submitReason}>Submit</button>
                                        }
                                    </div>
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