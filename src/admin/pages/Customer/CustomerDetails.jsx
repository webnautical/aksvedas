import React, { useEffect, useState } from 'react'
import { authCustomer, defaultUserIMG, toastifyError, toastifySuccess } from '../../../utility/Utility'
import { useParams } from 'react-router'
import { APICALL, getDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { timeAgo } from '../../../utility/Date'
import { Link } from 'react-router-dom'
import { SERVER_ERR } from '../../../utility/Constants'

const CustomerDetails = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [customerDetails, setCustomerDetails] = useState({})
    const [subPage, setSubPage] = useState(null)

    const [isEdit, setIsEdit] = useState(false)

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

    const [formValue, setFormValue] = useState({
        'name': customerDetails?.name,
        'email': '',
        'phone': '',
    });

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const params = { id: id, loyalty: loyaltyVal, ...formValue }
            const res = await APICALL(`/v1/update-customer-details`, 'post', params)
            if (res.status) {
                setLoading(false)
                setEditLoyalty(false)
                getCustomerDetails()
                setIsEdit(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }



    useEffect(() => {
        if (customerDetails) {
            setFormValue({
                ...formValue,
                'name': customerDetails?.name,
                'email': customerDetails?.email,
                'phone': customerDetails?.phone,
            });
        }
    }, [customerDetails])


    const [addressModal, setAddressModal] = useState(false);

    const [updAddress, setUpdAddress] = useState(null)
    const [addressVal, setAddressVal] = useState({
        customer_id: id,
        name: customerDetails?.name,
        email: customerDetails?.email,
        address: "",
        state: "",
        city: "",
        phone: customerDetails?.phone,
        type: "",
    });
    useEffect(() => {
        if (updAddress?.id) {
            setAddressVal({
                ...addressVal,
                id: updAddress?.id,
                customer_id: id,
                name: updAddress?.name,
                email: customerDetails?.email,
                address: updAddress?.address,
                state: updAddress?.state,
                city: updAddress?.city,
                phone: updAddress?.phone,
                zip: updAddress?.zip,
                type: updAddress?.type,
            })
        }
    }, [updAddress])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressVal((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [submitLoading, setSubmitLoading] = useState(false)
    const handleCreateAddress = async () => {
        try {
            setSubmitLoading(true)
            const updatedAddressVal = {};
            Object.keys(addressVal).forEach((key) => {
                if (addressVal[key] !== '') {
                    updatedAddressVal[key] = addressVal[key];
                }
            });

            const res = await APICALL("/v1/add-customer-address", "post", updatedAddressVal);
            if (res?.status) {
                toastifySuccess(res.message);
                setSubmitLoading(false)
                getCustomerDetails()
                setAddressModal(false);
            } else {
                setSubmitLoading(false)
                toastifyError("Please correct the errors in the form.");
            }
        } catch (error) {
            console.log(error);
            setSubmitLoading(false)
            toastifyError(SERVER_ERR);
        }
    };


    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-between mb-4 text-center text-sm-start gap-2">
                        <div className="mb-2 mb-sm-0">
                            <h4 className="mb-1"> Customer ID #{id}</h4>
                            <p className="mb-0">{timeAgo(customerDetails?.created_at)}</p>
                        </div>
                        {/* <button className='btn btn-primary' onClick={() => setIsEdit(!isEdit)}>Edit</button> */}
                    </div>

                    {
                        !isEdit ?
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
                                        <li className="nav-item"><button onClick={() => { setTabsPage(null); setAddressModal(false) }} className={`nav-link ${subPage == null ? 'active' : ''}`}><i className="ti ti-user me-1" />Overview</button></li>
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
                                                                                    <button className='btn btn-primary ms-2' onClick={() => handleUpdate()}>Save</button>
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

                                            subPage == 'Address' ?
                                                <>
                                                    <div className="accordion accordion-flush accordion-arrow-left" id="ecommerceBillingAccordionAddress">
                                                        <div className='row g-3'>

                                                            {
                                                                customerDetails.address?.length > 0 &&
                                                                customerDetails?.address?.map((item, i) => (
                                                                    <div className="col-lg-6 col-12">
                                                                        <div className="form-check card-radio">
                                                                            <label
                                                                                className="form-check-label"
                                                                                for={`radioAddress${i}`}
                                                                            >
                                                                                <h6 className="mb-2">{"Address"} {i + 1} - {item?.name}</h6>
                                                                                <p className="mb-0">{item?.address}</p>
                                                                                <p className="mb-0">{item?.phone}</p>
                                                                            </label>
                                                                        </div>
                                                                        <div className="d-flex flex-wrap p-2 py-1 bg-grays rounded-bottom border mt-n1">
                                                                            <div>
                                                                                <Link to={"#"}
                                                                                    onClick={() => { setUpdAddress(item); setAddressModal(true) }}
                                                                                >
                                                                                    <i className="fa fa-edit"></i> Edit
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))

                                                            }

                                                        </div>
                                                        {
                                                            addressModal &&
                                                            <div className="row mt-2 g-3">
                                                                <div className="col-md-12">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        value={addressVal.name}
                                                                        onChange={handleChange}
                                                                        placeholder="Name"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <input
                                                                        type="text"
                                                                        name="email"
                                                                        value={addressVal.email}
                                                                        onChange={handleChange}
                                                                        placeholder="Email"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <select
                                                                        name="state"
                                                                        value={addressVal.state}
                                                                        onChange={handleChange}
                                                                        placeholder="State"
                                                                        className="form-control"
                                                                    >
                                                                        <option value="">--Select State--</option>
                                                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                                        <option value="Assam">Assam</option>
                                                                        <option value="Bihar">Bihar</option>
                                                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                                                        <option value="Goa">Goa</option>
                                                                        <option value="Gujarat">Gujarat</option>
                                                                        <option value="Haryana">Haryana</option>
                                                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                                        <option value="Jharkhand">Jharkhand</option>
                                                                        <option value="Karnataka">Karnataka</option>
                                                                        <option value="Kerala">Kerala</option>
                                                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                                        <option value="Maharashtra">Maharashtra</option>
                                                                        <option value="Manipur">Manipur</option>
                                                                        <option value="Meghalaya">Meghalaya</option>
                                                                        <option value="Mizoram">Mizoram</option>
                                                                        <option value="Nagaland">Nagaland</option>
                                                                        <option value="Odisha">Odisha</option>
                                                                        <option value="Punjab">Punjab</option>
                                                                        <option value="Rajasthan">Rajasthan</option>
                                                                        <option value="Sikkim">Sikkim</option>
                                                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                                                        <option value="Telangana">Telangana</option>
                                                                        <option value="Tripura">Tripura</option>
                                                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                                        <option value="Uttarakhand">Uttarakhand</option>
                                                                        <option value="West Bengal">West Bengal</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        name="city"
                                                                        value={addressVal.city}
                                                                        onChange={handleChange}
                                                                        placeholder="City"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        name="zip"
                                                                        value={addressVal.zip}
                                                                        onChange={handleChange}
                                                                        placeholder="Zip Code"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        name="phone"
                                                                        value={addressVal.phone}
                                                                        onChange={handleChange}
                                                                        placeholder="Phone"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <textarea
                                                                        type="text"
                                                                        name="address"
                                                                        value={addressVal.address}
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        placeholder="Address"
                                                                    >
                                                                        {" "}
                                                                    </textarea>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="pop_btn d-flex gap-2 text-center w-100">
                                                                        <button type="button" className="btn-2 w-100 mb-3" onClick={() => setAddressModal(false)}>Cancel  </button>
                                                                        {
                                                                            !submitLoading ?
                                                                                <button type="button" className="btn-2 w-100 mb-3" onClick={handleCreateAddress}>Update</button>
                                                                                :
                                                                                <button type="button" className="btn-2 w-100 mb-3" >
                                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
                                                                                </button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        }
                                                    </div>

                                                </>
                                                :
                                                <></>
                                    }

                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-12 order-1 order-md-0">
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label> Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        onChange={handleChange1}
                                                        value={formValue.name}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label> Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="email"
                                                        onChange={handleChange1}
                                                        value={formValue.email}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label> Phone</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone"
                                                        onChange={handleChange1}
                                                        value={formValue.phone}
                                                    />
                                                </div>

                                                <div className="col-md-12 text-end">
                                                    <div className="gap-2">
                                                        <button type="button" className="btn btn-primary mb-3 mx-3" onClick={() => setIsEdit(false)}>Cancel  </button>
                                                        {
                                                            !submitLoading ?
                                                                <button type="button" className="btn btn-primary mb-3" onClick={handleUpdate}>Update</button>
                                                                :
                                                                <button type="button" className="btn btn-primary mb-3" >
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
                                                                </button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    }

                </div>
                <div className="content-backdrop fade" />
            </div>

            <Spinner sppiner={loading} />


        </>
    )
}

export default CustomerDetails