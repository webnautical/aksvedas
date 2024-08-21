import { Breadcrumbs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import siderbg from "../../../assets/img/bg-about.png";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { APICALL } from "../../../utility/api/api";
import { authCustomer, formatdedDate, getStatusColor, imgBaseURL, stringToArray, toastifyError } from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import FrontLoader from "../../../components/front/FrontLoader";
import ConfirmModal from "../../../components/ConfirmModal";
import PDFButton from "../../../components/PDFButton";
import ReasonModal from "./ReasonModal";
import { addToCartRepeater } from "../../../utility/api/RepeaterAPI";
const OrderDetails = () => {
  const { getWishlistFun, getCartFun } = useFrontDataContext();
  const [loading, setLoading] = useState(false);
  const { products } = useFrontDataContext();
  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    getOrderDetailsFun();
  }, []);

  const getOrderDetailsFun = async () => {
    setLoading(true)
    try {
      const res = await APICALL(`/v1/get-order-details/${order_id}`);
      if (res?.status) {
        setOrderDetails(res?.data);
        setLoading(false)
      } else {
        setOrderDetails(null);
        setLoading(false)
      }
    } catch (error) {
      setOrderDetails(null);
      setLoading(false)
    }
  };

  const commoProducts = (product_ids) => {
    if (product_ids) {
      const idsss = stringToArray(product_ids);
      const filteredProducts = products.filter((product) =>
        idsss.includes(product.id)
      );
      return filteredProducts;
    }
  };


  const [cancelOrderStatus, setCancelOrderStatus] = useState({
    modal: false,
    resType: false,
  })
  const cancelOrder = async () => {
    setSubmitLoading(true)
    const params = { order_id: orderDetails?.id }
    try {
      const res = await APICALL(`/v1/cancel-order`, 'post', params);
      if (res?.status) {
        setOrderDetails({ ...orderDetails, 'order_status': res?.data?.order_status })
        setSubmitLoading(false)
        setCancelOrderStatus({ ...cancelOrderStatus, 'modal': true, 'resType': true })
      } else {
        setSubmitLoading(false)
        setCancelOrderStatus({ ...cancelOrderStatus, 'modal': true, 'resType': false })
      }
    } catch (error) {
      setSubmitLoading(false)
      setCancelOrderStatus({ ...cancelOrderStatus, 'modal': true, 'resType': false })
    }
  }

  const calculateTotalPrice = (orderProducts) => {
    if (!orderProducts || orderProducts.length === 0) {
      return 0;
    }
    return orderProducts.reduce((total, product) => total + parseInt(product.product_price, 10) * product?.qnt, 0);
  };


  const reTryOrder = () => {
    orderDetails?.order_products?.map(item => {
      const param = { product_id: item?.product_id, qnt: 1 };
      return addToCartRepeater(param, getWishlistFun, getCartFun, 1);
    })
    navigate('/checkout')
  }

  console.log("orderDetails",orderDetails)

  return (
    <>

      {loading && <FrontLoader />}
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
            <Link underline="hover" to="/">
              Home
            </Link>
            <Typography>Order Details</Typography>
          </Breadcrumbs>
          <h1>Order Details</h1>
        </div>
      </div>

      <section className="cart-section">
        <div className="container">
          <div className="row">

            <div className="col-12 col-lg-8">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between">
                    <h6 className="card-title m-0 fw-bold">
                      #OrderID : {orderDetails?.id}
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <h6 className="card-title m-0">
                          Order Date: {formatdedDate(orderDetails?.created_at)}
                        </h6>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <h6 className="card-title m-0">
                          <span className="btn btn-sm text-uppercase me-2" style={{ background: "#ddad67", color: '#fff' }}
                          >Order - {orderDetails?.order_status}</span>

                          {!orderDetails?.shipment_id && orderDetails?.order_status == "pending" ?
                            <button className="btn btn-sm btn-danger text-uppercase me-2" onClick={() => setModalOpen(true)}>Cancel Order</button>
                            : <></>}

                          {
                            orderDetails?.order_status !== "Cancelled" && orderDetails?.order_status !== "failure" &&
                            <PDFButton order_id={orderDetails?.id} btnName={"Download Invoice"} />
                          }
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title m-0">Order details</h5>
                </div>
                <div className="card-datatable table-responsive">
                  <table className="datatables-order-details table border-top">
                    <thead>
                      <tr>
                        <th className="w-50">products</th>
                        <th className="w-25">price</th>
                        <th className="w-25">qty</th>
                        <th>total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails?.order_products?.length > 0 ? (
                        <>
                          {orderDetails?.order_products?.map((item, i) => (
                            <tr>
                              <td className="w-100">
                                <Link to={`/product-detail/${item?.product?.slug}`}>
                                  <span className="main_product_tittle w-100 d-block">{item?.product_name}</span>
                                </Link>
                                {
                                  item?.product_subscription &&
                                  <p className="subscription_plan_label"> Subscription Plan : <span className="checkmark"></span>{item?.product_subscription?.days} Days ₹{item?.product_subscription?.sale_price} @{item?.product_subscription?.discount}% off</p>
                                }
                                <ol className="bundle-orders p-0 w-100">
                                  {commoProducts(
                                    item.product.product_bundle
                                      ?.product_items_id
                                  )?.length > 0 && (
                                      <>
                                        {commoProducts(
                                          item.product.product_bundle
                                            ?.product_items_id
                                        )?.map((bundle_pro, i) => (
                                          <>
                                            <li className="d-flex mt-2 w-100">
                                              <span className="w-100">{bundle_pro?.name}</span>
                                            </li>
                                          </>
                                        ))}
                                      </>
                                    )}
                                </ol>
                              </td>
                              <td className="fw-medium">
                                ₹{item?.product_price}
                              </td>
                              <td className="fw-medium">{item?.qnt}</td>
                              <td className="fw-medium">
                                ₹
                                {parseInt(item?.product_price) *
                                  parseInt(item?.qnt)}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <> </>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-end align-items-center m-3 mb-2 p-1">
                    <div className="order-calculations">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="w-px-100">Subtotal:</span>
                        <h6 className="mb-0">₹{calculateTotalPrice(orderDetails?.order_products)}</h6>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="w-px-100">Discount:</span>
                        <h6 className="mb-0"> {parseInt(orderDetails?.discounts) > 0 ? `- ₹${orderDetails?.discounts}` : `₹${orderDetails?.discounts}`} </h6>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="w-px-100">AksCoins:</span>
                        <h6 className="mb-0"> {parseInt(orderDetails?.loyalty_discounts) > 0 ? `- ₹${orderDetails?.loyalty_discounts}` : `₹${orderDetails?.loyalty_discounts}`} </h6>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="w-px-100">Shipping Charge:</span>
                        <h6 className="mb-0"> {parseInt(orderDetails?.total_shipping) > 0 ? `+ ₹${orderDetails?.total_shipping}` : `₹${orderDetails?.total_shipping}`} </h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <h6 className="w-px-100 mb-0">Total:</h6>
                        <h6 className="mb-0">{orderDetails?.total_amount}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {orderDetails?.address && (
              <>
                <div className="col-12 col-lg-4">
                  <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                      <h6 className="card-title m-0 fw-bold">
                        {orderDetails?.address?.type}
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{orderDetails?.address?.address}</p>
                    </div>
                    <div className="card-header d-flex justify-content-between">
                      <h6 className="card-title m-0">
                        State: {orderDetails?.address?.state}
                      </h6>
                      <h6 className="card-title m-0">
                        City: {orderDetails?.address?.city}
                      </h6>
                    </div>

                    <div className="card-header d-flex justify-content-between">
                      <h6 className="card-title m-0 fw-bold">Contact Info</h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{orderDetails?.address?.phone}</p>
                    </div>
                  </div>

                   {
                    orderDetails?.order_status === "failure" &&
                  <button className="btn btn-primary me-2" onClick={() => reTryOrder()}>Re-try Order</button>
                   }
                  <ReasonModal order_id={orderDetails?.id} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {
        !cancelOrderStatus?.modal ?
          <ConfirmModal
            msg={
              <>
                <h3 className="mt-2 mb-1">Are you sure ?</h3>
                <h5 className="my-0">You want to cancel this order</h5>
              </>}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            funCall={cancelOrder}
            btn1={"Yes"}
            btn2={"NO"}
            submitLoading={submitLoading}
            icon={true}
          />
          :
          <ConfirmModal
            msg={
              <>
                {
                  cancelOrderStatus?.resType ?
                    <h3 className="mt-2 mb-1 text-success text-uppercase">Success</h3>
                    :
                    <h3 className="mt-2 mb-1 text-danger text-uppercase">Alert</h3>
                }
                {
                  cancelOrderStatus?.resType ?
                    <h5 className="my-0 text-success">Your Order is Cancel Succesfully !!</h5>
                    :
                    <h5 className="my-0 text-danger">We are Unable to cancel your request !!</h5>
                }
              </>}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            icon={!cancelOrderStatus?.resType}
            cancelOrderStatus={cancelOrderStatus}
            setCancelOrderStatus={setCancelOrderStatus}
          />
      }
    </>
  );
};

export default OrderDetails;
