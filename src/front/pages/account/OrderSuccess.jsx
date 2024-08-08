import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import ordersucssefull from "../../../assets/img/ordersucssefull.png";
import { APICALL } from "../../../utility/api/api";
import { formatdedDate } from "../../../utility/Utility";

const OrderSuccess = () => {
  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    getOrderDetailsFun();
  }, [order_id]);

  const getOrderDetailsFun = async () => {
    try {
      const res = await APICALL(`/v1/get-order-details/${order_id}`);
      if (res?.status) {
        setOrderDetails(res?.data);
      } else {
        setOrderDetails(null);
      }
    } catch (error) {
      setOrderDetails(null);
    }
  };


  return (
    <>
      <section className="cart-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8 mx-auto">
              <div className="card mb-4 fw-bold">
                <div className="modal-body text-start p-4">
                  <div className="text-center">
                    <img
                      src={ordersucssefull}
                      className="mx-auto mb-4 w-35"
                      alt=""
                    />
                    <h3>
                      {" "}
                      <strong> Your Order ID Number: #{order_id}</strong>
                    </h3>
                    <h4 className="mb-4">
                      We received your purchase request, we'll be in touch
                      shortly!
                    </h4>
                  </div>
                  <hr
                    className="mt-2 mb-4"
                    style={{
                      height: 0,
                      backgroundColor: "transparent",
                      opacity: ".75",
                      borderTop: "2px dashed #9e9e9e",
                    }}
                  />
                  <div className="d-flex justify-content-between ">
                    <p>Date</p>
                    <p className="">{formatdedDate(orderDetails?.created_at)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Order Status</p>
                    <p className=" text-uppercase">
                      {orderDetails?.order_status}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Payment Method</p>
                    <p className=" text-uppercase">
                      {orderDetails?.payment_method}
                    </p>
                  </div>
                  <hr
                    className="mt-2 mb-4"
                    style={{
                      height: 0,
                      backgroundColor: "transparent",
                      opacity: ".75",
                      borderTop: "2px dashed #9e9e9e",
                    }}
                  />
                  {orderDetails?.order_products?.map((item) => (
                    <div className="d-flex justify-content-between">
                      <p className="fw-bold mb-0">
                        {item?.product_name}(Qty:{item?.qnt})
                      </p>
                      <p className=" mb-0">₹{item?.product_price}</p>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between">
                    <p className="mb-0">AksCoins:</p>
                    <p className="mb-0">₹{orderDetails?.loyalty_discounts}</p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="mb-0">Shipping</p>
                    <p className="mb-0">₹{orderDetails?.total_shipping}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mb-0">Discount</p>
                    <p className="mb-0">₹{orderDetails?.discounts}</p>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Total</p>
                    <p className="fw-bold">₹{orderDetails?.total_amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default OrderSuccess;
