import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ordersucssefull from "../../../assets/img/ordersucssefull.png";
import firework from "../../../assets/img/youwon.gif";
import akscoins from "../../../assets/img/akscoin.png";
import { APICALL } from "../../../utility/api/api";
import { formatdedDate } from "../../../utility/Utility";

const OrderSuccess = () => {
  // const { order_id } = useParams();

  const locationData = useLocation()
  const queryParams = new URLSearchParams(locationData.search);
  const orderId = queryParams.get('order_id');

  const order_id = locationData?.state ? locationData?.state?.order_id : orderId
  const [orderDetails, setOrderDetails] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getOrderDetailsFun();
  }, [order_id]);

  const getOrderDetailsFun = async () => {
    try {
      const res = await APICALL(`/v1/get-order-details/${order_id}`);
      if (res?.status) {
        setOpen(true);
        setOrderDetails(res?.data);
      } else {
        setOrderDetails(null);
      }
    } catch (error) {
      setOrderDetails(null);
    }
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 300000);
      return () => clearTimeout(timer);
    }
  }, [open]);


  useEffect(() => {
    // Add Google Analytics script if not already added
    if (!window.gtag) {
      const gtagScript = document.createElement("script");
      gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-16785777896";
      gtagScript.async = true;
      document.head.appendChild(gtagScript);

      const gtagConfig = document.createElement("script");
      gtagConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-16785777896');
      `;
      document.head.appendChild(gtagConfig);
    }

    if (orderDetails) {
      // Add gtag conversion event
      const gtagScript = document.createElement("script");
      gtagScript.innerHTML = `
        gtag('event', 'conversion', {
          'send_to': 'AW-16785777896/l9U-CIS7gZcaEOjJisQ-',
          'value': ${orderDetails?.total_amount || 1.0},
          'currency': 'INR',
          'transaction_id': '${order_id || ""}'
        });
      `;
      document.head.appendChild(gtagScript);

      // Add dataLayer event for purchase
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'purchase',
        'ecommerce': {
          'customer_email': orderDetails?.customer?.email,
          'transaction_id': order_id || "", // Unique order ID
          'value': orderDetails?.total_amount || 1.0, // Order total
          'currency': 'INR',
          'items_category': orderDetails?.order_products?.[0]?.product_category || "",
          'items':
            orderDetails?.order_products?.map(item => ({
              item_name: item.product_name,
              item_category: item.product_category || "Combo",
              item_variant: item.product_variant || "Default",
              price: item.product_price,
              quantity: item.qnt,
            }))
        }
      });

      return () => {
        document.head.removeChild(gtagScript);
      };
    }
  }, [order_id, orderDetails]);


  // console.log("orderDetails",orderDetails)


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
                    <h5 className="grneen-text">
                      <span>Congratulations!!</span> <br /> You earn{" "}
                      {orderDetails?.earned_loyalty_discount} akscoins for this
                      order.{" "}
                    </h5>
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
                    <p className="">
                      {formatdedDate(orderDetails?.created_at)}
                    </p>
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
                    <p className="mb-0">
                      {parseInt(orderDetails?.loyalty_discounts) > 0
                        ? `- ₹${orderDetails?.loyalty_discounts}`
                        : `₹${orderDetails?.loyalty_discounts}`}{" "}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="mb-0">Shipping</p>
                    <p className="mb-0">
                      {parseInt(orderDetails?.total_shipping) > 0
                        ? `+ ₹${orderDetails?.total_shipping}`
                        : `₹${orderDetails?.total_shipping}`}{" "}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mb-0">Discount</p>
                    <p className="mb-0">
                      {parseInt(orderDetails?.discounts) > 0
                        ? `- ₹${orderDetails?.discounts}`
                        : `₹${orderDetails?.discounts}`}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Total</p>
                    <p className="fw-bold">₹{orderDetails?.total_amount}</p>
                  </div>
                </div>

                <div className="text-center">
                  <h6>
                    Need assistance with your order?{" "}
                    <Link to={"/contact-us"} target="_blank">
                      Click here for help.
                    </Link>
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-12"></div>
          </div>
        </div>
      </section>
      {open && (
        <div
          class="  modal fade show cointmodalshow"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div class=" modal-dialog modal-dialog-centered  modal-xl">
            <div class="order_succes modal-content">
              <div class="modal-header p-0">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                ></button>
              </div>
              <div class="modal-body text-center p-0">
                <div className="main_gif_box">
                  <img src={firework} alt="" className="w-100" />
                  <div className="main_bb">
                    <span className="grneen-text" style={{ fontSize: '22px', fontWeight: '600' }}>Earned Akscoin</span>
                    <h1 className="youerocoin">

                      {orderDetails?.earned_loyalty_discount}
                    </h1>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSuccess;