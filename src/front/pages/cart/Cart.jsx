import React, { useState } from "react";
import productimg from "../../../assets/img/product.png";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { imgBaseURL } from "../../../utility/Utility";

const Cart = () => {
  const { cartData } = useFrontDataContext()

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const formatQuantity = (quantity) => {
    return quantity < 10 ? `0${quantity}` : quantity;
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="alert alert-danger text-center text-capitalize mb-4 fs-14">
            save up to <b>30%</b> to <b>40%</b> off omg! just look at the{" "}
            <b>great deals</b>!
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="d-flex align-items-center mb-4">
          <h5 class="mb-0 flex-grow-1 fw-medium">
            There are <span class="fw-bold product-count">{cartData.length}</span>{" "}
            products in your cart
          </h5>
          <div class="flex-shrink-0">
            <a href="#!" class="text-decoration-underline">
              Clear Cart
            </a>
          </div>
        </div>
        {
          cartData?.length > 0 ?
            cartData?.map((item, i) => (
              <div class="card product mb-3">
                <div class="card-body">
                  <div class="row gy-3">
                    <div class="col-sm-auto">
                      <div class="avatar-lg h-100">
                        <div class="avatar-title rounded py-3">
                          <img src={imgBaseURL() + item?.product?.cover} alt="" class="avatar-md" />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm">
                      <a href="#!">
                        <h5 class="fs-16 lh-base mb-1">{item?.product?.name}</h5>
                      </a>
                      <ul class="list-inline text-muted fs-13 mb-3">
                        <span> SKU : {item?.product?.sku}</span>
                        {/* <li class="list-inline-item">
                          Color : <span class="fw-medium">Red</span>
                        </li>
                        <li class="list-inline-item">
                          Size : <span class="fw-medium">M</span>
                        </li> */}
                      </ul>
                      <div className="product-button mb-0 mt-2">
                        <div className="input-step">
                          <button type="button" className="minus" onClick={handleDecrement}>–</button>
                          <input type="text" className="product-quantity1" value={item?.qnt} readOnly />
                          <button type="button" className="plus" onClick={handleIncrement}>+</button>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-auto">
                      <div class="text-lg-end">
                        <p class="text-muted mb-1 fs-12">Item Price:</p>
                        <h5 class="fs-16">
                          ₹<span class="product-price">{item?.product?.sale_price}</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer pt-2">
                  <div class="row align-items-center gy-3">
                    <div class="col-sm">
                      <div class="d-flex flex-wrap my-n1">
                        <div>
                          <a
                            href="#!"
                            class="d-block p-1 px-2"
                            data-bs-toggle="modal"
                            data-bs-target="#removeItemModal"
                          >
                            <i class="fa fa-trash  me-1"></i>{" "}
                            Remove
                          </a>
                        </div>
                        <div>
                          <a href="#!" class="d-block p-1 px-2">
                            <i class="fa fa-heart  me-1"></i>{" "}
                            Add Wishlist
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-auto">
                      <div class="d-flex align-items-center gap-2 text-muted">
                        <div>Total :</div>
                        <h5 class="fs-14 mb-0">
                        ₹<span class="product-line-price">{item?.product?.sale_price * parseInt(item.qnt)}</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
            :
            <>
              <h5>There are no product added on your cart.</h5>
            </>
        }
      </div>
    </>
  );
};

export default Cart;
