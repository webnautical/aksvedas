import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import productimg from "../../assets/img/product.png";
import productimgsec from "../../assets/img/productsec.png";
import cartproduct from "../../assets/img/cartproduct.png";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { imgBaseURL, toastifyError, toastifySuccess } from "../../utility/Utility";
import { deleteDataAPI } from "../../utility/api/api";
import { useNavigate } from "react-router-dom";

const CartPopUp = () => {
  const navigate = useNavigate()
  const { cartData, getCartFun } = useFrontDataContext()

  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const goesgretwith = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 100,
    margin: 10,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,

    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 2.5,
        nav: false,
      },
      1000: {
        items: 3,

        loop: true,
      },

      1500: {
        items: 2.1,

        loop: true,
      },
    },
  };

  const getSubTotalFunc = () => {
    const subtotal = cartData.reduce((total, item) => total + parseFloat(item.product.sale_price) * parseInt(item.qnt), 0);
    return subtotal;
  }

  const removeFromCart = async (id) => {
    try {
      const res = await deleteDataAPI(`v1/remove-cart/${id}`)
      if (res?.status) {
        toastifySuccess(res.msg)
        getCartFun()
      } else {
        toastifyError('Something Went Wrong')
      }
    } catch (error) {
      console.log(error)
      toastifyError('Something Went Wrong')
    }
  }

  const goToCheckOut = () => {
    navigate('/checkout')
  }

  return (
    <div
      className="cart_canvas offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasRightLabel">
          Your Cart
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-black"></i>
        </button>
      </div>
      <div className="offcanvas-body pt-0">
        <div className="scrollable_part">
          <div className="main_cart">

            {
              cartData?.length > 0 ?
                cartData?.map((item, i) => (
                  <div className="added_cart_product">
                    <div className="row">
                      <div className="col-4">
                        <div className="added_product_img">
                          <img src={imgBaseURL() + item?.product?.cover} alt="cart prodcut" />
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="add_cart_product_details">
                          <h2>{item?.product?.name}</h2>
                          <p>SKU:{item?.product?.sku}</p>
                          <p>₹{item?.product?.sale_price}</p>
                          <div className="quantity_select">
                            <button onClick={decreaseQuantity}>
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <span>{item?.qnt}</span>
                            <button onClick={increaseQuantity}>
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
                          <div className="dlt_cart_producy">
                            <button onClick={() => removeFromCart(item.id)}>
                              <i className="fa-solid fa-xmark"></i>
                            </button>
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

            {/* <div className="added_cart_product">
              <div className="row">
                <div className="col-4">
                  <div className="added_product_img">
                    <img src={cartproduct} alt="cart prodcut" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="add_cart_product_details">
                    <h2>Shilajit Gold Resin - 20g</h2>
                    <p>Color:black</p>
                    <div className="quantity_select">
                      <button onClick={decreaseQuantity}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{quantity}</span>
                      <button onClick={increaseQuantity}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div className="dlt_cart_producy">
                      <button>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

          </div>

          <div className="order_note mt-3">
            <button>Add Order Note</button>
          </div>

          <div className="goes_great_with mt-3">
            <p>Goes great with</p>
            <div className="row mt-1">
              <OwlCarousel className="owl-theme" {...goesgretwith}>
                <div className="item">
                  <div className="product_box_main">
                    <div className="img_product">
                      <img src={productimg} alt="product_img" />
                    </div>
                    <div className="rating_box mt-3">
                      <ul>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="product_name">
                      Pure Himalayan Shilajit (300 Gms)
                    </div>
                    <div className="price_product">
                      ₹120.00 <span className="high_price">320.00</span>
                    </div>

                    <div className="off_price_badge">30% off</div>
                  </div>
                </div>
                <div className="item">
                  <div className="product_box_main">
                    <div className="img_product">
                      <img src={productimg} alt="product_img" />
                    </div>
                    <div className="rating_box mt-3">
                      <ul>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="product_name">
                      Pure Himalayan Shilajit (300 Gms)
                    </div>
                    <div className="price_product">
                      ₹120.00 <span className="high_price">320.00</span>
                    </div>

                    <div className="off_price_badge">30% off</div>
                  </div>
                </div>
                <div className="item">
                  <div className="product_box_main">
                    <div className="img_product">
                      <img src={productimgsec} alt="product_img" />
                    </div>
                    <div className="rating_box mt-3">
                      <ul>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="product_name">
                      Pure Himalayan Shilajit (300 Gms)
                    </div>
                    <div className="price_product">
                      ₹120.00 <span className="high_price">320.00</span>
                    </div>

                    <div className="off_price_badge">30% off</div>
                  </div>
                </div>
                <div className="item">
                  <div className="product_box_main">
                    <div className="img_product">
                      <img src={productimg} alt="product_img" />
                    </div>
                    <div className="rating_box mt-3">
                      <ul>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="product_name">
                      Pure Himalayan Shilajit (300 Gms)
                    </div>
                    <div className="price_product">
                      ₹120.00 <span className="high_price">320.00</span>
                    </div>

                    <div className="off_price_badge">30% off</div>
                  </div>
                </div>
                <div className="item">
                  <div className="product_box_main">
                    <div className="img_product">
                      <img src={productimg} alt="product_img" />
                    </div>
                    <div className="rating_box mt-3">
                      <ul>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="product_name">
                      Pure Himalayan Shilajit (300 Gms)
                    </div>
                    <div className="price_product">
                      ₹120.00 <span className="high_price">320.00</span>
                    </div>

                    <div className="off_price_badge">30% off</div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>

        <div className="subtotal_checkout">
          <div className="sub_dec">
            <p>Subtaotal</p>
            <p>₹{getSubTotalFunc()}</p>
          </div>
          <div className="checkout">
            <button className="btn-2 w-100" onClick={() => goToCheckOut()}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopUp;
