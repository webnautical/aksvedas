import React, { useEffect, useState } from 'react'
import { defaultUserIMG } from '../../../utility/Utility'
import { useParams } from 'react-router'
import { APICALL, getDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { timeAgo } from '../../../utility/Date'
import { Link } from 'react-router-dom'

const CustomerDetails = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [customerDetails, setCustomerDetails] = useState({})
    const [subPage, setSubPage] = useState(null)

    const [editLoyalty, setEditLoyalty] = useState(false)
    const [loyaltyVal, setLoyaltyVal] = useState(0)
    useEffect(() => {
        if (id) {
            getCustomerDetails()
        }
    }, [id])

    const setTabsPage = (page) => {
        setSubPage(page)
    }

    const getCustomerDetails = async () => {
        setLoading(true)
        try {
            const res = await getDataAPI(`/v1/customer-details/${id}`)
            if (res.status) {
                setLoading(false)
                setCustomerDetails(res?.data?.data)
                setLoyaltyVal(res?.data?.data?.loyalty)
            } else {
                setLoading(false)
                setCustomerDetails({})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkEmptyElm = (elm) => {
        if (elm) {
            return elm
        } else {
            return "---"
        }
    }

    const handleUpdate = async () =>{
        setLoading(true)
        try {
            const params = {id: id, loyalty: loyaltyVal}
            const res = await APICALL(`/v1/update-customer-details`, 'post', params)
            if (res.status) {
                setLoading(false)
                setEditLoyalty(false)
                getCustomerDetails()
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }


    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-between mb-4 text-center text-sm-start gap-2">
                        <div className="mb-2 mb-sm-0">
                            <h4 className="mb-1"> Customer ID #{id}</h4>
                            <p className="mb-0">{timeAgo(customerDetails?.created_at)}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="customer-avatar-section">
                                        <div className="d-flex align-items-center flex-column">
                                            <img className="img-fluid rounded my-3" src={defaultUserIMG} height={110} width={110} alt="User avatar" />
                                            <div className="customer-info text-center">
                                                <h4 className="mb-1">{checkEmptyElm(customerDetails?.name)}</h4>
                                                <small>Customer ID #{customerDetails?.id}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-container">
                                        <small className="d-block pt-4 border-top fw-normal text-uppercase my-3">DETAILS</small>
                                        <ul className="list-unstyled">
                                            <li className="mb-3">
                                                <span className="fw-medium me-2">Username:</span>
                                                <span>{checkEmptyElm(customerDetails?.name)}</span>
                                            </li>
                                            <li className="mb-3">
                                                <span className="fw-medium me-2">Email:</span>
                                                <span>{checkEmptyElm(customerDetails?.email)}</span>
                                            </li>
                                            <li className="mb-3">
                                                <span className="fw-medium me-2">Status:</span>
                                                {customerDetails.status == 1 ? <><span className="btn btn-success btn-sm">Active</span></> : <><span className="btn btn-danger btn-sm">Deactive</span></>}
                                            </li>
                                            <li className="mb-3">
                                                <span className="fw-medium me-2">Contact:</span>
                                                <span>{checkEmptyElm(customerDetails?.phone)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
                            <ul className="nav nav-pills flex-column flex-md-row mb-3">
                                <li className="nav-item"><button onClick={() => setTabsPage(null)} className={`nav-link ${subPage == null ? 'active' : ''}`}><i className="ti ti-user me-1" />Overview</button></li>
                                {/* <li className="nav-item"><button onClick={() => setTabsPage("Security")} className={`nav-link ${subPage == "Security" ? 'active' : ''}`}><i className="ti ti-lock me-1" />Security</button></li> */}
                                <li className="nav-item"><button onClick={() => setTabsPage("Address")} className={`nav-link ${subPage == "Address" ? 'active' : ''}`}><i className="ti ti-file-invoice me-1" />Address &amp; Billing</button></li>
                            </ul>

                            {
                                subPage == null ?
                                    <>
                                        <div className="row text-nowrap">

                                            <div className="col-md-6 mb-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-warning">
                                                                    <i class="fa-regular fa-heart"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3">Wishlist</h4>
                                                            <div className="d-flex align-items-baseline mb-1 gap-1">
                                                                <h4 className="text-warning mb-0">{customerDetails?.wishlists?.length}</h4>
                                                                <p className="mb-0">Items in wishlist</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-info">
                                                                    <i class="fa-solid fa-cart-shopping"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3">Cart</h4>
                                                            <div className="d-flex align-items-baseline mb-1 gap-1">
                                                                <h4 className="text-info mb-0">{customerDetails?.cart?.length}</h4>
                                                                <p className="mb-0">Item in cart</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-4">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3 d-flex justify-content-between">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-success">
                                                                    <i className="ti ti-gift ti-md" />
                                                                </div>
                                                            </div>
                                                            {
                                                                editLoyalty ?
                                                                    <button className='icon_btn __danger mx-2' onClick={() => setEditLoyalty(false)}><i className='fa fa-times'></i></button>
                                                                    :
                                                                    <button className='icon_btn __warning mx-2' onClick={() => setEditLoyalty(true)}><i className='fa fa-pencil'></i></button>
                                                            }
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3"> AksCoins</h4>
                                                            {
                                                                editLoyalty ?
                                                                    <>
                                                                        <div className="form d-flex pb-4">
                                                                            <input type="text" onChange={(e) => setLoyaltyVal(e.target.value)} value={loyaltyVal} className='form-control' />
                                                                            <button className='btn btn-primary ms-2' onClick={()=>handleUpdate()}>Save</button>
                                                                        </div>
                                                                    </>
                                                                    :

                                                                    <h1 className="loyalty_text">₹{customerDetails?.loyalty}</h1>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    subPage == 'Security' ?
                                        <>
                                            {/* <div className="card mb-4">
                                                <h5 className="card-header">Change Password</h5>
                                                <div className="card-body">
                                                    <form id="formChangePassword" method="GET" onsubmit="return false" className="fv-plugins-bootstrap5 fv-plugins-framework" noValidate="novalidate">
                                                        <div className="alert alert-warning" role="alert">
                                                            <h6 className="alert-heading mb-1">Ensure that these requirements are met</h6>
                                                            <span>Minimum 8 characters long, uppercase &amp; symbol</span>
                                                        </div>
                                                        <div className="row">
                                                            <div className="mb-3 col-12 col-sm-6 form-password-toggle fv-plugins-icon-container">
                                                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                                                <div className="input-group input-group-merge has-validation">
                                                                    <input className="form-control" type="password" id="newPassword" name="newPassword" placeholder="············" />
                                                                    <span className="input-group-text cursor-pointer"><i className="ti ti-eye ti-xs" /></span>
                                                                </div><div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                                                            </div>
                                                            <div className="mb-3 col-12 col-sm-6 form-password-toggle fv-plugins-icon-container">
                                                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                                                <div className="input-group input-group-merge has-validation">
                                                                    <input className="form-control" type="password" name="confirmPassword" id="confirmPassword" placeholder="············" />
                                                                    <span className="input-group-text cursor-pointer"><i className="ti ti-eye ti-xs" /></span>
                                                                </div><div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                                                            </div>
                                                            <div>
                                                                <button type="submit" className="btn btn-primary me-2 waves-effect waves-light">Change Password</button>
                                                            </div>
                                                        </div>
                                                        <input type="hidden" /></form>
                                                </div>
                                            </div>

                                            <div className="card mb-4">
                                                <h5 className="card-header">Two-steps verification</h5>
                                                <div className="card-body">
                                                    <p className="mb-0">Keep your account secure with authentication step.</p>
                                                    <h6 className="mt-4">SMS</h6>
                                                    <div className="d-flex justify-content-between border-bottom mb-4 pb-2">
                                                        <span>+1(968) 945-8832</span>
                                                        <div className="action-icons">
                                                            <a href="javascript:;" className="text-body me-1" data-bs-target="#enableOTP" data-bs-toggle="modal"><i className="ti ti-edit" /></a>
                                                            <a href="javascript:;" className="text-body"><i className="ti ti-trash" /></a>
                                                        </div>
                                                    </div>
                                                    <p className="mb-0">Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.
                                                        <a href="javascript:void(0);" className="text-body">Learn more.</a>
                                                    </p>
                                                </div>
                                            </div> */}

                                        </>
                                        :
                                        subPage == 'Address' ?
                                            <>

                                                <div className="accordion accordion-flush accordion-arrow-left" id="ecommerceBillingAccordionAddress">

                                                    {
                                                        customerDetails?.address?.length > 0 ?
                                                            customerDetails?.address.map((item, i) => (
                                                                <div className="accordion-item border-bottom">
                                                                    <div className="accordion-header d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap" id="headingHome">
                                                                        <Link className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#accordianDropDown${item.id}`} aria-expanded="false" aria-controls="headingHome" role="button">
                                                                            <span>
                                                                                <span className="d-flex gap-2 align-items-baseline">
                                                                                    <span className="h6 mb-1">Address {i + 1}</span>
                                                                                    {/* <span className="badge bg-label-success">Default Address</span> */}
                                                                                </span>
                                                                                <span className="mb-0">{item?.phone}</span>
                                                                            </span>
                                                                        </Link>
                                                                        <div className="d-flex gap-3 p-4 p-sm-0 pt-0 ms-1 ms-sm-0">
                                                                            {/* <a href="javascript:void(0);"><i className="ti ti-pencil text-secondary ti-sm" /></a>
                                                                        <a href="javascript:void(0);"><i className="ti ti-trash text-secondary ti-sm" /></a> */}
                                                                            <button className="btn p-0" data-bs-toggle="dropdown" aria-expanded="false" role="button"><i className="ti ti-dots-vertical text-secondary ti-sm mt-1" /></button>

                                                                            <ul className="dropdown-menu">
                                                                                <li><Link className="dropdown-item">Set as default address</Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div id={`accordianDropDown${item.id}`} className="accordion-collapse collapse" data-bs-parent="#ecommerceBillingAccordionAddress" style={{}}>
                                                                        <div className="accordion-body ps-4 ms-2">
                                                                            {item.address}
                                                                            <div className='row mt-3'>
                                                                                <div className="col-md-6">
                                                                                    <p className='fw-bold'>State : {item.state}</p>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <p className='fw-bold'>City : {item.city}</p>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <p className='fw-bold'>Zip Code : {item.zip}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                            :
                                                            <>Address not added</>
                                                    }
                                                </div>

                                            </>
                                            :
                                            <></>
                            }

                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>

            <Spinner sppiner={loading} />


        </>
    )
}

export default CustomerDetails