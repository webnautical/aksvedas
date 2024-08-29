import React, { useEffect, useState, useRef  } from "react";
import emptycart from "../../assets/img/empty-cart.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { getPercentageOff, imgBaseURL } from "../../utility/Utility";
import { Link, useNavigate } from "react-router-dom";
import { cartQntChange } from "../../utility/api/RepeaterAPI";
import { Rating } from "@mui/material";
 
const CartPopUp = ({ item }) => {
  const navigate = useNavigate();
  const { cartData, allData, removeCartItemFun, offcanvas, setOffcanvas } =
    useFrontDataContext();
  const [cartList, setCartList] = useState([]);
 
  const goesgretwith = {
    // loop: true,
    autoplay: true,
    autoplayTimeout: 4000, // Autoplay interval in milliseconds
    autoplaySpeed: 1000,
    margin: 10,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
 
    responsive: {
      0: {
        items: 2,
        nav: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 2,
 
        loop: false,
      },
 
      1500: {
        items: 2,
 
        loop: true,
      },
    },
  };
 
  const getSubTotalFunc = () => {
    const subtotal = cartList.reduce(
      (total, item) =>
        total + parseFloat(item?.sale_price) * parseInt(item.qnt),
      0
    );
    return subtotal;
  };
 
  const goToCheckOut = () => {
    navigate("/checkout");
    setOffcanvas(false);
  };
 
  useEffect(() => {
    if (cartData.length > 0) {
      setCartList(cartData);
    }
  }, [cartData]);
 
  const handleQntChange = (qntType, itemId) => {
    const updatedCartItems = cartList.map((item) => {
      if (item.id === itemId) {
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
        return { ...item, qnt: newQuantity };
      }
      return item;
    });
    setCartList(updatedCartItems);
  };
 
  const owlRef = useRef(null);
 
  const goToPrev = () => {
    owlRef.current.prev();
  };
 
  const goToNext = () => {
    owlRef.current.next();
  };

  // console.log("cartList",cartList)
 
  return (
    <div
      className={`cart_canvas offcanvas offcanvas-end ${offcanvas && "show"}`}
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
          onClick={() => setOffcanvas(false)}
        >
          <i className="fa-solid fa-xmark text-black"></i>
        </button>
      </div>
      <div className="offcanvas-body pt-0">
        <div className="scrollable_part">
          <div className="main_cart">
            {cartData?.length > 0 ? (
              cartList?.map((item, i) => (
                <div className="added_cart_product">
                  <div className="row ">
                    <div className="col-4">
                      <div className="added_product_img">
                        <img
                          src={imgBaseURL() + item?.cover}
                          alt="cart prodcut"
                        />
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="add_cart_product_details">
                        <h2> {item?.name} </h2>
                        <p>
                          SKU:{" "}
                          <span style={{ color: "#E0A11C" }}>{item?.sku}</span>
                        </p>
                        <p>₹{item?.sale_price}</p>
 
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="quantity_select">
                            <button
                              onClick={() => handleQntChange("minus", item.id)}
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <span>{item?.qnt}</span>
                            <button
                              onClick={() => handleQntChange("plus", item.id)}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
 
                          <div>
                            <button
                              className="icon_btn __danger mx-1"
                              onClick={() => removeCartItemFun(item.id)}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div class="product-item-inner">
                  <img src={emptycart} alt="" style={{ width: "100px" }} />
                  <h5>There are no product added on your cart</h5>
                  <p className=" w-75 mx-auto">
                    <Link
                      className="text-decoration"
                      to="/shop/all"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={() => navigate("/shop/all")}
                    >
                      Add Items{" "}
                      <i
                        style={{ fontSize: "16px" }}
                        className="fa-solid fa-arrow-right  ms-2"
                      ></i>
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
 
          <div className="goes_great_with mt-3">
         <div className="mb-3 d-flex justify-content-between align-items-center">
         <p className="mb-0">Goes great with</p> <div>
          <div className="cs_button_arrow">
          <button onClick={goToPrev}><i class="fa-solid fa-chevron-left"></i></button>
        <button onClick={goToNext}><i class="fa-solid fa-chevron-right"></i></button>
          </div>
         </div>
         </div>
            <div className=" mt-1">
              <OwlCarousel className="owl-theme" {...goesgretwith} ref={owlRef}>
                {allData?.products?.map((item, i) => (
                  <div className="item">
                    <a href={`/product-detail/${item?.slug}`}>
                      <div className="product_box_main">
                        <div className="img_product">
                          <img
                            src={imgBaseURL() + item.cover}
                            alt="product_img"
                          />
                        </div>
                        <div className="rating_box mt-2">
                          <ul>
                            <Rating
                              name="read-only"
                              value={item?.review_average}
                              readOnly
                            />
                          </ul>
                        </div>
                        <div className="product_name">{item.name}</div>
                        <div className="price_product">
                          ₹{item.sale_price}{" "}
                          <span className="high_price">{item.price}</span>
                        </div>
 
                        <div className="off_price_badge">
                          {parseInt(
                            getPercentageOff(item.price, item.sale_price)
                          ) || 0}
                          % off
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </OwlCarousel>
            </div>
          </div>
        </div>
 
        <div className="subtotal_checkout">
          {cartData?.length > 0 && (
            <>
              <div className="sub_dec">
                <p>Subtotal</p>
                <p>₹{getSubTotalFunc()}</p>
              </div>
              <div className="checkout">
                <button
                  className="btn-2 w-100"
                  onClick={() => goToCheckOut()}
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default CartPopUp;