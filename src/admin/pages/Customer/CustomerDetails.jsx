import React, { useEffect, useState } from 'react'
import { defaultUserIMG } from '../../../utility/Utility'
import { useParams } from 'react-router'
import { getDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { timeAgo } from '../../../utility/Date'

const CustomerDetails = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [customerDetails, setCustomerDetails] = useState({})
    const [subPage, setSubPage] = useState(null)

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
            console.log(res)
            if (res.status) {
                setLoading(false)
                setCustomerDetails(res?.data)
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

    return (
        <>
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-between mb-4 text-center text-sm-start gap-2">
                        <div className="mb-2 mb-sm-0">
                            <h4 className="mb-1">
                                Customer ID #{id}
                            </h4>
                            <p className="mb-0">
                                {timeAgo(customerDetails?.created_at)}
                            </p>
                        </div>
                        <button type="button" className="btn btn-label-danger delete-customer">Delete Customer</button>
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
                                    <div className="d-flex justify-content-around flex-wrap my-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar">
                                                <div className="avatar-initial rounded bg-label-primary">
                                                    <i className="ti ti-shopping-cart ti-md" />
                                                </div>
                                            </div>
                                            <div className="gap-0 d-flex flex-column">
                                                <p className="mb-0 fw-medium">184</p>
                                                <small>Orders</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar">
                                                <div className="avatar-initial rounded bg-label-primary">
                                                    <i className="ti ti-currency-dollar ti-md" />
                                                </div>
                                            </div>
                                            <div className="gap-0 d-flex flex-column">
                                                <p className="mb-0 fw-medium">$12,378</p>
                                                <small>Spent</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-container">
                                        <small className="d-block pt-4 border-top fw-normal text-uppercase text-muted my-3">DETAILS</small>
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
                                                {customerDetails.status == 1 ? <><span className="badge bg-label-success">Active</span></> : <><span className="badge bg-label-danger">Deactive</span></>}
                                            </li>
                                            <li className="mb-3">
                                                <span className="fw-medium me-2">Contact:</span>
                                                <span>{checkEmptyElm(customerDetails?.phone)}</span>
                                            </li>
                                        </ul>
                                        <div className="d-flex justify-content-center">
                                            <a href="javascript:;" className="btn btn-primary me-3" data-bs-target="#editUser" data-bs-toggle="modal">Edit Details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
                            <ul className="nav nav-pills flex-column flex-md-row mb-3">
                                <li className="nav-item"><button onClick={() => setTabsPage(null)} className={`nav-link ${subPage == null ? 'active' : ''}`}><i className="ti ti-user me-1" />Overview</button></li>
                                <li className="nav-item"><button onClick={() => setTabsPage("Security")} className={`nav-link ${subPage == "Security" ? 'active' : ''}`}><i className="ti ti-lock me-1" />Security</button></li>
                                <li className="nav-item"><button onClick={() => setTabsPage("Address")} className={`nav-link ${subPage == "Address" ? 'active' : ''}`}><i className="ti ti-file-invoice me-1" />Address &amp; Billing</button></li>
                            </ul>

                            {
                                subPage == null ?
                                    <>
                                        <div className="row text-nowrap">
                                            <div className="col-md-6 mb-4">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-primary">
                                                                    <i className="ti ti-currency-dollar ti-md" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3">Account Balance</h4>
                                                            <div className="d-flex align-items-baseline mb-1 gap-1">
                                                                <h4 className="text-primary mb-0">$2345</h4>
                                                                <p className="mb-0"> Credit Left</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-success">
                                                                    <i className="ti ti-gift ti-md" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3">Loyalty Program</h4>
                                                            <span className="badge bg-label-success mb-2">Platinum member</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="card-icon mb-3">
                                                            <div className="avatar">
                                                                <div className="avatar-initial rounded bg-label-warning">
                                                                    <i className="ti ti-star ti-md" />
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
                                                                    <i className="ti ti-discount ti-md" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-info">
                                                            <h4 className="card-title mb-3">Coupons</h4>
                                                            <div className="d-flex align-items-baseline mb-1 gap-1">
                                                                <h4 className="text-info mb-0">21</h4>
                                                                <p className="mb-0">Coupons you win</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    subPage == 'Security' ?
                                        <>
                                            <div className="card mb-4">
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
                                            </div>


                                        </>
                                        :
                                        subPage == 'Address' ?
                                            <>

                                                <div className="card card-action mb-4">
                                                    <div className="card-header align-items-center py-4">
                                                        <h5 className="card-action-title mb-0">Address Book</h5>
                                                        <div className="card-action-element">
                                                            <button className="btn btn-label-primary waves-effect" type="button" data-bs-toggle="modal" data-bs-target="#addNewAddress">Add new address</button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="accordion accordion-flush accordion-arrow-left" id="ecommerceBillingAccordionAddress">
                                                            <div className="accordion-item border-bottom">
                                                                <div className="accordion-header d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap" id="headingHome">
                                                                    <a className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#ecommerceBillingAddressHome" aria-expanded="false" aria-controls="headingHome" role="button">
                                                                        <span>
                                                                            <span className="d-flex gap-2 align-items-baseline">
                                                                                <span className="h6 mb-1">Home</span>
                                                                                <span className="badge bg-label-success">Default Address</span>
                                                                            </span>
                                                                            <span className="mb-0 text-muted">23 Shatinon Mekalan</span>
                                                                        </span>
                                                                    </a>
                                                                    <div className="d-flex gap-3 p-4 p-sm-0 pt-0 ms-1 ms-sm-0">
                                                                        <a href="javascript:void(0);"><i className="ti ti-pencil text-secondary ti-sm" /></a>
                                                                        <a href="javascript:void(0);"><i className="ti ti-trash text-secondary ti-sm" /></a>
                                                                        <button className="btn p-0" data-bs-toggle="dropdown" aria-expanded="false" role="button"><i className="ti ti-dots-vertical text-secondary ti-sm mt-1" /></button>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a className="dropdown-item" href="javascript:void(0);">Set as default address</a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div id="ecommerceBillingAddressHome" className="accordion-collapse collapse" data-bs-parent="#ecommerceBillingAccordionAddress" style={{}}>
                                                                    <div className="accordion-body ps-4 ms-2">
                                                                        <h6 className="mb-1">Violet Mendoza</h6>
                                                                        <p className="mb-1">23 Shatinon Mekalan,</p>
                                                                        <p className="mb-1">Melbourne, VIC 3000,</p>
                                                                        <p className="mb-1">LondonUK</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item border-bottom border-top-0">
                                                                <div className="accordion-header d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap" id="headingOffice">
                                                                    <a className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#ecommerceBillingAddressOffice" aria-expanded="false" aria-controls="headingOffice" role="button">
                                                                        <span className="d-flex flex-column">
                                                                            <span className="h6 mb-0">Office</span>
                                                                            <span className="mb-0 text-muted">45 Roker Terrace</span>
                                                                        </span>
                                                                    </a>
                                                                    <div className="d-flex gap-3 p-4 p-sm-0 pt-0 ms-1 ms-sm-0">
                                                                        <a href="javascript:void(0);"><i className="ti ti-pencil text-secondary ti-sm" /></a>
                                                                        <a href="javascript:void(0);"><i className="ti ti-trash text-secondary ti-sm" /></a>
                                                                        <button className="btn p-0" data-bs-toggle="dropdown" aria-expanded="false" role="button"><i className="ti ti-dots-vertical text-secondary ti-sm mt-1" /></button>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a className="dropdown-item" href="javascript:void(0);">Set as default address</a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div id="ecommerceBillingAddressOffice" className="accordion-collapse collapse" aria-labelledby="headingOffice" data-bs-parent="#ecommerceBillingAccordionAddress" style={{}}>
                                                                    <div className="accordion-body ps-4 ms-2">
                                                                        <h6 className="mb-1">Violet Mendoza</h6>
                                                                        <p className="mb-1">45 Roker Terrace,</p>
                                                                        <p className="mb-1">Latheronwheel,</p>
                                                                        <p className="mb-1">KW5 8NW</p>
                                                                        <p className="mb-1">LondonUK</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion-item border-top-0">
                                                                <div className="accordion-header d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap" id="headingFamily">
                                                                    <a className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#ecommerceBillingAddressFamily" aria-expanded="false" aria-controls="headingFamily" role="button">
                                                                        <span className="d-flex flex-column">
                                                                            <span className="h6 mb-0">Family</span>
                                                                            <span className="mb-0 text-muted">512 Water Plant</span>
                                                                        </span>
                                                                    </a>
                                                                    <div className="d-flex gap-3 p-4 p-sm-0 pt-0 ms-1 ms-sm-0">
                                                                        <a href="javascript:void(0);"><i className="ti ti-pencil text-secondary ti-sm" /></a>
                                                                        <a href="javascript:void(0);"><i className="ti ti-trash text-secondary ti-sm" /></a>
                                                                        <button className="btn p-0" data-bs-toggle="dropdown" aria-expanded="false" role="button"><i className="ti ti-dots-vertical text-secondary ti-sm mt-1" /></button>
                                                                        <ul className="dropdown-menu" style={{}}>
                                                                            <li><a className="dropdown-item" href="javascript:void(0);">Set as default address</a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div id="ecommerceBillingAddressFamily" className="accordion-collapse collapse" aria-labelledby="headingFamily" data-bs-parent="#ecommerceBillingAccordionAddress" style={{}}>
                                                                    <div className="accordion-body ps-4 ms-2">
                                                                        <h6 className="mb-1">Violet Mendoza</h6>
                                                                        <p className="mb-1">512 Water Plant,</p>
                                                                        <p className="mb-1">Melbourne, NY 10036,</p>
                                                                        <p className="mb-1">New York,</p>
                                                                        <p className="mb-1">United States</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </>
                                            :
                                            <></>
                            }

                        </div>
                    </div>


                    <div className="modal fade" id="editUser" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-simple modal-edit-user">
                            <div className="modal-content p-3 p-md-5">
                                <div className="modal-body">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    <div className="text-center mb-4">
                                        <h3 className="mb-2">Edit User Information</h3>
                                        <p className="text-muted">Updating user details will receive a privacy audit.</p>
                                    </div>
                                    <form id="editUserForm" className="row g-3" onsubmit="return false">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserFirstName">First Name</label>
                                            <input type="text" id="modalEditUserFirstName" name="modalEditUserFirstName" className="form-control" placeholder="John" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserLastName">Last Name</label>
                                            <input type="text" id="modalEditUserLastName" name="modalEditUserLastName" className="form-control" placeholder="Doe" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" htmlFor="modalEditUserName">Username</label>
                                            <input type="text" id="modalEditUserName" name="modalEditUserName" className="form-control" placeholder="john.doe.007" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserEmail">Email</label>
                                            <input type="text" id="modalEditUserEmail" name="modalEditUserEmail" className="form-control" placeholder="example@domain.com" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserStatus">Status</label>
                                            <select id="modalEditUserStatus" name="modalEditUserStatus" className="select2 form-select" aria-label="Default select example">
                                                <option selected>Status</option>
                                                <option value={1}>Active</option>
                                                <option value={2}>Inactive</option>
                                                <option value={3}>Suspended</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditTaxID">Tax ID</label>
                                            <input type="text" id="modalEditTaxID" name="modalEditTaxID" className="form-control modal-edit-tax-id" placeholder="123 456 7890" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserPhone">Phone Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text">US (+1)</span>
                                                <input type="text" id="modalEditUserPhone" name="modalEditUserPhone" className="form-control phone-number-mask" placeholder="202 555 0111" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserLanguage">Language</label>
                                            <select id="modalEditUserLanguage" name="modalEditUserLanguage" className="select2 form-select" multiple>
                                                <option value>Select</option>
                                                <option value="english" selected>English</option>
                                                <option value="spanish">Spanish</option>
                                                <option value="french">French</option>
                                                <option value="german">German</option>
                                                <option value="dutch">Dutch</option>
                                                <option value="hebrew">Hebrew</option>
                                                <option value="sanskrit">Sanskrit</option>
                                                <option value="hindi">Hindi</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="modalEditUserCountry">Country</label>
                                            <select id="modalEditUserCountry" name="modalEditUserCountry" className="select2 form-select" data-allow-clear="true">
                                                <option value>Select</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Canada">Canada</option>
                                                <option value="China">China</option>
                                                <option value="France">France</option>
                                                <option value="Germany">Germany</option>
                                                <option value="India">India</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Israel">Israel</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Korea">Korea, Republic of</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="Philippines">Philippines</option>
                                                <option value="Russia">Russian Federation</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="switch">
                                                <input type="checkbox" className="switch-input" />
                                                <span className="switch-toggle-slider">
                                                    <span className="switch-on" />
                                                    <span className="switch-off" />
                                                </span>
                                                <span className="switch-label">Use as a billing address?</span>
                                            </label>
                                        </div>
                                        <div className="col-12 text-center">
                                            <button type="submit" className="btn btn-primary me-sm-3 me-1">Submit</button>
                                            <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="upgradePlanModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-simple modal-upgrade-plan">
                            <div className="modal-content p-3 p-md-5">
                                <div className="modal-body">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    <div className="text-center mb-4">
                                        <h3 className="mb-2">Upgrade Plan</h3>
                                        <p>Choose the best plan for user.</p>
                                    </div>
                                    <form id="upgradePlanForm" className="row g-3" onsubmit="return false">
                                        <div className="col-sm-8">
                                            <label className="form-label" htmlFor="choosePlan">Choose Plan</label>
                                            <select id="choosePlan" name="choosePlan" className="form-select" aria-label="Choose Plan">
                                                <option selected>Choose Plan</option>
                                                <option value="standard">Standard - $99/month</option>
                                                <option value="exclusive">Exclusive - $249/month</option>
                                                <option value="Enterprise">Enterprise - $499/month</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-4 d-flex align-items-end">
                                            <button type="submit" className="btn btn-primary">Upgrade</button>
                                        </div>
                                    </form>
                                </div>
                                <hr className="mx-md-n5 mx-n3" />
                                <div className="modal-body">
                                    <p className="mb-0">User current plan is standard plan</p>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="d-flex justify-content-center me-2">
                                            <sup className="h6 pricing-currency pt-1 mt-3 mb-0 me-1 text-primary">$</sup>
                                            <h1 className="display-5 mb-0 text-primary">99</h1>
                                            <sub className="h5 pricing-duration mt-auto mb-2 text-muted">/month</sub>
                                        </div>
                                        <button className="btn btn-label-danger cancel-subscription mt-3">Cancel Subscription</button>
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

export default CustomerDetails