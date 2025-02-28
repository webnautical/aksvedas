import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../front/include/Footer";
import Header from "../../front/include/Header";
import { axiosInstance } from "../../utility/api/interceptor";
import SpinnerBTN from "../../components/SpinnerBTN";
import { encryptLocalStorageData } from "../../utility/Utility";
import { addToCartRepeater } from "../../utility/api/RepeaterAPI";
import { useFrontDataContext } from "../../context/FrontContextProvider";

const FrontLogin = () => {

  const useLocationData = useLocation()?.state
  const pageToRedirect = useLocationData ? useLocationData?.data : null 

  const { getWishlistFun } = useFrontDataContext();

  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const [isType, setIsType] = useState('')

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const otpInputs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(60);

  const [customerVal, setCustomerVal] = useState({
    'id': '',
    'name': '',
    'email': ''
  })

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

  const handleInputVal = (e) => {
    setCustomerVal({ ...customerVal, [e.target.name]: e.target.value })
  }

  const handleMobileNumberSubmit = async (e) => {
    e.preventDefault();
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


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
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
        setLoading(false)
        encryptLocalStorageData('customer-secret', dataParam, 'DoNotTryToAccess')
        const cart = sessionStorage.getItem('cart')
        if(cart){
          await addToCartRepeater(JSON.parse(cart), getWishlistFun);
        }
        sessionStorage.removeItem('cart')
        
        if(pageToRedirect == "buy"){
          console.log("CheckOutCall", pageToRedirect)
          navigate('/checkout')
        }else{
          console.log("Home", pageToRedirect)
          navigate('/')
        }

        // if (!dataParam.name) {
        //   setIsType('register')
        //   setCustomerVal({ ...customerVal, 'id': dataParam.id })
        //   navigate('/')
        // } else {
        //   navigate('/')
        // }
      } else {
        setError(res?.data?.message);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError("Server error");
    }
  };


  const handleEditMobileNumber = () => {
    setOtpSent(false);
  };

  const handleUpdateProdile = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axiosInstance.post('/v1/update-customer-details', customerVal)
      if (res?.data?.status) {
        navigate(-1)
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    setCountdown(60);
    setCount(count + 1)
    setOtpSent(true);
    handleMobileNumberSubmit(new Event('submit'));
  };

  return (
    <>
      <Header></Header>
      <div className="loginouter">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mx-auto">
              <div className="loginouter-inner">
                {
                  isType == "register" ?
                    <>
                      <form onSubmit={handleUpdateProdile}>
                        <h2>Sign in</h2>
                        <p>Enter your name and email address.</p>
                        <div className="wb cutsom-input mt-3">
                          <input
                            type="text"
                            name="name"
                            value={customerVal.name}
                            onChange={handleInputVal}
                            maxLength="16"
                            placeholder="Name"
                          />
                        </div>
                        <div className="wb cutsom-input mt-3">
                          <input
                            type="text"
                            name="email"
                            value={customerVal.email}
                            onChange={handleInputVal}
                            maxLength="36"
                            placeholder="Email"
                          />
                        </div>
                        {error && (
                          <p className="text-start errorlogin mt-1">
                            <i className="fas fa-exclamation-triangle"></i> {error}
                          </p>
                        )}

                        <button type="submit" className="shop_now btn-2 mt-4 w-100">
                          {loading ? <SpinnerBTN /> : <>Continue <i className="fa-solid fa-arrow-right  ms-2"></i></>}
                        </button>
                      </form>
                    </>
                    :
                    <>
                      {!otpSent ? (
                        <form onSubmit={handleMobileNumberSubmit}>
                          <h2>Sign in</h2>
                          <p>
                            Enter your mobile number and we will send you an OTP for
                            verification.
                          </p>
                          <div className="cutsom-input mt-3">
                            {" "}
                            +91
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
                            />
                          </div>
                          {error && (
                            <p className="text-start errorlogin mt-1">
                              <i className="fas fa-exclamation-triangle"></i> {error}
                            </p>
                          )}

                          <button type="submit" className="shop_now btn-2 mt-4 w-100">
                            {
                              loading ?
                                <SpinnerBTN />
                                :
                                <>Continue <i className="fa-solid fa-arrow-right  ms-2"></i></>
                            }


                          </button>
                          <p className="tersm-condition mt-4">
                            By continuing, I agree to the{" "}
                            <Link to="/term-and-condition">Terms of Use</Link> &{" "}
                            <Link to="/privacy-policy"> Privacy Policy </Link>
                          </p>
                        </form>
                      ) : (
                        <form onSubmit={handleOtpSubmit}>
                          <h2>Sign in</h2>
                          <p>We have sent verification code to +91 {mobileNumber}   <button
                            type="button"
                            className="editnum"
                            onClick={() => handleEditMobileNumber()}
                          >
                            Edit
                          </button></p>

                          <div className="custom-otp mt-3">
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
                          {error && (
                            <p className="text-start errorlogin mt-3">
                              <i className="fas fa-exclamation-triangle"></i> {error}</p>
                          )}
                          {countdown > 0 && (
                            <p className="mt-3 mb-0"><i className="fa-regular fa-clock"></i> Resend Otp in {countdown} sec</p>

                          )}
                          {otpSent && countdown === 0 && (
                            <button onClick={handleResendOtp} className="btn btn-sm btn-warning mt-2">Resend OTP</button>
                          )}

                          <button type="submit" className="shop_now btn-2 mt-4 w-100">
                            {
                              loading ?
                                <SpinnerBTN />
                                :
                                <>Verify <i className="fa-solid fa-arrow-right ms-2"></i></>
                            }

                          </button>
                        </form>
                      )}
                    </>
                }

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer></>
  );
};

export default FrontLogin;
