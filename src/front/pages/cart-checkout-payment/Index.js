import { Box, Breadcrumbs, Button, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import otpIcon from "../../../assets/img/otpIcon.png";
import phoneIcon from "../../../assets/img/phoneIcon.png";
import OrderSummary from '../../../components/front/OrderSummary';
import CheckOut from '../checkout/CheckOut';
import Payment from '../payment/Payment';
import { useFrontDataContext } from '../../../context/FrontContextProvider';
import { authCustomer, encryptLocalStorageData, toastifyError, toastifySuccess, validateEmail } from '../../../utility/Utility';
import { APICALL, getDataAPI } from '../../../utility/api/api';
import { SERVER_ERR, SOMETHING_ERR } from '../../../utility/Constants';
import SpinnerBTN from '../../../components/SpinnerBTN';
import ConfirmModal from '../../../components/ConfirmModal';
import emptycart from "../../../assets/img/empty-cart.png";
import { axiosInstance } from '../../../utility/api/interceptor';
const steps = [
    'Cart',
    'Shipping Information',
    'Payment',
];


const Index = () => {
    const { cartData, customerDetails, shippingDetails, getCustomerDetails, getOrderListFun, getCartFun } = useFrontDataContext()
    const [guestID, setGuestID] = useState("")
    const navigate = useNavigate()
    const path = useLocation().pathname
    const pathWithoutSlash = path.substring(1);
    const [addressID, setAddressID] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [addressModal, setAddressModal] = useState(false);
    const [loading, setLoading] = useState(false)

    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const otpInputs = [useRef(), useRef(), useRef(), useRef()];

    const [offerCouponObj, setOfferCouponObj] = useState(null)
    const [loyaltyDiscount, setLoyaltyDiscount] = useState(0)

    const getSubTotalFunc = () => {
        const subtotal = cartData.reduce((total, item) => total + parseFloat(item?.sale_price) * parseInt(item.qnt), 0);
        return subtotal;
    }

    const getSubTotalAmnt = () => {
        const subTotalAmount = getSubTotalFunc()
        const savingAmount = parseInt(offerCouponObj?.saving ?? 0)
        const shippingCharge = parseInt(shippingDetails?.shipping_charge ?? 0);
        const amountAfterSaving = subTotalAmount - savingAmount;
        const total = amountAfterSaving < parseInt(shippingDetails?.total_amnt) ? amountAfterSaving + shippingCharge : amountAfterSaving;
        return total - loyaltyDiscount;
    }

    const [paymentMethod, setPaymentMethod] = useState('OPTUPI')
    const productArr = cartData?.map((item) => {
        return { product_id: item.product_id, qnt: item.qnt, product_name: item.name, product_price: item.sale_price, product_sku: item.sku, subscription_id: item.subscription_id };
    });

    const data = {
        addressID: addressID,
        totalAmount: getSubTotalAmnt(),
        shippingCharge: getSubTotalFunc() < parseInt(shippingDetails?.total_amnt) ? parseInt(shippingDetails?.shipping_charge ?? 0) : 0,
        products: cartData,
        discounts: offerCouponObj?.saving,
        loyaltyDiscount: loyaltyDiscount,
        coupon: offerCouponObj?.coupon,
        totalProducts: cartData?.length,
    }

    const global_customer_id = () => {
        return authCustomer()?.id ? authCustomer()?.id : guestID
    }

    const params = {
        "customer_id": global_customer_id(),
        "address_id": data?.addressID,
        "total_products": data?.totalProducts,
        "total_shipping": data?.shippingCharge,
        "total_amount": data?.totalAmount,
        "discounts": data?.discounts,
        "loyalty_discounts": data?.loyaltyDiscount,
        "coupon": data?.coupon,
        "payment_method": paymentMethod,
        "products": productArr,
        "tax": 0
    }

    const createOrder = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/v1/create-order', 'post', params);
            if (res?.status) {
                setLoading(false)
                getCartFun()
                getOrderListFun()
                localStorage.removeItem('cart');
                navigate(`/order-success/${res?.data?.id}`)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log("API ERR", error)
            setLoading(false)
        }
    }

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        window.scrollTo(0, 0);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        window.scrollTo(0, 0);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    useEffect(() => {
        if (customerDetails?.address?.length > 0) {
            const lastAddressID = customerDetails?.address[customerDetails?.address?.length - 1].id;
            setAddressID(lastAddressID);
        }

        setAddressVal(prevState => ({
            ...prevState,
            customer_id: customerDetails?.id,
            name: customerDetails?.name,
            phone: customerDetails?.phone,
            email: customerDetails?.email,
        }));
        
    }, [customerDetails]);

    const [updAddress, setUpdAddress] = useState(null)
    const [addressVal, setAddressVal] = useState({
        customer_id: authCustomer()?.id,
        name: customerDetails?.name,
        email: customerDetails?.email,
        address: "",
        state: "",
        city: "",
        phone: customerDetails?.phone,
        type: "",
    });

    // useEffect(() => {
    //     if (!authCustomer()?.token) {
    //         navigate('/login')
    //     }
    // }, [])

    useEffect(() => {
        if (updAddress?.id) {
            setAddressVal({
                ...addressVal,
                id: updAddress?.id,
                customer_id: authCustomer()?.id,
                name: updAddress?.name,
                address: updAddress?.address,
                state: updAddress?.state,
                city: updAddress?.city,
                phone: updAddress?.phone,
                zip: updAddress?.zip,
                type: updAddress?.type,
            })
        } else {
            setAddressVal({
                ...addressVal,
                customer_id: authCustomer()?.id,
                name: customerDetails?.name,
                address: "",
                state: "",
                city: "",
                zip: "",
                phone: customerDetails?.phone,
                type: "",
            })
        }
    }, [updAddress])

    // useEffect(() => {
    //     getCouponsFun()
    // }, [])

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        state: "",
        city: "",
        zip: "",
        phone: "",
        address: "",
        type: "Shipping Address",
    });

    const validateForm = () => {
        const newErrors = {};
        if (!addressVal.name) newErrors.name = "Name is required";
        if (!addressVal.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(addressVal.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!addressVal.state) newErrors.state = "State is required";
        if (!addressVal.city) newErrors.city = "City is required";
        if (!addressVal.zip) newErrors.zip = "Zip Code is required";
        if (!addressVal.phone) newErrors.phone = "Phone is required";
        if (!addressVal.address) newErrors.address = "Address is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddressVal((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value ? "" : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
        }));

        if (name === "email" && value && !validateEmail(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: "Invalid email address",
            }));
        }
    };
    const addAddress = () => {
        setAddressModal(true);
        setAddressVal({
            ...addressVal,
            phone: customerDetails?.phone,
            name: customerDetails?.name,
            email: customerDetails?.email,
        });
    }

    const handleCreateAddress = async () => {
        try {

            if (!validateForm()) {
                toastifyError("Please correct the errors in the form.");
                return;
            }
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
                getCustomerDetails(updatedAddressVal?.customer_id);
                handleAddressModalClose();
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

    const handleRemoveAddress = async (id) => {
        try {
            const res = await APICALL("/v1/remove-customer-address", "post", {
                id: id,
            });
            if (res?.status) {
                toastifySuccess(res.message);
                getCustomerDetails();
            } else {
                toastifyError(SOMETHING_ERR);
            }
        } catch (error) {
            console.log(error);
            toastifyError(SERVER_ERR);
        }
    };

    const handleAddressModalClose = () => {
        setAddressModal(false);
        setAddressVal({
            ...addressVal,
            address: "",
            city: "",
            phone: customerDetails?.phone,
            name: customerDetails?.name,
            email: customerDetails?.email,
            id: '',
            state: "",
            zip: "",
        });
        setErrors({
            ...errors,
            name: "",
            email: "",
            address: "",
            city: "",
            phone: "",
            state: "",
            zip: "",
        });
    };

    // OPTCRDC - Credit Card
    // OPTDBCRD - Debit Card
    // OPTNBK - Net Banking


    const paymentData = {
        customer_id: global_customer_id(),
        address_id: addressID,
        amount: getSubTotalAmnt(),
        payment_option: paymentMethod,
        card_type: "OPTCRDC",
        params: params
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const response = await APICALL('/checkout', 'post', paymentData);

            const { encryptedData, accessCode } = response;
            const form = document.createElement('form');
            form.method = 'post';
            form.action = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
            form.innerHTML = `
                <input type="hidden" name="encRequest" value="${encryptedData}" />
                <input type="hidden" name="access_code" value="${accessCode}" />
            `;
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Payment initiation failed', error);
        } finally {
            setLoading(false);
        }
    };

    const [modalOpen, setModalOpen] = useState(false)

    const handleMobileNumberSubmit = async () => {
        setLoading(true)
        try {
            if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
                setError("Kindly enter a valid mobile number.");
                setLoading(false)
            } else {
                const params = {
                    phone: mobileNumber,
                    type: "login"
                }
                const res = await axiosInstance.post('/login', params)
                if (res?.data?.status) {
                    setOtpSent(true);
                    setLoading(false)
                    setError();
                } else {
                    setError(res?.data?.message);
                    setLoading(false)
                }
            }
        } catch (error) {
            setLoading(false)
            setError("Server error");
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1 || isNaN(value)) {
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < otpInputs.length - 1) {
            otpInputs[index + 1].current.focus();
        }

        if (value === "" && index > 0) {
            otpInputs[index - 1].current.focus();
        }
    };
  const [countdown, setCountdown] = useState(60);
  const [count, setCount] = useState(0)
    useEffect(() => {
      if (otpSent) {
        const timer = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount === 1) {
              clearInterval(timer);
            }
            return prevCount - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [otpSent, count]);
    const [parentTrigger, setParentTrigger] = useState(false);

    const handleVerifyOTP = async () => {
        const otpValue = otp.join("");
        if (otpValue?.length < 4) {
            setError("Please enter valid otp");
            return false
        }
        setLoading(true)
        try {
            const params = {
                phone: mobileNumber,
                otp: otpValue,
                type: "verify-otp"
            }
            const res = await axiosInstance.post('/login', params)
            if (res?.data?.status) {
                const dataParam = {
                    token: res?.data?.token,
                    id: res?.data?.data?.id,
                    name: res?.data?.data?.name,
                }
                setGuestID(dataParam?.id)
                setAddressVal(prevState => ({
                    ...prevState,
                    customer_id: dataParam?.id,
                    phone: mobileNumber,
                }));
                setParentTrigger(true)
                getCustomerDetails(dataParam?.id);
                setLoading(false)
                setAddressModal(true)
                setOtpSent(false);
                setSuccessMessage("Your phone number has been verified! Now you can add your address and place your order.")
                encryptLocalStorageData('customer-secret', dataParam, 'DoNotTryToAccess')
            } else {
                setError(res?.data?.message);
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            setError("Server error");
        }
    };

    const handleResendOtp = () => {
        setCountdown(60);
        setCount(count + 1)
        setOtpSent(true);
        handleMobileNumberSubmit()
    };


    return (
        <>

            <div
                className="innabout-section"
                style={{ backgroundImage: `url(${siderbg})` }}
            >
                <div className="container">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="breacrumb-custom py-md-3 py-2"
                        separator={<NavigateNextIcon fontSize="small" />}
                    >
                        <Link underline="hover" to="/"> Home</Link>
                        <Typography className='text-capitalize'>{pathWithoutSlash}</Typography>
                    </Breadcrumbs>
                    <h1 className='text-capitalize'>{pathWithoutSlash}</h1>
                </div>
            </div>

            <section className="cart-section checkout-pagebg">
                    {/* <button onClick={()=>callChildApplyCoupon()}>Applu</button> */}
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mx-auto">
                            <div className="checkout_cart_listing">
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>

                            <Box className="card-check-outer">
                                <div className="row">
                                    <div className="col-lg-8">
                                        {activeStep === 0 && (
                                            <>
                                                <CheckOut />
                                            </>
                                        )}

                                        {activeStep === 1 &&
                                            <>

                                                {!authCustomer()?.id &&
                                                    <div className='mobile_number_verify'>
                                                        <div className="card">
                                                            <div className="card-body">

                                                                {/* <h6 className="mb-3 fs-14 text-center d-block">Verify your mobile number to place your order.</h6> */}


                                                                {/* Number */}
                                                                {!otpSent ?
                                                                    <div className='row justify-content-center'>
                                                                        <div className='col-md-6 text-center'>
                                                                            <img className='m-auto mb-3' width={60} src={phoneIcon} alt="ok" />
                                                                            <h4 className='mt-2 mb-0'>Login first to place order </h4>

                                                                            <span className='mt-0 d-block'>Log in to your account on our website to earn AksCoins for this order. Don't miss out on exclusive rewards and benefits!</span>

                                                                            <div className=" gap-3 px-3 mx-n3 mt-3">
                                                                                <input
                                                                                    type="tel"
                                                                                    value={mobileNumber}
                                                                                    onChange={(e) => {
                                                                                        const input = e.target.value.replace(/\D/g, "");
                                                                                        if (input.length <= 10) {
                                                                                            setMobileNumber(input);
                                                                                        }
                                                                                    }}
                                                                                    maxLength="10"
                                                                                    placeholder="Mobile Number"
                                                                                    className='form-control'
                                                                                />


                                                                                <div className='text-center'>
                                                                                    <button type="button" className="mt-3 text-center m-auto btn-normals w-xs text-nowrap" onClick={() => handleMobileNumberSubmit()}>Get OTP</button>
                                                                                </div>
                                                                            </div>
                                                                            {error && (
                                                                                <p className="text-start errorlogin mt-1">
                                                                                    <i className="fas fa-exclamation-triangle"></i> {error}
                                                                                </p>
                                                                            )}


                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {/* OTP */}
                                                                        <div className="row justify-content-center">
                                                                            <div className='col-12 col-md-5 text-center'>
                                                                                <img className='m-auto' width={60} src={otpIcon} alt="ok" />
                                                                                <h4 className='mt-2 mb-0'>Otp Sent </h4>
                                                                                <span className='mt-0 d-block'>Please check your phone for the OTP.</span>
                                                                                <div className="gap-3 px-3 mx-n3">
                                                                                    <div className="custom-otp mt-3 justify-content-between">
                                                                                        {otp?.map((digit, index) => (
                                                                                            <input
                                                                                                key={index}
                                                                                                ref={otpInputs[index]}
                                                                                                type="tel"
                                                                                                maxLength="1"
                                                                                                value={digit}
                                                                                                onChange={(e) =>
                                                                                                    handleOtpChange(index, e.target.value)
                                                                                                }
                                                                                                style={{
                                                                                                    textAlign: "center",
                                                                                                }}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                  <div class="mt-3 text-end">
                                                                                  {countdown > 0 && (
                                                                                        <p className="mt-3 mb-0"><i className="fa-regular fa-clock"></i> Resend Otp in {countdown} sec</p>
                                                                                    )}
                                                                                    {
                                                                                        countdown === 0 &&
                                                                                        <button onClick={handleResendOtp} className="p-0 border-0" style={{ color:'#af6800' }}>Resend OTP</button>
                                                                                    }
                                                                                  </div>
                                                                                    <button type="button" className="btn-normals w-xs text-nowrap mt-3" onClick={() => handleVerifyOTP()}>Verify</button>
                                                                                </div>
                                                                                {error && (
                                                                                    <p className="text-start errorlogin mt-1">
                                                                                        <i className="fas fa-exclamation-triangle"></i> {error}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </>}
                                                            </div>

                                                        </div>
                                                    </div>}

                                                <div className="d-flex align-items-center mb-4">
                                                    {authCustomer()?.id &&
                                                        <>
                                                            <div className="flex-grow-1">
                                                                <h5 className="mb-0">Address</h5>
                                                            </div>
                                                            {(!customerDetails || customerDetails?.address?.length < 5) && (
                                                                <div className="flex-shrink-0">
                                                                    <Link to="#" onClick={() => addAddress()} className="add_address btn-normals fs-14">
                                                                        Add new address
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                </div>
                                                {successMessage && (
                                                    <p className="text-start text-success mt-1">
                                                        {successMessage}
                                                    </p>
                                                )}

                                                <>
                                                    <div className='row g-3'>
                                                        {
                                                            customerDetails?.address?.length > 0 &&
                                                            customerDetails?.address?.map((item, i) => (
                                                                <div className="col-lg-6 col-12">
                                                                    <div className="form-check card-radio">
                                                                        <input
                                                                            id={`radioAddress${i}`}
                                                                            name="shippingAddress"
                                                                            type="radio"
                                                                            value={item?.id}
                                                                            onChange={() => setAddressID(item?.id)}
                                                                            className="form-check-input"
                                                                            checked={addressID === item.id}
                                                                        />
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
                                                                        <div className="ms-3">
                                                                            <Link
                                                                                to={"#"}
                                                                                className="colorRedcolor"
                                                                                onClick={() => handleRemoveAddress(item?.id)}
                                                                            >
                                                                                <i className="fa fa-trash"></i> Remove
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </>

                                                {
                                                    addressModal &&
                                                    <div className="row mt-2 g-3">
                                                        <div className="col-md-12">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={addressVal?.name}
                                                                onChange={handleChange}
                                                                placeholder="Name"
                                                                className="form-control"
                                                            />
                                                            <span className="errMsg">{errors.name}</span>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <input
                                                                type="text"
                                                                name="email"
                                                                value={addressVal?.email}
                                                                onChange={handleChange}
                                                                placeholder="Email"
                                                                className="form-control"
                                                                disabled={customerDetails?.email ? true : false}
                                                            />
                                                            <span className="errMsg">{errors.email}</span>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <select
                                                                name="state"
                                                                value={addressVal?.state}
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
                                                            <span className="errMsg">{errors.state}</span>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={addressVal?.city}
                                                                onChange={handleChange}
                                                                placeholder="City"
                                                                className="form-control"
                                                            />
                                                            <span className="errMsg">{errors.city}</span>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="text"
                                                                name="zip"
                                                                value={addressVal?.zip}
                                                                onChange={handleChange}
                                                                placeholder="Zip Code"
                                                                className="form-control"
                                                            />
                                                            <span className="errMsg">{errors.zip}</span>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="text"
                                                                name="phone"
                                                                value={addressVal?.phone}
                                                                onChange={handleChange}
                                                                placeholder="Phone"
                                                                className="form-control"
                                                            />
                                                            <span className="errMsg">{errors.phone}</span>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <textarea
                                                                type="text"
                                                                name="address"
                                                                value={addressVal?.address}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                placeholder="Address"
                                                            >
                                                                {" "}
                                                            </textarea>
                                                            <span className="errMsg">{errors?.address}</span>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="pop_btn d-flex gap-2 text-center w-100">
                                                                {authCustomer()?.id &&
                                                                    <button type="button" className="btn-2 w-100 mb-3" onClick={() => setAddressModal(false)}>Cancel  </button>
                                                                }
                                                                {
                                                                    !submitLoading ?
                                                                        <button type="button" className="btn-2 w-100 mb-3" onClick={handleCreateAddress}>
                                                                            Save
                                                                        </button>
                                                                        :
                                                                        <button type="button" className="btn-2 w-100 mb-3" >
                                                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
                                                                        </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    (!addressModal && customerDetails?.address?.length == 0) ?
                                                        <>
                                                            <div className='text-center mt-2'>
                                                                <h6>Please Add Your Delivery Address</h6>
                                                            </div>
                                                        </>
                                                        :
                                                        <> </>

                                                }
                                            </>
                                        }

                                        {activeStep === 2 && <><Payment setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} /></>}

                                    </div>

                                    {cartData?.length < 1 && (
                                        <div class="product-item-inner">
                                            <img src={emptycart} alt="" />
                                            <h4>There are no product added on your cart.</h4>
                                        </div>
                                    )}


                                    {
                                        cartData?.length > 0 &&
                                        <div className="col-lg-4  rightdiv-tableorder mt-lg-0 mt-3">
                                            <div className="sticky-side-div">
                                                <OrderSummary subTotal={getSubTotalFunc()} setOfferCouponObj={setOfferCouponObj} setLoyaltyDiscount={setLoyaltyDiscount} loyaltyDiscount={loyaltyDiscount} parentTrigger={parentTrigger}/>
                                                <div className="product-button">
                                                    <Box
                                                        sx={{ display: "flex", justifyContent: "flex-end" }}
                                                        className="doble_btn-pro"
                                                    >
                                                        {activeStep > 0 && (
                                                            <button className="btn-2 buy-btn" onClick={handleBack} sx={{ mr: 1 }}>
                                                                Back
                                                            </button>
                                                        )}
                                                        {activeStep < steps.length - 1 && (

                                                            <>
                                                                {activeStep === 0 ?
                                                                    <>
                                                                    <Link to="/shop/all" className="btn-2 buy-btn" onClick={handleNext}> Continue shopping </Link>
                                                                    <button className="btn-2" onClick={handleNext}> Next </button>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {customerDetails?.address?.length > 0 ?
                                                                            <button className="btn-2" onClick={handleNext}> Continue to Payment </button>
                                                                            :
                                                                            <button className="btn-2 my-btn" type='button'> Continue to Payment </button>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        )}
                                                        {activeStep === steps.length - 1 && (
                                                            <>
                                                                {
                                                                    loading ?
                                                                        <button type="button" className="btn-2" > <SpinnerBTN /></button>
                                                                        :
                                                                        <>
                                                                            {
                                                                                paymentMethod == "COD" ?
                                                                                    <button className="btn-2" onClick={createOrder}> Proceed to Payment </button>
                                                                                    // <button className="btn-2" onClick={() => setModalOpen(true)}> Proceed to Payment </button>
                                                                                    :
                                                                                    <button className="btn-2" onClick={handlePayment}> Proceed to Payment </button>

                                                                            }
                                                                        </>

                                                                }
                                                            </>
                                                        )}
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    }


                                </div>
                            </Box>

                        </div>
                    </div>
                </div>
            </section>

            <ConfirmModal
                msg={
                    <>
                        <h3 className="mt-2 mb-1">Are you sure ?</h3>
                        <h5 className="my-0">You want to place this order</h5>
                    </>}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                funCall={createOrder}
                btn1={"Yes"}
                btn2={"NO"}
                submitLoading={loading}
                icon={false}
            />
        </>
    )
}

export default Index