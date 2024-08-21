import React, { useEffect, useState } from "react";
import {  Link, useParams } from "react-router-dom";
import orderfailed from "../../../assets/img/orderfailed.png";
import { APICALL } from "../../../utility/api/api";
import { formatdedDate } from "../../../utility/Utility";

const OrderFailure = () => {
  const { tracking_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    getOrderDetailsFun();
  }, [tracking_id]);

  const getOrderDetailsFun = async () => {
    try {
      const res = await APICALL(`/get-transaction`, 'post', {tracking_id});
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
                      src={orderfailed}
                      className="mx-auto mb-4 w-35"
                      alt=""
                    />
                    <h3>
                      <strong> Your Tracking Number: #{tracking_id}</strong>
                    </h3>
                    <h4 className="mb-3">Unfortunately, we couldn't process your order at this time. Please try again later or contact our support team for assistance.</h4>
                    <Link to={'/contact-us'}>Support Team</Link>
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
                  <div className="d-flex justify-content-between">
                    <p>Billing Name</p>
                    <p className=" text-uppercase">
                      {orderDetails?.billing_name}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between ">
                    <p>Date</p>
                    <p className="">{formatdedDate(orderDetails?.created_at)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Order Status</p>
                    <p className="text-uppercase text-danger">
                      Failure
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Amount</p>
                    <p className=" text-uppercase">
                    ₹{orderDetails?.amount}
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
                </div>

                <div className="text-center">
                  <h6>Need assistance with your order? <Link to={'/contact-us'} target="_blank">Click here for help.</Link></h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default OrderFailure;
