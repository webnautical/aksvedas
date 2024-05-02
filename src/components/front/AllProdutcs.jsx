import React, { useState, useEffect } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "swiper/swiper-bundle.min.css";
import Aos from "aos";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { authCustomer, getPercentageOff, imgBaseURL, toastifyError, toastifySuccess } from "../../utility/Utility";
import { Link, useParams } from "react-router-dom";
import { postDataAPI } from "../../utility/api/api";
import { addToCartRepeater } from "../../utility/api/RepeaterAPI";

const AllProducts = () => {
  const { products, wishlistData, getWishlistFun,getCartFun } = useFrontDataContext()
  const { category } = useParams()
  const [loading, setLoading] = useState(false)
  const [proudctList, setProductList] = useState([])

  useEffect(() => {
    Aos.init();
    getWishlistFun()
    if (category !== 'all') {
      getProductListFun()
    } else {
      setProductList(products)
    }
  }, [category]);

  const getProductListFun = async () => {
    try {
      setLoading(true)
      const categoriesArray = category.split('+');
      const param = { type: 'category', slugs: categoriesArray }
      const res = await postDataAPI('/v1/get-products', JSON.stringify(param))
      if (res?.status) {
        setProductList(res?.data)
        setLoading(false)
      } else {
        setProductList(null)
        setLoading(false)
      }
    } catch (error) {
      setProductList(null)
      setLoading(false)
    }
  }

  const addWishlist = async (id) => {
    try {
      const param = { customer_id: authCustomer()?.id, product_id: id }
      const res = await postDataAPI('/v1/add-wishlist', param)
      if (res?.status) {
        getWishlistFun()
        toastifySuccess(res?.msg)
      } else {
        toastifyError('Product can not be added in wishlist')
      }
    } catch (error) {
      toastifyError('Server error')
    }
  }

  const isInWishlist = (productId) => {
    return wishlistData.some(item => item.product_id === productId);
  };

  const addToCartFun = async (id) => {
    const param = {product_id: id, qnt: 1 }
    addToCartRepeater(param,getWishlistFun,getCartFun)
  }

  return (

    <div className="row">

      {
        loading ? <>Loading...</>
          :
          proudctList?.length > 0 ?
            proudctList?.map((item, i) => (
              <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6 mb-4">
                <div className="product_box_main">
                  <div className="quick-access-btns">
                    <button className="btn1" onClick={() => addWishlist(item.id)}>

                      {
                        isInWishlist(item.id) ?
                          <i class="fa fa-heart" style={{ fontSize: '18px', color: 'red' }} aria-hidden="true"></i> :
                          <>
                            <svg
                              width="21"
                              height="18"
                              viewBox="0 0 21 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.97214 0.0251923C3.71435 0.183434 2.6616 0.701674 1.7705 1.60365C0.970091 2.41068 0.489057 3.26519 0.213053 4.37683C-0.275867 6.30342 0.0789948 8.20232 1.25398 9.98649C2.00708 11.1298 2.98097 12.1781 4.76711 13.7764C5.90266 14.7931 9.36848 17.7601 9.53802 17.859C9.69574 17.954 9.75488 17.9658 10.09 17.9658C10.4252 17.9658 10.4843 17.954 10.642 17.859C10.8116 17.7601 14.2853 14.7891 15.413 13.7764C17.207 12.1702 18.173 11.1258 18.9261 9.98649C20.1011 8.20232 20.4559 6.30342 19.967 4.37683C19.691 3.26519 19.21 2.41068 18.4096 1.60365C17.6131 0.800575 16.7614 0.337719 15.6456 0.100357C15.0857 -0.0183239 14.0526 -0.0301933 13.5637 0.0805759C12.1995 0.377279 11.1546 1.06167 10.2004 2.28013L10.09 2.41859L9.98357 2.28013C9.04122 1.08541 8.01212 0.401016 6.69913 0.100357C6.30878 0.00936699 5.4098 -0.0301933 4.97214 0.0251923ZM6.28907 1.23178C7.40885 1.42958 8.37487 2.07837 9.13979 3.15046C9.26991 3.3364 9.43156 3.55793 9.49465 3.64892C9.78643 4.06035 10.3936 4.06035 10.6854 3.64892C10.7485 3.55793 10.9102 3.3364 11.0403 3.15046C12.0851 1.68673 13.5401 0.998377 15.1251 1.21596C16.8837 1.45728 18.2558 2.69156 18.7802 4.50738C19.1942 5.94342 19.0128 7.45067 18.2597 8.80759C17.6289 9.94298 16.5761 11.1337 14.7427 12.7834C13.8555 13.5786 10.1255 16.7988 10.09 16.7988C10.0506 16.7988 6.33638 13.5904 5.4374 12.7834C2.61823 10.2476 1.50633 8.66518 1.23821 6.8098C1.06472 5.61112 1.31312 4.32145 1.91639 3.30475C2.82326 1.77376 4.58968 0.935081 6.28907 1.23178Z"
                                fill="black"
                              ></path>
                            </svg>

                          </>
                      }

                    </button>
                  </div>
                  <div className="img_product">
                    <Link to={`/product-detail/${item?.slug}`} className="text-dark text-capitalize">
                      <img src={imgBaseURL() + item.cover} alt="product_img" />
                    </Link>
                  </div>
                  <div className="rating_box mt-3">
                    <ul>
                      <li><i className="fa-solid fa-star"></i></li>
                      <li><i className="fa-solid fa-star"></i></li>
                      <li><i className="fa-solid fa-star"></i> </li>
                      <li><i className="fa-solid fa-star"></i></li>
                      <li><i className="fa-solid fa-star"></i></li>
                    </ul>
                  </div>
                  <div className="product_name">
                    <Link to={`/product-detail/${item?.slug}`} className="text-dark text-capitalize">{item.name}</Link>
                  </div>
                  <div className="price_product">
                    ₹{item.sale_price} <span className="high_price">{item.price}</span>
                  </div><i class="fa fa-heart-o" aria-hidden="true"></i>

                  <div className="doble_btn global_btn d-flex mt-3">
                    <button className="btn-2 w-100">
                      Buy Now <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    <button className="btn-2 w-100" onClick={() => addToCartFun(item.id)}>
                      <i className="me-1 fa-solid fa-cart-plus"></i>Add To cart
                    </button>
                  </div>

                  <div className="off_price_badge">{getPercentageOff(item.price, item.sale_price)}% off</div>
                </div>
              </div>
            ))
            :
            <>
              <div className='col-12 text-center  mt-4'>
                <h6 className='text-danger'>There are no product to display.</h6>
              </div>
            </>
      }
    </div>
  );
};

export default AllProducts;
