import React, { useEffect, useState } from 'react'
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toastifySuccess } from '../../../utility/Utility';
const ShippingNow = () => {
    const [loading, setLoading] = useState(false)
    const { order_id } = useParams()
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState(null)
    const [productItems, setProductItesm] = useState([])

    const [error, setError] = useState(null)
    useEffect(() => {
        getOrderDetailsFun()
    }, [])

    const getOrderDetailsFun = async () => {
        setLoading(true)
        try {
            const res = await APICALL(`/v1/get-order-details/${order_id}`);
            if (res?.status) {
                setOrderDetails(res?.data)
                const items = res?.data?.order_products.map((item) => ({
                    "name": item?.product?.name,
                    "sku": item?.product?.sku,
                    "units": item?.qnt,
                    "selling_price": item?.product?.sale_price,
                    "discount": "",
                    "tax": "",
                }));
                setProductItesm(items)
                setLoading(false)
            } else {
                setOrderDetails(null)
                setLoading(false)
            }
        } catch (error) {
            setOrderDetails(null)
            setLoading(false)
        }
    }

    const [formData, setFormData] = useState({
        "order_id": "",
        "order_date": "",
        "pickup_location": "",
        "billing_customer_name": "",
        "billing_last_name": "",
        "billing_address": "",
        "billing_address_2": "",
        "billing_isd_code": "",
        "billing_city": "",
        "billing_pincode": "",
        "billing_state": "",
        "billing_country": "",
        "billing_email": "",
        "billing_phone": "",
        "shipping_is_billing": 1,
        "shipping_customer_name": "",
        "shipping_address": "",
        "shipping_city": "",
        "shipping_pincode": "",
        "shipping_country": "",
        "shipping_state": "",
        "shipping_phone": "",
        "order_items": [
            {
                "name": "",
                "sku": "",
                "units": "",
                "selling_price": "",
                "discount": "",
                "tax": "",
            }
        ],
        "payment_method": "",
        "shipping_charges": "",
        "transaction_charges": "",
        "total_discount": "",
        "sub_total": "",
        "length": "",
        "breadth": "",
        "height": "",
        "weight": "",
        "order_type": ""
    });

    useEffect(() => {
        if (orderDetails) {
            setFormData({
                ...formData,
                "order_id": order_id,
                "order_date": orderDetails?.created_at,
                "pickup_location": "HOME",
                "billing_customer_name": orderDetails?.customer?.name,
                "billing_last_name": orderDetails?.customer?.name,
                "billing_address": orderDetails?.address?.address,
                "billing_isd_code": "",
                "billing_city": orderDetails?.address?.city,
                "billing_pincode": orderDetails?.address?.zip,
                "billing_state": orderDetails?.address?.state,
                "billing_country": "India",
                "billing_email": orderDetails?.customer?.email,
                "billing_phone": orderDetails?.address?.phone,
                "shipping_is_billing": 1,
                "shipping_customer_name": "",
                "shipping_address": "",
                "shipping_city": "",
                "shipping_pincode": "",
                "shipping_country": "",
                "shipping_state": "",
                "shipping_phone": "",
                "order_items": productItems,
                "payment_method": orderDetails?.payment_method == "COD" ? "COD" : "Prepaid",
                "shipping_charges": "",
                "transaction_charges": "",
                "total_discount": "",
                "sub_total": orderDetails?.total_amount,
                "length": 8,
                "breadth": 8,
                "height": 16,
                "weight": 0.1,
                "order_type": ""
            })
        } else {
            setFormData({
                ...formData,
                "order_id": "",
                "order_date": "",
                "pickup_location": "",
                "billing_customer_name": "",
                "billing_last_name": "",
                "billing_address": "",
                "billing_address_2": "",
                "billing_isd_code": "",
                "billing_city": "",
                "billing_pincode": "",
                "billing_state": "",
                "billing_country": "",
                "billing_email": "",
                "billing_phone": "",
                "shipping_is_billing": 1,
                "shipping_customer_name": "",
                "shipping_address": "",
                "shipping_city": "",
                "shipping_pincode": "",
                "shipping_country": "",
                "shipping_state": "",
                "shipping_phone": "",
                "order_items": [
                    {
                        "name": "",
                        "sku": "",
                        "units": "",
                        "selling_price": "",
                        "discount": "",
                        "tax": "",
                    }
                ],
                "payment_method": "",
                "shipping_charges": "",
                "transaction_charges": "",
                "total_discount": "",
                "sub_total": "",
                "length": "",
                "breadth": "",
                "height": "",
                "weight": "",
                "order_type": ""
            })
        }
    }, [orderDetails])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const params = {
            email: "webnauticaldesigner@gmail.com",
            password: "webnauticaldesigner@gmail.com"
        }
        const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', params)
        if (res?.status === 200) {

            // const shipOrder = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', formData, {
            //     headers: {
            //         'Authorization': `Bearer ${res?.data?.token}`
            //     }
            // })
            // console.log("Shipping Response- ", shipOrder)

            const params = { token: res?.data?.token, formData: formData }
            const shipOrder = await APICALL('/v1/shipment', 'post', params)


            if (shipOrder?.order_id) {
                const saveOrderStatus = await APICALL('/v1/save-order-status', 'post', shipOrder)
                if (saveOrderStatus.status) {
                    navigate(`/admin/order-details/${order_id}`)
                    toastifySuccess("shipping Successfully !!")
                    setLoading(false)
                } else {
                    navigate(`/admin/order-details/${order_id}`)
                    toastifySuccess("Shipping Successfully But Order Status Can't we save !!")
                }
            } else {
                const err = { "ERR": [shipOrder?.response?.data?.errors] }
                setError(shipOrder?.response?.data?.errors)
                setLoading(false)
            }

        }
    };

    const [editMode, setEditMode] = useState(false)

    return (
        <>
            <div className="content-wrapper shipping-form">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <div className="d-flex flex-column justify-content-center gap-2 gap-sm-0">
                            <h5 className="mb-1 mt-3 d-flex flex-wrap gap-2 align-items-end">Order #{orderDetails?.id}
                                {/* <span className="badge bg-label-success">Paid</span> <span className="badge bg-label-info">Ready to Pickup</span> */}
                            </h5>
                            <p className="text-body">{timeAgo(orderDetails?.created_at)}</p>
                        </div>
                        <button type="button" className='btn btn-primary' onClick={()=>setEditMode(!editMode)}>Edit</button>

                    </div>

                    <div className="row">
                        <div className="col-12 col-lg-7">
                            <div className="card mb-4 p-2">
                                <div className="card-header">
                                    <h6 className="pb-2 mb-0 text-uppercase" style={{ borderBottom: '1px solid #dbdade73 ' }}>Info</h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className='row g-3'>
                                            <>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">pickup location</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='pickup location'
                                                        name="pickup_location"
                                                        value={formData.pickup_location}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>


                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">order date</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='order date'
                                                        name="order_date"
                                                        value={formData.order_date}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">sub total</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='sub total'
                                                        name="sub_total"
                                                        value={formData.sub_total}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">payment method</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='payment method'
                                                        name="payment_method"
                                                        value={formData.payment_method}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            </>

                                            {/* Billing Info */}
                                            <>
                                                <div className="col-12">
                                                    <h6 className="pb-2 mb-0 text-uppercase" style={{ borderBottom: '1px solid #dbdade73 ' }}>Billing Info</h6>
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing customer name</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing customer name'
                                                        name="billing_customer_name"
                                                        value={formData.billing_customer_name}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>

                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing pincode</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing pincode'
                                                        name="billing_pincode"
                                                        value={formData.billing_pincode}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing country</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing country'
                                                        name="billing_country"
                                                        value={formData.billing_country}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing state</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing state'
                                                        name="billing_state"
                                                        value={formData.billing_state}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing city</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing city'
                                                        name="billing_city"
                                                        value={formData.billing_city}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>

                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing phone</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing phone'
                                                        name="billing_phone"
                                                        value={formData.billing_phone}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <label htmlFor="">billing email</label>
                                                    <input
                                                        className='form-control'
                                                        placeholder='billing email'
                                                        name="billing_email"
                                                        value={formData.billing_email}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-12'>
                                                    <label htmlFor="">Address</label>
                                                    <textarea rows={5}
                                                        className='form-control'
                                                        placeholder='Billing Address'
                                                        name="billing_address"
                                                        value={formData.billing_address}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    >
                                                    </textarea>
                                                </div>
                                            </>



                                            <div className='col-12 text-end'>
                                                <button type="submit" className='btn btn-primary'>Submit</button>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>

                        </div>
                        <>
                            <div className="col-12 col-lg-5">
                                <div className="card mb-4 p-2">
                                    <div className="card-header">
                                        <h6 className="pb-2 mb-0 text-uppercase" style={{ borderBottom: '1px solid #dbdade73 ' }}>Product Info</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            {/* Height */}
                                            <>
                                                <div className="col-12 col-md-6">
                                                    <label htmlFor="height">Height (in cm) - Height must be greater than 0.5 cm</label>
                                                    <input
                                                        className="form-control"
                                                        placeholder="Height"
                                                        name="height"
                                                        value={formData.height}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label htmlFor="weight">Weight (in kg) - Weight must be greater than 0 kg</label>
                                                    <input
                                                        className="form-control"
                                                        placeholder="Weight"
                                                        name="weight"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label htmlFor="length">Length (in cm) - Length must be greater than 0.5 cm</label>
                                                    <input
                                                        className="form-control"
                                                        placeholder="Length"
                                                        name="length"
                                                        value={formData.length}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label htmlFor="breadth">Breadth (in cm) - Breadth must be greater than 0.5 cm</label>
                                                    <input
                                                        className="form-control"
                                                        placeholder="Breadth"
                                                        name="breadth"
                                                        value={formData.breadth}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                </div>

                                {
                                    error &&
                                    <div className="row">
                                        <div className="col-12">
                                            <>
                                                <div className="card mb-4 p-2">
                                                    <div className="card-header">
                                                        <h5 className="pb-2 mb-0 text-uppercase text-danger" style={{ borderBottom: '1px solid #dbdade73 ' }}>Oops! Invalid Data.</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row g-3">
                                                            {error && Object.keys(error).map((field, i) => (
                                                                <div key={field}>
                                                                    <p className='m-0 p-0 fw-bold'>{i + 1}. {field}:</p>
                                                                    {error[field].map((message, index) => (
                                                                        <p key={index} className='m-0 p-0 text-danger'>{message}</p>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                }

                            </div>
                        </>

                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>

            <Spinner sppiner={loading} />
        </>
    )
}

export default ShippingNow