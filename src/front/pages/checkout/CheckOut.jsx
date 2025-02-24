import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  authCustomer,
  imgBaseURL,
  stringToArray,
} from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import emptycart from "../../../assets/img/empty-cart.png";
import { cartQntChange } from "../../../utility/api/RepeaterAPI";
import FrontLoader from "../../../components/front/FrontLoader";

const CheckOut = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const {
    cartData,
    removeCartItemFun,
    addProductInWishlistFun,
    getCartFun,
    products,
  } = useFrontDataContext();


  // useEffect(() => {
  //   if (!authCustomer()?.token) {
  //     navigate('/login')
  //   }
  // }, [])


  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    getCartFun()
  }, [])
  useEffect(() => {
    if (cartData.length > 0) {
      setCartList(cartData);
    }
  }, [cartData]);
  const [loadingPlusId, setLoadingPlusId] = useState(null);
  const [loadingMinusId, setLoadingMinusId] = useState(null);
  console.log("cartList",cartList)
  const handleQntChange = async (qntType, itemId) => {
    if (qntType === 'plus') {
      setLoadingPlusId(itemId);
    } else {
      setLoadingMinusId(itemId);
    }
    const updatedCartItems = cartList.map((item) => {
      if (item.product_id === itemId) {
        let newQuantity;
        if (qntType === "minus") {
          newQuantity = Math.max(1, parseInt(item.qnt) - 1);
        } else {
          newQuantity = Math.min(5, parseInt(item.qnt) + 1);
        }
        if (newQuantity <= 5) {
          const param = { product_id: item.product_id, qnt: newQuantity };
          cartQntChange(param);
        }
        getCartFun()
        return { ...item, qnt: newQuantity };
      }
      return item;
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getCartFun()

    setCartList(updatedCartItems);
    setLoadingPlusId(null);
    setLoadingMinusId(null);
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

  return (
    <>
      {loading && <FrontLoader />}

      <div className="col-xl-12">
        <div class="col-lg-12">
          <div class="d-flex align-items-center justify-content-end">
            {cartData?.length > 0 && (
              <div class="flex-shrink-0 mb-3">
                {
                  authCustomer()?.id ?
                    <button type="button" className="btn-normals w-xs" onClick={() => removeCartItemFun(`C_${authCustomer()?.id}`)} >Clear Cart</button>
                    :
                    <button type="button" className="btn-normals w-xs" onClick={() => removeCartItemFun(`clear`)} >Clear Cart</button>
                }
              </div>
            )}
          </div>

          {cartData?.length > 0 &&
            cartList?.map((item, i) => (
              <div class="card product mb-3">
                <div class="card-body">
                  <div class="row gy-3 algin-items-baseline">
                    <div class="col-sm-auto">
                      <div class="avatar-lg">
                        <div class="avatar-title rounded py-3">
                          <img src={imgBaseURL() + item?.cover} alt="" class="avatar-md" />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm">
                      <a href="#!">
                        <h5 class="main_check lh-base mb-1">{item?.name}</h5>
                      </a>
                      <ul class=" list-inline  fs-13 mb-0">
                        <span> SKU : <span style={{ color: '#E0A11C' }}>{item?.sku}</span></span>
                      </ul>
                      {commoProducts(item.product_items_id)?.length > 0 && (
                        <ol className="bundle-pro-check mt-2">
                          <>
                            {commoProducts(item.product_items_id)?.map(
                              (bundle_pro, i) => (
                                <li>
                                  <span>
                                    {bundle_pro?.name}{" "}
                                  </span>
                                </li>
                              )
                            )}
                          </>
                        </ol>
                      )}
                      {
                        item?.subscription_id &&
                        <p className="subscription_plan_label"> Subscription Plan : <span className="checkmark"></span>{item?.subscription_days} Days ₹{item?.subscription_sale_price} @{item?.subscription_discount}% off</p>
                      }
                      <div className="product-button mb-0 mt-2">
                        <div className="input-step">

                          {loadingMinusId === item.id ? (
                            <button type="button" className="minus">
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button>
                          ) : (
                            <button type="button" className="minus" onClick={() => handleQntChange("minus", item.product_id)}>-</button>
                          )}
                          <input type="text" className="product-quantity1" value={item?.qnt} readOnly />
                          {loadingPlusId === item.id ? (
                            <button type="button" className="plus">
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button>
                          ) : (
                            <button type="button" className="plus" onClick={() => handleQntChange("plus", item.product_id)}>+</button>
                          )}

                        </div>
                      </div>
                    </div>
                    <div class="col-sm-auto">
                      <div class="text-lg-end">
                        <p class=" mb-1 fs-12">Item Price:</p>
                        <h5 class="fs-16">
                          ₹<span class="product-price">{item?.sale_price}</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer pt-2">
                  <div class="row align-items-center gy-3">
                    <div class="col-sm">
                      <div class="d-flex flex-wrap my-n1">
                        <div className="text-danger">
                          <Link
                            className="d-block colorRedcolor"
                            to={"#"}
                            onClick={() => removeCartItemFun(item?.id)}
                          >
                            <i class="fa fa-trash  me-1"></i> Remove
                          </Link>
                        </div>
                        {/* <div>
                          <Link
                            className="d-block"
                            to={"#"}
                            onClick={() =>
                              addProductInWishlistFun(item?.product_id)
                            }
                          >
                            <i class="fa fa-heart  me-1"></i> Add Wishlist
                          </Link>
                        </div> */}
                      </div>
                    </div>
                    <div class="col-sm-auto">
                      <div class="d-flex align-items-center gap-2">
                        <div>Total :</div>
                        <h5 class="fs-14 mb-0">
                          ₹
                          <span class="product-line-price">
                            {item?.sale_price * parseInt(item.qnt)}
                          </span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>


      </div>



    </>
  );
};

export default CheckOut;
