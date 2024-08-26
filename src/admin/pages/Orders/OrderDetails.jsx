import React, { useEffect, useState } from 'react'
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { Link, useParams } from 'react-router-dom';
import { getStatusColor, imgBaseURL, stringToArray } from '../../../utility/Utility';
import { useFrontDataContext } from '../../../context/FrontContextProvider';

const OrderDetails = () => {
    const { products } = useFrontDataContext()

    const [loading, setLoading] = useState(false)
    const { order_id } = useParams()
    const [orderDetails, setOrderDetails] = useState(null)
    const [shippingStatus, setShippingStatus] = useState(false)
    useEffect(() => {
        getOrderDetailsFun()
    }, [])

    const getOrderDetailsFun = async () => {
        setLoading(true)
        try {
            const res = await APICALL(`/v1/get-order-details/${order_id}`);
            if (res?.status) {
                console.log(res)
                setOrderDetails(res?.data)
                setShippingStatus(res?.shippingStatus)
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
    const commoProducts = (product_ids) => {
        if (product_ids) {
            const idsss = stringToArray(product_ids);
            const filteredProducts = products.filter(product => idsss.includes(product.id));
            return filteredProducts
        }
    }

    const calculateTotalPrice = (orderProducts) => {
        if (!orderProducts || orderProducts.length === 0) {
            return 0;
        }
        return orderProducts.reduce((total, product) => total + parseInt(product.product_price, 10) * product?.qnt, 0);
    };

    const [cancelLoader, setCancelLoader] = useState(false)
    const cancelOrder = async () => {
        setCancelLoader(true)
        const params = { order_id: orderDetails?.id }
        try {
            const res = await APICALL(`/v1/cancel-order`, 'post', params);
            if (res?.status) {
                getOrderDetailsFun()
            } else {
                setCancelLoader(false)
            }
        } catch (error) {
            setCancelLoader(false)
        }
    }

    console.log("orderDetails", orderDetails)

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <div className="d-flex flex-column justify-content-center gap-2 gap-sm-0">
                            <h5 className="mb-1 mt-3 d-flex flex-wrap gap-2 align-items-end">Order #{orderDetails?.id}
                                {/* <span className="badge bg-label-success">Paid</span> <span className="badge bg-label-info">Ready to Pickup</span> */}
                                <span style={{ color: getStatusColor(orderDetails?.order_status)?.color, background: getStatusColor(orderDetails?.order_status)?.bg }}
                                    className={`btn btn-sm text-uppercase`}>
                                    Order - {orderDetails?.order_status}
                                </span>
                            </h5>
                            <p className="text-body">{timeAgo(orderDetails?.created_at)}</p>
                        </div>
                        <div className="d-flex align-content-center text-end flex-wrap gap-2">
                            {
                                (!orderDetails?.shipment_id && orderDetails?.order_status == "pending") &&
                                <button type='button' className="btn btn-primary" onClick={() => cancelOrder()}> {cancelLoader ? "Wait..." : "Cancel Order"} </button>
                            }
                            {
                                (orderDetails?.order_status !== "Cancelled" && orderDetails?.order_status !== "failure")  &&
                                <>
                                    {shippingStatus ?
                                        <>
                                            <div>
                                                <button className="btn btn-primary" disabled>Shipping Now</button>
                                                <p className='text-success'>Shippement is completed </p>
                                            </div>
                                        </>
                                        :
                                        <Link to={`/admin/shipping-now/${orderDetails?.id}`} className="btn btn-primary">Shipping Now</Link>}
                                </>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Order details</h5>
                                </div>
                                <div className="card-datatable table-responsive global_table_cs">
                                    <table className="datatables-order-details table">
                                        <thead>
                                            <tr>
                                                <th className="w-50">products</th>
                                                <th className="w-25">price</th>
                                                <th className="w-25">qty</th>
                                                <th>total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orderDetails?.order_products?.length > 0 ?
                                                    <>
                                                        {
                                                            orderDetails?.order_products?.map((item, i) => (
                                                                <tr>
                                                                    <td>
                                                                        <span className='d-flex align-items-center' style={{gap:'20px'}}> <img style={{width:'50px', height:'50px'}} src={imgBaseURL() + item?.product?.cover} alt="" /> {item?.product_name}</span>
                                                                        {
                                                                            item?.product_subscription &&
                                                                            <p className="subscription_plan_label"> Subscription Plan : <span className="checkmark"></span>{item?.product_subscription?.days} Days ₹{item?.product_subscription?.sale_price} @{item?.product_subscription?.discount}% off</p>
                                                                        }
                                                                        <ol className="bundle-orders">
                                                                            {
                                                                                commoProducts(item.product.product_bundle?.product_items_id)?.length > 0 &&
                                                                                <>
                                                                                    {
                                                                                        commoProducts(item.product.product_bundle?.product_items_id)?.map((bundle_pro, i) => (
                                                                                            <>
                                                                                                <li className='d-flex mt-2'>
                                                                                                    <span className='fw-bold'>{i + 1}</span>
                                                                                                    <img style={{ height: '40px', width: '40px' }} src={imgBaseURL() + bundle_pro.cover} alt="bundle Cover" />
                                                                                                    <span>{bundle_pro?.name}</span>
                                                                                                </li>
                                                                                            </>
                                                                                        ))
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </ol>
                                                                    </td>
                                                                    <td className="fw-medium">₹{item?.product_price}</td>
                                                                    <td className="fw-medium">{item?.qnt}</td>
                                                                    <td className="fw-medium">₹{parseInt(item?.product_price) * parseInt(item?.qnt)}</td>
                                                                </tr>

                                                                
                                                                
                                                            ))
                                                        }
                                                    </>
                                                    :
                                                    <> 
                                                  
                                                    </>
                                            }
                                        </tbody>

                                    </table>
                                    <div className="d-flex justify-content-end align-items-center m-3 mb-2 p-1">
                                        <div className="order-calculations">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="">Subtotal:</span>
                                                <h6 className="mb-0">₹{calculateTotalPrice(orderDetails?.order_products)}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="">Discount:</span>
                                                <h6 className="mb-0"> {parseInt(orderDetails?.discounts) > 0 ? `- ₹${orderDetails?.discounts}` : `₹${orderDetails?.discounts}`} </h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="">AksCoins:</span>
                                                <h6 className="mb-0"> {parseInt(orderDetails?.loyalty_discounts) > 0 ? `- ₹${orderDetails?.loyalty_discounts}` : `₹${orderDetails?.loyalty_discounts}`} </h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2" style={{gap:'55px'}}>
                                                <span className="">Shipping Charge:</span>
                                                <h6 className="mb-0"> {parseInt(orderDetails?.total_shipping) > 0 ? `+ ₹${orderDetails?.total_shipping}` : `₹${orderDetails?.total_shipping}`} </h6>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <h6 className=" mb-0">Total:</h6>
                                                <h6 className="mb-0">{orderDetails?.total_amount}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="card mb-4">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Shipping activity</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="timeline pb-0 mb-0 px-2">
                                        <li className="timeline-item timeline-item-transparent border-primary">
                                            <span className="timeline-point timeline-point-primary" />
                                            <div className="timeline-event">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Order was placed (Order ID:
                                                        #32543)</h6>
                                                    <span className="">Tuesday 11:29 AM</span>
                                                </div>
                                                <p className="mt-2">Your order has been placed
                                                    successfully</p>
                                            </div>
                                        </li>
                                        <li className="timeline-item timeline-item-transparent border-primary">
                                            <span className="timeline-point timeline-point-primary" />
                                            <div className="timeline-event">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Pick-up</h6>
                                                    <span className="">Wednesday 11:29 AM</span>
                                                </div>
                                                <p className="mt-2">Pick-up scheduled with courier</p>
                                            </div>
                                        </li>
                                        <li className="timeline-item timeline-item-transparent border-primary">
                                            <span className="timeline-point timeline-point-primary" />
                                            <div className="timeline-event">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Dispatched</h6>
                                                    <span className="">Thursday 11:29 AM</span>
                                                </div>
                                                <p className="mt-2">Item has been picked up by
                                                    courier</p>
                                            </div>
                                        </li>
                                        <li className="timeline-item timeline-item-transparent border-primary">
                                            <span className="timeline-point timeline-point-primary" />
                                            <div className="timeline-event">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Package arrived</h6>
                                                    <span className="">Saturday 15:20 AM</span>
                                                </div>
                                                <p className="mt-2">Package arrived at an Amazon
                                                    facility, NY</p>
                                            </div>
                                        </li>
                                        <li className="timeline-item timeline-item-transparent border-left-dashed">
                                            <span className="timeline-point timeline-point-primary" />
                                            <div className="timeline-event">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Dispatched for delivery</h6>
                                                    <span className="">Today 14:12 PM</span>
                                                </div>
                                                <p className="mt-2">Package has left an Amazon facility,
                                                    NY</p>
                                            </div>
                                        </li>
                                        <li className="timeline-item timeline-item-transparent border-transparent pb-0">
                                            <span className="timeline-point timeline-point-secondary" />
                                            <div className="timeline-event pb-0">
                                                <div className="timeline-header">
                                                    <h6 className="mb-0">Delivery</h6>
                                                </div>
                                                <p className="mt-2 mb-0">Package will be delivered by
                                                    tomorrow</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
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
                                                <img src="../../assets/img/avatars/1.png" alt="Avatar" className="rounded-circle" />
                                            </div>
                                            <div className="d-flex flex-column">
                                                <Link to={`/admin/customer-details/${orderDetails?.customer?.id}`} className="text-body text-nowrap">
                                                    <h6 className="mb-0">{orderDetails?.customer?.name}</h6>
                                                </Link>
                                                <small className="">Customer ID: #{orderDetails?.customer?.id}</small></div>
                                        </div>
                                        {/* <div className="d-flex justify-content-start align-items-center mb-4">
                                            <span className="avatar rounded-circle bg-label-success me-2 d-flex align-items-center justify-content-center"><i className="ti ti-shopping-cart ti-sm" /></span>
                                            <h6 className="text-body text-nowrap mb-0">12 Orders</h6>
                                        </div> */}
                                        <div className="d-flex justify-content-between">
                                            <h6>Contact info</h6>
                                        </div>
                                        <p className=" mb-1">Email: {orderDetails?.customer?.email}</p>
                                        <p className=" mb-0">Mobile: {orderDetails?.customer?.phone}</p>
                                    </div>
                                </div>

                                {
                                    orderDetails?.address &&
                                    <div className="card mb-4">
                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0 fw-bold">{orderDetails?.address?.type}</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0">{orderDetails?.address?.address}</p>
                                        </div>
                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0">State: {orderDetails?.address?.state}</h6>
                                            <h6 className="card-title m-0">City: {orderDetails?.address?.city}</h6>
                                        </div>

                                        <div className="card-header d-flex justify-content-between">
                                            <h6 className="card-title m-0 fw-bold">Contact Info</h6>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0">{orderDetails?.address?.phone}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </>


                    </div>
                </div>
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>

            <Spinner sppiner={loading} />
        </>
    )
}

export { OrderDetails }