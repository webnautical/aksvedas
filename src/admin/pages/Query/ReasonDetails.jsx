import React from 'react'
import { Link } from 'react-router-dom'
import { timeAgo } from '../../../utility/Date'
import { defaultUserIMG, imgBaseURL } from '../../../utility/Utility'
import { APICALL } from '../../../utility/api/api'

const ReasonDetails = ({ reasonDetails,setDetails,getListFun }) => {
    console.log(reasonDetails)
    const imagesArray = reasonDetails?.images ? reasonDetails?.images.split(',') : []

    const changeStatus = async () =>{
        try {
            const res = await APICALL('/v1/reason', 'post', { type: 'change-status', id :  reasonDetails?.id})
            if(res?.status){
                setDetails(null)
                getListFun()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                <div className="div d-flex justify-content-between align-items-center">
                    <h4 class="py-3 mb-2"><span class="fw-light">Aksvedas /</span> Help Query Details</h4>
                   <button className='btn btn-sm btn-primary' onClick={() => setDetails(null)}>Back</button>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Info - {timeAgo(reasonDetails?.created_at)}</h5>
                                    {
                                        reasonDetails?.status == "processing" ? 
                                        <button className='btn btn-sm btn-primary text-capitalize' onClick={changeStatus}> Mark as resolved</button>
                                        :
                                        <button className='btn btn-sm btn-success text-capitalize' style={{cursor: 'none !important'}}>{reasonDetails?.status}</button>
                                    }
                                </div>
                                <div className="card-body">
                                    <p className=" mb-1">Reason: {reasonDetails?.reason}</p>
                                    <p className=" mb-1">Message: {reasonDetails?.text}</p>

                                    <div className="row g-3 mt-2">
                                        {
                                            imagesArray?.map((item, i) => (
                                                <div className="col-md-4">
                                                    <img src={imgBaseURL() + item} alt="" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <>
                            <div className="col-12 col-lg-4">
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="card-title m-0">Customer details</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-start align-items-center mb-4">
                                            <div className="avatar me-2">
                                                <img src={defaultUserIMG} alt="Avatar" className="rounded-circle" />
                                            </div>
                                            <div className="d-flex flex-column">
                                                <Link to={`/admin/customer-details/${reasonDetails?.customer?.id}`} className="text-body text-nowrap">
                                                    <h6 className="mb-0">{reasonDetails?.customer?.name}</h6>
                                                </Link>
                                                <small className="">Customer ID: #{reasonDetails?.customer?.id}</small></div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6>Contact info</h6>
                                        </div>
                                        <p className=" mb-1">Email: {reasonDetails?.customer?.email}</p>
                                        <p className=" mb-0">Mobile: {reasonDetails?.customer?.phone}</p>
                                    </div>
                                </div>

                                {
                                    reasonDetails?.address &&
                                    <div className="card mb-4">
                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0 fw-bold">{reasonDetails?.address?.type}</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0">{reasonDetails?.address?.address}</p>
                                        </div>
                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0">State: {reasonDetails?.address?.state}</h6>
                                            <h6 className="card-title m-0">City: {reasonDetails?.address?.city}</h6>
                                        </div>

                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0 fw-bold">Contact Info</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0">{reasonDetails?.address?.phone}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </>


                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>



        </>
    )
}

export default ReasonDetails