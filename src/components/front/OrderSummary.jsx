import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { APICALL } from '../../utility/api/api'
import { authCustomer, toastifySuccess } from '../../utility/Utility'
import { useFrontDataContext } from '../../context/FrontContextProvider'
import applycoupan from "../../assets/img/coupan-apply.gif";
const OrderSummary = (props) => {
    const { shippingDetails, cartData, customerDetails, categories } = useFrontDataContext()

    // const [discountOnCategory, setDiscountOnCategory] = useState([])
    const { subTotal, setOfferCouponObj, loyaltyDiscount, setLoyaltyDiscount, parentTrigger, activeStep } = props
    const [coupon, setCoupon] = useState('')
    const [response, setResponse] = useState({
        error: null,
        msg: null,
        coupon: null,
        allow: '',
        saving: 0,
    })


    const applyCoupon = async (coupon) => {
        try {
            const params = { coupon, customer_id: authCustomer()?.id }
            if (coupon == "") {
                setResponse({ ...response, 'error': false, 'msg': "Enter coupon code" })
                return false
            }
            const res = await APICALL('/use-coupon', 'post', params)
            if (res?.status) {
                if (res?.data?.allow === 'all') {
                    const saving = calculateSavings1(res?.data, cartData)
                    setOfferCouponObj({ saving: saving, coupon: coupon, allow: res?.data?.allow })
                    // setOfferCouponObj({ saving: saving * parseInt(cartData?.length), coupon: coupon, allow: res?.data?.allow })

                    setResponse({ ...response, 'error': res?.status, 'msg': res?.message, 'coupon': res?.data?.coupon_code, saving: saving, allow: res?.data?.allow })

                    // setResponse(prevState => ({
                    //     ...prevState,
                    //     'error': res?.status,
                    //     'msg': res?.message,
                    //     'coupon': res?.data?.coupon_code,
                    //     saving,
                    //     allow: res?.data?.allow
                    // }));
                }
                if (res?.data?.allow !== 'all') {
                    const filteredProducts = cartData.filter(product => {
                        const categoryIds = product.category_id.split(',').map(id => parseInt(id.trim()));
                        return categoryIds.includes(parseInt(res?.data?.allow));
                    });
                    const getCategoryById = (categories, categoryId) => {
                        const category = categories.find(cat => cat.id == categoryId);
                        return category ? category?.name : null;
                    };
                    const category = getCategoryById(categories, res?.data?.allow);
                    let msg
                    if (filteredProducts?.length > 0) {
                        msg = "Coupon applied"
                    } else {
                        msg = `This Coupon Only For ${category}`
                    }

                    const saving = calculateSavings(res?.data, filteredProducts)
                    setOfferCouponObj({ saving: saving, coupon: coupon, allow: res?.data?.allow })
                    setResponse({ ...response, 'error': res?.status, 'msg': msg, 'coupon': res?.data?.coupon_code, saving: saving, allow: res?.data?.allow })
                }
            } else {
                setOfferCouponObj({ saving: 0, coupon: coupon })
                setResponse({ ...response, 'error': res?.status, 'msg': res?.message, allow: '', saving: 0 })
            }
        } catch (error) {
            setOfferCouponObj({ saving: 0, coupon: coupon })
            setResponse({ ...response, 'error': false, 'msg': "Something went wrong. try again letter", allow: '', saving: 0 })
        }
    }


    const getFreeDeliveryText = () => {
        const subTotalAmount = parseInt(subTotal);
        const savingAmount = savingAmnt()
        const amountAfterSaving = subTotalAmount - savingAmount;
        const shippingCharge = parseInt(shippingDetails?.shipping_charge ?? 0);

        if (amountAfterSaving < parseInt(shippingDetails?.total_amnt)) {
            return <> <span>{shippingCharge > 0 ? `+ ₹${shippingCharge}` : ` ₹${shippingCharge}`}</span> </>
        } else {
            return <> <span className='text-success text-uppercase'><del className="high_price fw-bold">₹{shippingCharge}</del> Free delivery</span> </>
        }
    }

    const getSubTotalAmnt = () => {
        const subTotalAmount = parseInt(subTotal);
        const savingAmount = savingAmnt()
        const shippingCharge = parseInt(shippingDetails?.shipping_charge ?? 0);
        const amountAfterSaving = subTotalAmount - savingAmount;
        const total = amountAfterSaving < parseInt(shippingDetails?.total_amnt) ? amountAfterSaving + shippingCharge : amountAfterSaving;
        return total - loyaltyDiscount;
    }

    // const calculateSavings = (coupon, totalAmount) => {
    //     let savings = 0;
    //     if (coupon.coupon_type === 'fixed') {
    //         savings = coupon.offer;
    //     } else if (coupon.coupon_type === 'percentage') {
    //         savings = (coupon.offer / 100) * totalAmount;
    //     }
    //     return savings;
    // };

    const calculateSavings = (coupon, cartData) => {
        let totalSavings = 0;

        cartData.forEach(product => {
            let productSavings = 0;
            if (coupon.coupon_type === 'fixed') {
                productSavings = coupon.offer * parseInt(product?.qnt);
            } else if (coupon.coupon_type === 'percentage') {
                productSavings = (coupon.offer / 100) * product.sale_price * parseInt(product?.qnt);
            }
            totalSavings += productSavings;
        });

        return parseFloat(totalSavings.toFixed(2));
    };

    const calculateSavings1 = (coupon, cartData) => {
        let totalSavings = 0;

        // cartData.forEach(product => {
        //     let productSavings = 0;
        //     if (coupon.coupon_type === 'fixed') {
        //         productSavings = coupon.offer * parseInt(product?.qnt);
        //     } else if (coupon.coupon_type === 'percentage') {
        //         productSavings = (coupon.offer / 100) * product.sale_price * parseInt(product?.qnt);
        //     }
        //     totalSavings += productSavings;
        // });
        // return parseFloat(totalSavings.toFixed(2));

        const itemTotal = cartData.reduce((acc, item) => {
            return acc + (item.sale_price * item?.qnt || 0);
        }, 0);

        let productSavings = 0;
        if (coupon.coupon_type === 'fixed') {
            productSavings = coupon.offer
        } else if (coupon.coupon_type === 'percentage') {
            productSavings = (coupon.offer / 100) * parseInt(itemTotal);
        }

        return parseFloat(productSavings);
    };

    useEffect(() => {
        if (cartData) {
            setOfferCouponObj({ saving: savingAmnt(), coupon: coupon, allow: response?.allow })
        }
    }, [cartData?.length])

    const savingAmnt = () => {
        const savingAmount = response.allow === 'all' ? parseInt(response.saving ?? 0) : parseInt(response.saving ?? 0);
        return savingAmount
    }

    const [total50, setTotal50] = useState()
    const maxLoyaltyUsage = 100;
    const submitLoyaltyDiscount = (isChecked) => {
        const loyaltyAmnt = customerDetails?.loyalty || 0;
        const total = getSubTotalAmnt() / 2;
        setTotal50(total);
        if (isChecked) {
            if (authCustomer()?.id) {
                const usableLoyalty = loyaltyAmnt > maxLoyaltyUsage ? maxLoyaltyUsage : loyaltyAmnt;
                setLoyaltyDiscount(usableLoyalty)
            } else {
                setLoyaltyDiscount(0);
                setTotal50(getSubTotalAmnt());
            }
            // if (total >= loyaltyAmnt) {
            //     setLoyaltyDiscount(loyaltyAmnt);
            // } else {
            //     setLoyaltyDiscount(total);
            // }
        } else {
            setLoyaltyDiscount(0);
            setTotal50(getSubTotalAmnt());
        }
    };

    useEffect(() => {
        getCouponsFun()
    }, [])

    const shippingChargeVar = getFreeDeliveryText()
    const [showModal, setShowModal] = useState(false);

    const [couponList, setCouponList] = useState([])
    const getCouponsFun = async () => {
        try {
            const res = await APICALL('get-coupons?type=visible');
            if (res?.status) {
                if (res?.applied_coupon) {
                    if (res?.is_first_order) {
                        setShowModal(true)
                        setTimeout(() => {
                            setShowModal(false);
                        }, 3000);
                        setCoupon(res?.applied_coupon);
                        applyCoupon(res?.applied_coupon)
                    }
                }
                setCouponList(res?.data)
            } else {
                setCouponList([])
            }
        } catch (error) {
            console.log(error)
            setCouponList([])
        }
    }

    const removeCoupon = () => {
        setResponse({
            ...response,
            error: null,
            msg: null,
            coupon: null,
            allow: '',
            saving: 0,
        })
        setOfferCouponObj(null)
        setCoupon("")
    }

    useEffect(() => {
        if (coupon) {
            applyCoupon(coupon)
        }
    }, [cartData])

    useEffect(() => {
        if (parentTrigger) {
            if (coupon) {
                applyCoupon(coupon)
            }
        }
    }, [parentTrigger])

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const couponBoxToggle = () =>{
        if(isMobile){
            if(isMobile && activeStep == 0){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }

    return (
        <>
            {
                couponBoxToggle() &&
                <div className="card">
                    <div className="card-body">
                        <div className="text-center">
                            <h6 className="mb-3 fs-14">
                                Have a <span className="fw-semibold">promo</span> code ?
                            </h6>
                        </div>
                        <div className="hstack gap-3 px-3 mx-n3 align-items-start">
                            <div className='w-100'>
                                <input
                                    className="form-control me-auto"
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    aria-label="Add Promo Code here..."
                                />
                                <div className='text-end'>
                                    <button type="button" className="p-0 border-0" style={{ color: '#af6800' }} onClick={() => removeCoupon(coupon)}>Remove</button>
                                </div>
                            </div>
                            <button type="button" className="btn-normals w-xs" onClick={() => applyCoupon(coupon)}>Apply</button>
                        </div>
                        <span className={response.error ? 'text-success' : 'text-danger'}>{response?.msg}</span>

                        <div className='mt-2'>
                            {couponList?.length > 0 &&
                                couponList?.map((item, i) => (
                                    <div class="vouchercard mb-2">
                                        <div class="">
                                            <div class="content d-flex justify-content-between">
                                                <h2 className="m-0">{item?.coupon_code}</h2>
                                                {item?.coupon_code == coupon ?
                                                    <button className="border-0 p-0" style={{ color: '#B46B00', cursor: "none" }}>Applied</button>
                                                    :
                                                    <button className="border-0 p-0" style={{ color: '#B46B00' }} onClick={() => { setCoupon(item?.coupon_code); applyCoupon(item?.coupon_code) }}>Apply</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className='mt-3'>
                            <p className="px-1" style={{ fontSize: '14px', background: 'rgb(237 237 237)' }}>You can use 100 Coins max in one time shopping</p>

                            <span>Use AksCoins ₹{customerDetails?.loyalty || 0} </span>

                            <>
                                <label className="switch switch-primary switch-sm ms-2 pe-2">
                                    <input
                                        type="checkbox"
                                        className="switch-input"
                                        onClick={(e) => submitLoyaltyDiscount(e.target.checked)}
                                    />
                                    <span className="switch-toggle-slider">
                                        <span className="switch-on">
                                            <span className="switch-off" />
                                        </span>
                                    </span>
                                </label>
                            </>
                        </div>

                    </div>
                </div>
            }

            <div className="card overflow-hidden mt-4">
                <div className="card-header border-bottom-dashed">
                    <h5 className="card-title mb-0 fs-15">Order Summary</h5>
                </div>
                <div className="card-body pt-4">
                    <div className="table-responsive table-card">
                        <table className="table table-borderless mb-0 fs-15">
                            <tbody>
                                <tr>
                                    <td>Sub Total :</td>
                                    <td className="text-end cart-subtotal">₹{subTotal}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Discount{" "}
                                        <span>({response?.coupon})</span>:
                                    </td>
                                    <td className="text-end cart-discount"> {savingAmnt() > 0 && "-"} ₹{savingAmnt()}</td>
                                </tr>
                                <tr>
                                    <td>AksCoins :
                                        {
                                            (customerDetails?.loyalty > maxLoyaltyUsage && loyaltyDiscount != 0) &&
                                            <>
                                                <span className='text-success'>You can use ₹{loyaltyDiscount} Akscoins for this order</span>
                                            </>
                                        }
                                    </td>
                                    <td className="text-end cart-tax">{loyaltyDiscount > 0 ? `- ₹${loyaltyDiscount}` : `₹${loyaltyDiscount}`}</td>
                                </tr>
                                <tr>
                                    <td>Shipping Charge :</td>
                                    <td className="text-end cart-shipping">{shippingChargeVar}</td>
                                </tr>
                                <tr className=" bg-grays">
                                    <th><strong>Total :</strong></th>
                                    <td className="text-end">
                                        <span className="fw-semibold cart-total">
                                            ₹{getSubTotalAmnt()}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={`modal fade voucher_modal ${showModal ? "show d-block" : ""}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
                <div className="voucher_pop modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/* <div className="modal-header">
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div> */}
                        <div className="modal-body">
                            <div className="text-center">
                                <img className="m-auto" width={"250px"} src={applycoupan} alt="icon-gif" />
                                <h2 className="mb-0 mt-3" style={{ fontSize: "24px", margin: "0px" }}>
                                    Coupon Applied
                                </h2>
                                <p className='mt-2'>Congratulations! You've saved <strong>₹{savingAmnt()}</strong> on your first order.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default OrderSummary