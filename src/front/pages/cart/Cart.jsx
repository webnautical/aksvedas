import React, { useState } from "react";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { authCustomer, imgBaseURL } from "../../../utility/Utility";
import { Link } from "react-router-dom";
import emptycart from "../../../assets/img/empty-cart.webp";

const Cart = () => {
  const { cartData, removeCartItemFun, addProductInWishlistFun } = useFrontDataContext()

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="alert alert-danger text-center text-capitalize mb-3 fs-14">
            save up to <b>30%</b> to <b>40%</b> off omg! just look at the{" "}
            <b>great deals</b>!
          </div>
        </div>
      </div>

        <div class="d-flex align-items-center mb-4">
          <h5 class="mb-0 flex-grow-1 fw-medium">
            There are <span class="fw-bold product-count">{cartData.length}</span>{" "}
            products in your cart
          </h5>
          {
            cartData?.length > 1 &&
            <div class="flex-shrink-0">
              <button type="button" className="btn-normals w-xs" onClick={() => removeCartItemFun(`C_${authCustomer()?.id}`)}>
                Clear Cart
              </button>
            </div>
          }
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
                      <ul class="list-inline fs-13 mb-3">
                        <span> SKU : <span style={{color: '#E0A11C'}}>{item?.product?.sku}</span></span>
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
                        <p class=" mb-1 fs-12">Item Price:</p>
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
                          <Link className="d-block" to={'#'} onClick={() => removeCartItemFun(item?.id)}>
                            <i class="fa fa-trash  me-1"></i>{" "}
                            Remove
                          </Link>
                        </div>
                        <div>

                          <Link className="d-block" to={'#'} onClick={() => addProductInWishlistFun(item?.product?.id)}>
                            <i class="fa fa-heart  me-1"></i>{" "}
                            Add Wishlist
                          </Link>

                        </div>
                      </div>
                    </div>
                    <div class="col-sm-auto">
                      <div class="d-flex align-items-center gap-2">
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
              <div class="product-item-inner">
                <img src={emptycart} alt="empty-cart" width={300} height={300} />
                <h4>There are no product added on your cart.</h4>
              </div>
            </>
        }
    </>
  );
};

export default Cart;
