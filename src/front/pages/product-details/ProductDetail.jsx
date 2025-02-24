import React, { useEffect, useState } from "react";
import emptycart from "../../../assets/img/empty-cart.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Rating, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Modal from 'react-modal';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import userimg from "../../../assets/img/revie-user.png";
import gauntee from "../../../assets/img/gauntee.png";
import benefits2 from "../../../assets/img/shilajitbenfuse-1.webp";
import icon1 from "../../../assets/img/science.png";
import icon2 from "../../../assets/img/qualitys33.png";
import icon3 from "../../../assets/img/tested.png";
import icon4 from "../../../assets/img/noarti.png";
import BenifitsVideo from "../../../components/front/BenifitsVideo";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Thumslider from "../../../components/front/Thumslider";
import { Star, StarBorderOutlined } from "@mui/icons-material";
import { APICALL, postDataAPI } from "../../../utility/api/api";
import {
  authCustomer,
  getPercentageOff,
  getReviewStar,
  imgBaseURL,
  stringToArray,
  toastifyError,
} from "../../../utility/Utility";
import HTMLContent from "../../../components/HTMLContent";
import { addToCartRepeater } from "../../../utility/api/RepeaterAPI";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import FrontLoader from "../../../components/front/FrontLoader";
import { timeAgo } from "../../../utility/Date";
import { SOMETHING_ERR } from './../../../utility/Constants';
import axios from "axios";
import ProductItemButton from "../../../components/front/ProductItemButton";
import { Helmet } from "react-helmet";
const ProductDetail = () => {
  const { getWishlistFun, getCartFun, addProductInWishlistFun, wishlistData, customerDetails, cartData } =
    useFrontDataContext();

  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [productContents, setProductContents] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [productPrice, setProductPrice] = useState({
    'price': 0,
    'sale_price': 0
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };


  const handleDeleteImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  const [rating, setRating] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);
  const handleClick = (value) => {
    setRating(value);
  };

  const handleWriteReviewClick = () => {
    setShowContactForm(true);
  };

  const [productImages, setProductImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewError, setReviewError] = useState('');
  const cartItem = cartData.find(cartItem => cartItem?.product_id == productDetails?.id);
  const [clickCount, setClickCount] = useState(0)

  const handleQntChange = (type) => {
    if (type === 'plus') {
      setClickCount(clickCount + 1)

      if (cartItem && (cartItem.qnt > 4 || quantity > 4)) {
        setClickCount(clickCount + 1)
        if (clickCount === 0) {
          toastifyError('You cannot add more than 5 of this item.');
          return false
        } else {
          return false
        }
      } else {
        if (productDetails.quantity > quantity) {
          if (quantity == 5) {
            toastifyError('You cannot add more than 5 of this item.');
            return false
          } else {
            setQuantity((prevQuantity) => prevQuantity + 1);
          }
        }
      }
    } else {
      if (quantity > 1) {
        setQuantity((prevQuantity) => prevQuantity - 1);
      }
    }
  }

  const isInWishlist = (productId) => {
    return wishlistData.some((item) => item.product_id === productId);
  };

  const formatQuantity = (quantity) => {
    return quantity < 10 ? `0${quantity}` : quantity;
  };


  const productslider = {
    loop: true,
    autoplay: true,

    autoplayTimeout: 3000,
    autoplaySpeed: 1000,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
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
        margin: 10,
        loop: true,
      },

      1250: {
        items: 4,

        loop: true,
      },
    },
  };

  useEffect(() => {
    if (slug) {
      getProductDetailsFun();
    } else {
      navigate(`/shop`);
    }
  }, [slug]);

  useEffect(() => {
    if (productDetails?.id) {
      getReviewsFun()
      checkCustomerReviewFun()
    }
  }, [productDetails?.id])


  const getProductDetailsFun = async () => {
    try {
      setLoading(true);
      const param = { slug: slug };
      const res = await postDataAPI("/v1/get-product-details", param);
      if (res?.status) {
        setBundleProducts(res?.data?.bundleProducts)
        setFrequentlyBoughtTogether(res?.data?.frequentlyBoughtTogether)
        setProductDetails(res?.data?.details);
        setProductPrice({ ...productPrice, 'price': res?.data?.details?.price, 'sale_price': res?.data?.details?.sale_price })
        setProductContents(res?.data?.product_content);
        getRelatedProductFun(res?.data?.details?.category?.slug);
        if (res?.data?.details?.product_images?.length > 0) {
          const images = res.data.details.product_images.map(
            (image) => imgBaseURL() + image.src
          );
          if (res?.data?.details?.cover) {
            images.unshift(imgBaseURL() + res.data.details.cover);
          }
          setProductImages(images);
        } else {
          setProductImages([imgBaseURL() + res?.data?.details?.cover]);
        }
        setSelectedPlan(res?.data?.details?.product_subscription[0])
        setLoading(false);
      } else {
        navigate("/not-found");
        setProductDetails(null);
        setLoading(false);
      }
    } catch (error) {
      navigate("/not-found");
      setProductDetails(null);
      setLoading(false);
    }
  };

  const [relatedProduct, setRelatedProducts] = useState([]);
  const getRelatedProductFun = async (categorySlug) => {
    try {
      setLoading(true);
      const param = { type: "category", slugs: [categorySlug] };
      const res = await postDataAPI("/v1/get-products", JSON.stringify(param));
      if (res?.status) {
        setRelatedProducts(res?.data);
        setLoading(false);
      } else {
        setRelatedProducts(null);
        setLoading(false);
      }
    } catch (error) {
      setRelatedProducts(null);
      setLoading(false);
    }
  };

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleCheckboxChange = (event, product) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedProducts((prevSelectedProducts) => [...prevSelectedProducts, product]);
    } else {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((selectedProduct) => selectedProduct !== product)
      );
    }
  };

  const [disabledBtn, setDisabledBtn] = useState(false)
  const addToCartFun = async (type, product_id) => {
    setDisabledBtn(true)

    const cartQnt = cartItem?.qnt ? cartItem?.qnt : 0;
    setClickCount(clickCount + 1)

    if (cartQnt == 5) {
      if (type == "buy") {
        navigate("/checkout");
      }
      if (clickCount === 0) {
        toastifyError('You cannot add more than 5 of this item.');
        return false
      } else {
        return false
      }
    }
    const maxAllowedQuantity = Math.min(5 - cartQnt, quantity);
    const param = { product_id: productDetails?.id, qnt: maxAllowedQuantity, subscription_id: selectedPlan?.id };
    if (authCustomer()?.id) {
      const canvas = type == "buy" ? 0 : 1
      addToCartRepeater(param, getWishlistFun, getCartFun, 0, canvas);
      selectedProducts?.map(item => {
        const param = { product_id: item, qnt: 1 };
        return addToCartRepeater(param, getWishlistFun, getCartFun, 1);
      })
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);
      setDisabledBtn(false)
      if (type == "buy") {
        navigate("/checkout");
      }
    } else {
      sessionStorage.setItem('cart', JSON.stringify(param))
      navigate("/login", { state: { data: type } });
    }
  };

  const [reviewList, setReviewList] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const getReviewsFun = async () => {
    try {
      const res = await APICALL(`/v1/get-reviews/${productDetails?.id}`);
      if (res?.status) {
        setReviewList(res?.data)
      } else {
        setReviewList([]);
      }
    } catch (error) { setReviewList([]) }
  }

  const getReviewCount = (num) => {
    const re = reviewList.filter((item) => item.star === num)
    return re
  }

  const averageFun = () => {
    if (reviewList.length === 0) return 0;
    const sum = reviewList.reduce((acc, curr) => acc + curr.star, 0);
    const average = sum / reviewList.length;
    return average.toFixed(2);
  }
  const getRangeWidth = (type) => {
    const res = (parseInt(getReviewCount(type)?.length) / parseInt(reviewList?.length)) * 100
    return res
  }

  const [reviewVal, setReviewVal] = useState({
    name: customerDetails?.name,
    customer_id: authCustomer()?.id,
    review: '',
    images: '',
  })

  const handleChange = (e) => {
    setReviewVal({
      ...reviewVal, [e.target.name]: e.target.value
    })
    if (e.target.name === 'review') {
      if (e.target.value.trim() === '') {
        setReviewError('Write something.');
      } else {
        setReviewError('');
      }
    }
  }
  const handleReview = async () => {
    setSubmitLoading(true)
    try {
      if (reviewVal.review.trim() === '') {
        setReviewError('Write something.');
        setSubmitLoading(false)
        return;
      }
      const formData = new FormData();
      formData.append("product_id", productDetails?.id);
      formData.append("star", rating);
      formData.append("name", reviewVal?.name);
      formData.append("customer_id", reviewVal?.customer_id);
      formData.append("review", reviewVal?.review);
      selectedImages?.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      const res = await APICALL('/v1/submit-review', 'post', formData);
      if (res?.status) {
        getReviewsFun()
        setReviewVal({ ...reviewVal, 'name': customerDetails?.name, 'review': '' })
        setRating(0)
        setShowContactForm(false);
        setSubmitLoading(false)
        setReviewError('');
      } else {
        toastifyError(SOMETHING_ERR)
        setSubmitLoading(false)
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR);
      setSubmitLoading(false)
    }
  }
  const maxLength = 1600;
  const [showAll, setShowAll] = useState(false);
  const maxVisibleReviews = 5;
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  const handleSortChange = (e) => {
    if (e.target.value === 'low_to_high') {
      setReviewList([...reviewList].sort((a, b) => a.star - b.star));
    } else if (e.target.value === 'high_to_low') {
      setReviewList([...reviewList].sort((a, b) => b.star - a.star));
    } else {
      setReviewList([...reviewList]);
    }
  };

  const checkCustomerAlreadyReviewGiven = () => {
    const res = reviewList.some((item) => item.customer_id == authCustomer()?.id);
    return res;
  }

  const [deliveryPostelCode, setDeliveryPostelCode] = useState('')
  const [estimatedInfo, setEstimatedInfo] = useState()
  const checkDeliveryStatus = async () => {
    const params = {
      email: "webnauticaldesigner@gmail.com",
      password: "webnauticaldesigner@gmail.com"
    }
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', params)
    if (res?.status === 200) {
      try {
        const dataParams = {
          "pickup_postcode": "302019",
          "delivery_postcode": deliveryPostelCode,
          "weight": "1",
          "cod": "0"
        }
        const headers = {
          'Authorization': `Bearer ${res?.data?.token}`
        };
        const serviceabilityRes = await axios.get('https://apiv2.shiprocket.in/v1/external/courier/serviceability/', {
          params: dataParams,
          headers: headers
        });
        if (serviceabilityRes?.data?.status === 200) {
          setEstimatedInfo(serviceabilityRes?.data?.data?.available_courier_companies[0].etd)
        } else {
          setEstimatedInfo("Invalid Postel Code")
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
  }

  const [checkCustomerReview, setCheckCustomerReview] = useState(null)
  const checkCustomerReviewFun = async () => {
    try {
      const params = { customer_id: authCustomer()?.id, product_id: productDetails?.id }
      const res = await APICALL(`/v1/check-review`, 'post', params);
      if (res?.status) {
        setCheckCustomerReview(res?.data)
      } else {
        setCheckCustomerReview(null)
      }
    } catch (error) { setCheckCustomerReview(null) }
  }

  const handlePlanChange = (item) => {
    setSelectedPlan(item);
    setProductPrice({ ...productPrice, 'price': item?.price, 'sale_price': item?.sale_price })
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (img) => {
    setCurrentImage(imgBaseURL() + img);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage('');
  };
  const [wishCount, setWishlistCount] = useState(0)
  useEffect(() => {
    getWishlistFun()
  }, [wishCount])

  const isImage = (file) => {
    return file.type.startsWith('image/');
  };

  const isVideo = (file) => {
    return file.type.startsWith('video/');
  };
  const fullFileCheck = currentImage.endsWith('.mp4') || currentImage.endsWith('.mov');


  useEffect(() => {
    if (!productDetails || Object.keys(productDetails).length === 0) return;
    if (document.title !== productDetails.meta_title) {
      document.title = productDetails.meta_title || "Aksvedas";
    }
  
    const updateMetaTag = (name, content) => {
      let metaTag = document.querySelector(`meta[name='${name}']`);
      if (metaTag && metaTag.getAttribute("content") !== content) {
        metaTag.setAttribute("content", content);
      } else if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };
  
    updateMetaTag("description", productDetails.meta_desc || "Aksvedas");
    updateMetaTag("keywords", productDetails.meta_keyword || "default, keywords");
  
  }, [productDetails]);
  
  

  return (
    <>
      {loading ? (
        <>
          <FrontLoader />
        </>
      ) : (
        <>
          <div className="product-details">
            <div className="container">
              {productDetails?.h_one &&
                <h1 className="m-0 mt-3 mb-2" style={{ fontSize: '20px' }}>{productDetails?.h_one}</h1>}
              <Breadcrumbs
                aria-label="breadcrumb"
                className="breacrumb-custom py-2 pt-0"
                separator={<NavigateNextIcon fontSize="small" />}
              >
                <Link to={"/"} underline="hover">
                  Home
                </Link>
                <Link to={"/shop/all"} underline="hover" color="inherit">
                  Shop
                </Link>
                <Typography>{productDetails?.name}</Typography>
              </Breadcrumbs>
              <div className="thumb-slider-pro mt-md-0 mt-3">
                <div className="row">
                  <div className="col-lg-5 mb-lg-5 mb-4">
                    <Thumslider images={productImages} />
                  </div>
                  <div className="col-lg-7 ps-lg-4">
                    <div className="product-deatisl-content">
                      <h2>{productDetails?.name}</h2>
                      <div className="rating_box">
                        <div className="d-flex gap-2 mb-3">
                          <div className="fs-15">
                            <Rating name="read-only" value={averageFun()} readOnly />
                          </div>
                          {/* <span className="fw-medium"> (4)</span> */}
                        </div>
                        <div className="skuno">
                          <ul>
                            <li>
                              {" "}
                              Sku: <strong>{productDetails?.sku}</strong>
                            </li>
                            <li>
                              Availability:{" "}
                              {productDetails?.quantity > 0 ? (
                                <span className="instock">In Stock</span>
                              ) : (
                                <span className="outoff-stock">
                                  Out off Stock
                                </span>
                              )}
                            </li>
                            {/* <li className="text-capitalize">
                                Category:{" "}
                                <strong>{productDetails?.category?.name}</strong>
                              </li> */}
                          </ul>
                        </div>

                        {
                          productDetails?.product_subscription?.length > 0 &&
                          <div className="row">
                            <div className="col-lg-8 col-md-6">
                              <div className="select-plan">
                                <p>Subscription Plan</p>
                                <div className="radio-options">
                                  {
                                    productDetails?.product_subscription?.map((item, i) => (
                                      <label className="custom-radio w-100">
                                        <input
                                          type="radio"
                                          name="priceOption"
                                          value="All Price"
                                          checked={selectedPlan?.days == item.days}
                                          onChange={() => handlePlanChange(item)}
                                        />
                                        <span className="checkmark"></span>{item?.days} Days ₹{item?.sale_price}
                                        @{item?.discount}% off
                                      </label>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        }

                        <h5 className="fs-24">
                          ₹{productPrice?.sale_price}{" "}
                          <span className="text-muted">
                            <del>₹{productPrice?.price} </del>
                          </span>{" "}
                          <span className="fs-14 ms-2">
                            {" "}
                            (
                            {getPercentageOff(
                              productPrice?.price,
                              productPrice?.sale_price
                            )}{" "}
                            % OFF)
                          </span>
                        </h5>


                        {
                          bundleProducts?.length > 0 &&
                          <div className="budle-produts">
                            <h5>Bundle Products - {bundleProducts?.length}</h5>
                            <ul>
                              <>
                                {
                                  bundleProducts?.map((item, i) => (
                                    <li>
                                      <div className="imgsection-pro">
                                        <img src={imgBaseURL() + item.cover} alt="bundle Cover" />
                                      </div>{" "}
                                      <span>
                                        {item?.name}{" "}
                                        <h5 className="fs-24">
                                          ₹{item?.sale_price}{" "}
                                          <span className="text-muted"><del>₹{item?.price} </del></span>{" "}
                                          <span className="fs-14 ms-2">
                                            {" "}
                                            ({getPercentageOff(item?.price, item?.sale_price)}{" "}% OFF)
                                          </span>
                                        </h5>
                                      </span>
                                    </li>
                                  ))
                                }
                              </>
                            </ul>
                          </div>
                        }

                        {
                          frequentlyBoughtTogether?.length > 0 &&
                          <div className="pairs_with_best mt-3 mb-3">
                            <h6>Pairs With Best</h6>
                            <div className="box_pair">
                              <ul>
                                {frequentlyBoughtTogether?.map((item, i) => (
                                  <li key={item.id}>
                                    <input
                                      type="checkbox"
                                      id={`product-${item.id}`}
                                      value={item.id}
                                      checked={selectedProducts.includes(item.id)}
                                      onChange={(event) => handleCheckboxChange(event, item.id)}
                                      className="miui-checkbox"
                                    />
                                    <img
                                      style={{ width: '70px', height: '70px' }}
                                      src={imgBaseURL() + item.cover}
                                      alt="product-img"
                                    />
                                    <label htmlFor={`product-${item.id}`} className="miui-checkbox-label">
                                      <span className="miui-checkbox-icon"></span>
                                      {item?.name}{" "}
                                      <h5 className="fs-24">
                                        ₹{item?.sale_price}{" "}
                                        <span className="text-muted">
                                          <del>₹{item?.price} </del>
                                        </span>{" "}
                                        <span className="fs-14 ms-2">
                                          {" "} ({getPercentageOff(item?.price, item?.sale_price)}{" "}% OFF)
                                        </span>
                                      </h5>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        }


                        <div className="product-button">
                          <div className="input-step">
                            <button type="button" className="minus" onClick={() => handleQntChange('minus')}>
                              –
                            </button>
                            <input
                              type="text"
                              className="product-quantity1"
                              value={formatQuantity(quantity)}
                              readOnly
                            />
                            <button
                              type="button"
                              className="plus"
                              onClick={() => handleQntChange('plus')}
                            >
                              +
                            </button>
                          </div>

                          {productDetails?.quantity > 0 ? (
                            <div className="doble_btn-pro">
                              <button
                                className="btn-2"
                                onClick={() => addToCartFun("cart")}
                                disabled={disabledBtn}
                              >
                                Add To cart{" "}
                                <i className="ms-2 fa fa-cart-plus"></i>
                              </button>
                              <button
                                className="btn-2 buy-btn"
                                onClick={() => addToCartFun("buy")}
                              // disabled={disabledBtn}

                              >
                                Buy Now
                              </button>
                            </div>
                          ) : (
                            <div className="doble_btn-pro disbled-button">
                              <button className="btn-2">
                                Add To cart{" "}
                                <i className="ms-2 fa fa-cart-plus"></i>
                              </button>
                              <button className="btn-2 buy-btn">Buy Now</button>
                            </div>
                          )}
                        </div>



                        <div className="delivery-datecheck">
                          <p>Check Delivery Date</p>
                          <div className="subscribe-date mb-0">
                            <input
                              className="ps-1"
                              type="text"
                              maxLength={6}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newValue = value.replace(/\D/g, '');
                                setDeliveryPostelCode(newValue);
                              }}
                              value={deliveryPostelCode}
                              placeholder="Enter Your Postel Code"
                            />
                            <div className="submit">
                              <button className="shop_now btn-2" onClick={() => checkDeliveryStatus()} disabled={deliveryPostelCode.length === 0}>
                                Check
                              </button>
                            </div>
                          </div>
                          <p className="bold-fre-deli mt-2 mb-4">
                            {estimatedInfo && "Expected delivery date : " + estimatedInfo}
                          </p>
                        </div>
                        <div className="gurantee-safe mt-2">
                          <p>100% Guarantee Safe Checkout</p>
                          <img src={gauntee} alt="" />
                        </div>


                      </div>



                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="section-inner-des">
            <div className="container">
              {/* special discounts */}
              <div className="how-use mb-0">
                <div className="row">
                  <div className="col-xl-6 col-md-7 col-sm-8 mx-auto">
                    {/* <div className="get-special">
                      <h5>Get special discounts on checkout</h5>
                      <div className="get-special-inner">
                        <div className="cutsom-input">
                          +91
                          <input
                            type="tel"
                            maxlength="10"
                            placeholder="Mobile Number"
                            value=""
                          />
                        </div>
                        <button className="btn-2">Check</button>
                      </div>
                      <div className="mt-2 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                        />
                        <label className="form-check-label" for="exampleCheck1">
                          Get updates on Whatsapp.You may opt out anytime
                        </label>
                      </div>
                    </div> */}
                    <div className="row row-cols-2 row-cols-sm-2 row-cols-xl-4 row-cols-lg-4 row-cols-md-2 g-3 mt-md-4 mt-4 mb-2">
                      <div className="col">
                        <div className="iconpro-box">
                          <img src={icon1} alt="footer_logo" />
                          <h5>Rooted in science</h5>
                        </div>
                      </div>
                      <div className="col">
                        <div className="iconpro-box">
                          <img src={icon2} alt="footer_logo" />
                          <h5>Quality sourced</h5>
                        </div>
                      </div>
                      <div className="col">
                        <div className="iconpro-box">
                          <img src={icon3} alt="footer_logo" />
                          <h5>Comprehensivly Tested</h5>
                        </div>
                      </div>
                      <div className="col">
                        <div className="iconpro-box">
                          <img src={icon4} alt="footer_logo" />
                          <h5>No artificial preservatives</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Know About */}
              <div className='my-4'>
                <h3 className="text-center">Product Description</h3>
                <div className='d-block text-center mt-2'> <div dangerouslySetInnerHTML={{ __html: productDetails?.description }} /></div>
              </div>
              {productContents?.knowabout?.length > 0 && (
                <>
                  <div className="how-use mb-md-5 mb-3">


                    <h3>Know About {productDetails?.name}</h3>
                    <div className="row">
                      <div className="col-xl-11  mx-auto">
                        <div className="about-shilajit">
                          <div className="row mx-0">
                            <div className="col-sm-8 px-0">
                              <div className="about-shilajit-inner">
                                <h4> {productContents?.knowabout[0]?.title}</h4>
                                <HTMLContent
                                  data={productContents?.knowabout[0]?.desc}
                                />
                              </div>
                            </div>
                            <div className="col-sm-4 px-0">
                              <div className="about-shilaimg">
                                {" "}
                                <img
                                  src={
                                    imgBaseURL() +
                                    productContents?.knowabout[0]?.img
                                  }
                                  alt=""
                                ></img>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </>
              )}
              {
                productContents?.attachment[0] &&
                <div className="row justify-content-center mt-4">
                  <div className="col-lg-3 col-md-4">
                    <div className="product-button">
                      <div className="doble_btn-pro">
                        <Link className="btn-2" target="_blank" to={imgBaseURL() + productContents?.attachment[0]?.img}>
                          Download Attachment
                          <i className="ms-2 fa-solid fa-download"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {/* Benefits */}
              {/* {productDetails?.product_benefits?.length > 0 && (
                <>
                  <div className="how-use mb-md-5 mb-4">
                    <h3>Benefits of {productDetails?.name}</h3>
                    <OwlCarousel className="owl-theme " {...benefitsshilajit}>
                      {productDetails?.product_benefits?.map((item, i) => (
                        <div className="item">
                          <div className="benefitsshilajits">
                            <BenifitsVideo thumbnailSrc={benefits2} />

                            <h4>{item?.title}</h4>
                          </div>
                        </div>
                      ))}

                     
                    </OwlCarousel>
                  </div>
                </>
              )} */}

              {/* Key Ingredients */}
              {productContents?.keyingredients?.length > 0 && (
                <>
                  <div className="how-use">
                    <h3>Key Ingredients</h3>
                    <div className="row justify-content-center">
                      {productContents?.keyingredients?.map((item, i) => (
                        <div className="col-md-4 col-sm-6  mb-md-5 mb-4">
                          <div className="keyingrents">
                            <img src={imgBaseURL() + item?.img} alt=""></img>
                            <h4>{item?.title}</h4>
                            <HTMLContent data={item?.desc} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="row">
                <div className="col-lg-10 mx-auto">
                  {/* How to use */}
                  {productContents?.useoff?.length > 0 && (
                    <>
                      <div className="how-use">
                        <h3>How to use {productDetails?.name}</h3>
                        <div className="row justify-content-center">
                          {productContents?.useoff?.map((item, i) => (
                            <div className="col-sm-6">
                              <div className="how-tobox">
                                <div className="how-imgbox">
                                  <img
                                    src={imgBaseURL() + item?.img}
                                    alt=""
                                  ></img>
                                </div>
                                <h4>Step {i + 1}</h4>
                                <HTMLContent data={item?.desc} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* recommended with */}

                  {productContents?.recommendedwith?.length > 0 && (
                    <>
                      <div className="how-use">
                        <h3>{productDetails?.name} is recommended with</h3>

                        <div className="row justify-content-center">
                          {productContents?.recommendedwith?.map((item, i) => (
                            <div className="col-sm-6 mb-md-5 mb-4">
                              <div className="how-tobox">
                                <div className="how-imgbox">
                                  <img
                                    src={imgBaseURL() + item?.img}
                                    alt=""
                                  ></img>
                                </div>
                                <h4>{item.title}</h4>
                                <HTMLContent data={item?.desc} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* FAQ */}

              {productContents?.faq?.length > 0 && (
                <>
                  <div className="how-use">
                    <div className="faq-section">
                      <h3>FAQ</h3>

                      <div className="row">
                        <div className="col-lg-8 mx-auto">
                          <div
                            className="accordion accordion-flush"
                            id="accordionFlushExample"
                          >
                            {productContents?.faq?.map((item, i) => (
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id="flush-headingOne"
                                >
                                  <Link
                                    className="product-info-accordion text-decoration-none"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapseOne${i}`}
                                    aria-expanded={i == 0 && false}
                                    aria-controls="flush-collapseOne"
                                  >
                                    <span className="fs-18px">
                                      {item.title}
                                    </span>
                                  </Link>
                                </h2>
                                <div
                                  id={`flush-collapseOne${i}`}
                                  className={`accordion-collapse collapse ${i == 0 && "show"
                                    }`}
                                  aria-labelledby="flush-headingOne"
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  <div className="py-8">
                                    <HTMLContent data={item?.desc} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="bestseller">
            <div className="container">
              <div className="global_heading text-center mb-5">
                <h2>Aksvedas Related Products</h2>
              </div>

              {relatedProduct?.length > 0 ? (
                <>
                  <div className="row mt-5">
                    <OwlCarousel className="owl-theme" {...productslider}>
                      {relatedProduct?.map((item, i) => (
                        <div className="item">
                          <div className="product_box_main">
                            <div className="quick-access-btns">
                              <button
                                className="btn1"
                                onClick={() => { addProductInWishlistFun(item.id); setWishlistCount(wishCount + 1) }}
                              >
                                {isInWishlist(item.id) ? (
                                  <i
                                    class="fa-solid fa-heart"
                                    style={{ fontSize: "18px", color: "#ddad67" }}
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  <>
                                    <i
                                      class="fa-solid fa-heart text-white"
                                      aria-hidden="true"
                                    ></i>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="img_product">
                              <Link
                                to={`/product-detail/${item?.slug}`}
                                className="text-dark text-capitalize"
                              >
                                <img
                                  className="withouthover"
                                  src={imgBaseURL() + item.cover}
                                  alt="product_img"
                                />
                                <img
                                  className="withhover"
                                  src={imgBaseURL() + item.hover_img}
                                  alt="product_img"
                                />
                              </Link>
                            </div>
                            <div className="rating_box mt-3">
                              <ul>
                                <Rating name="read-only" value={item?.review_average} readOnly />
                              </ul>
                            </div>
                            <div className="product_name">
                              <Link
                                to={`/product-detail/${item?.slug}`}
                                className="text-dark text-capitalize"
                              >
                                {item.name}
                              </Link>
                            </div>
                            <div className="price_product">
                              ₹{item.sale_price}{" "}
                              <span className="high_price">₹{item.price}</span>
                            </div>

                            <ProductItemButton row={item} />

                            <div className="off_price_badge">
                              {parseInt(
                                getPercentageOff(item.price, item.sale_price)
                              ) || 0}
                              % off
                            </div>
                          </div>
                        </div>
                      ))}
                    </OwlCarousel>
                  </div>
                </>
              ) : (
                <>
                  <div class="product-item-inner">
                    <img src={emptycart} alt="" />
                    <h4>No items found in Related Products.</h4>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="review-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <h2>Customer Reviews</h2>
                  <div className="graph-star-rating-header">
                    <div className="d-flex gap-2 mb-2">
                      <div className="fs-15 rating_box">
                        <Rating name="read-only" value={averageFun()} readOnly />
                      </div>
                      <span className="fw-medium"> {averageFun()} out of {reviewList?.length} </span>
                    </div>
                    <p className="mb-3 mt-2">Based on 5 Reviews</p>
                  </div>
                  <div className="graph-star-rating-body mb-4">
                    <div className="rating-list">
                      <div className="rating-list-left text-black">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <div className="rating-list-center">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${getRangeWidth(5)}%` }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div className="rating-list-right text-black">{getReviewCount(5)?.length}</div>
                    </div>
                    <div className="rating-list">
                      <div className="rating-list-left text-black">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </div>
                      <div className="rating-list-center">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${getRangeWidth(4)}%` }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div className="rating-list-right text-black">{getReviewCount(4)?.length}</div>
                    </div>
                    <div className="rating-list">
                      <div className="rating-list-left text-black">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </div>
                      <div className="rating-list-center">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${getRangeWidth(3)}%` }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div className="rating-list-right text-black">{getReviewCount(3)?.length}</div>
                    </div>
                    <div className="rating-list">
                      <div className="rating-list-left text-black">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </div>
                      <div className="rating-list-center">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${getRangeWidth(2)}%` }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div className="rating-list-right text-black">{getReviewCount(2)?.length}</div>
                    </div>
                    <div className="rating-list">
                      <div className="rating-list-left text-black">
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </div>
                      <div className="rating-list-center">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${getRangeWidth(1)}%` }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div className="rating-list-right text-black">{getReviewCount(1)?.length}</div>
                    </div>
                  </div>
                  {/* {
                    authCustomer() &&
                    !checkCustomerAlreadyReviewGiven() &&
                    checkCustomerReview?.review &&
                    <div className="graph-star-rating-footer text-center mt-3 mb-4">
                      <button type="button" className="btn-2 rate-a-reviews" onClick={handleWriteReviewClick}> WRITE A REVIEWS</button>
                    </div>
                  } */}

                  {
                    authCustomer() ?
                      !checkCustomerAlreadyReviewGiven() &&
                      <div className="graph-star-rating-footer text-center mt-3 mb-4">
                        <button type="button" className="btn-2 rate-a-reviews" onClick={handleWriteReviewClick}> WRITE A REVIEWS</button>
                      </div>
                      :
                      <div className="graph-star-rating-footer text-center mt-3 mb-4">
                        <button type="button" className="btn-2 rate-a-reviews" onClick={() => navigate('/login')}> WRITE A REVIEWS</button>
                      </div>
                  }

                  {showContactForm && (
                    <div className="contact-us-inner p-0">
                      <h2>Leave a message</h2>
                      <div className="row">
                        <div className="mb-3 col-sm-12">
                          <label htmlFor="firstName" className="form-label">
                            Name*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            onChange={handleChange}
                            name="name"
                            value={reviewVal?.name}
                            required
                          />
                        </div>
                        <div className="mb-3 col-sm-12">
                          <label className="form-label d-block">Rating</label>

                          {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                              <span key={index} onClick={() => handleClick(ratingValue)} >
                                {ratingValue <= rating ? (
                                  <Star sx={{ fontSize: 30, color: "#E0A11C" }} />
                                ) : (<StarBorderOutlined sx={{ fontSize: 30, color: "#E0A11C" }} />)}
                              </span>
                            );
                          })}
                        </div>
                        <div className="mb-3 col-sm-12">
                          <label className="form-label d-block">
                            Upload Image & Video
                          </label>
                          <div className="outuploadimg">
                            <div className="uploadimg-vdieoouter">
                              <input type="file" accept=".jpg,.jpeg,.png,.mp4,.mov" multiple onChange={handleImageChange} />
                              <i className="fa fa-camera"></i>
                            </div>
                            {/* {selectedImages.map((image, index) => (
                              <div className="lis-timg-upload" key={index}>
                                <img src={URL.createObjectURL(image)}
                                  alt={`Uploaded image ${index}`}
                                />
                                <i className="fa fa-trash" onClick={() => handleDeleteImage(index)}></i>
                              </div>
                            ))} */}

                            {selectedImages.map((file, index) => (
                              <div className="lis-timg-upload" key={index}>
                                {isImage(file) && (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Uploaded file ${index}`}
                                  />
                                )}
                                {isVideo(file) && (
                                  <video width="100%" controls>
                                    <source src={URL.createObjectURL(file)} type={file.type} />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                <i className="fa fa-trash" onClick={() => handleDeleteImage(index)}></i>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3 col-sm-12">
                          <label htmlFor="message" className="form-label">  Your Message </label>
                          <textarea className="form-control" maxLength={1600} id="message" name="review" onChange={handleChange}
                            value={reviewVal?.review} ></textarea>
                          <span className="errMsg">{reviewError}</span>
                          <span>{maxLength - reviewVal.review.length} characters remaining</span>
                        </div>
                        <div className="mb-3 col-sm-5">
                          {
                            submitLoading ? <>
                              <button className="apllynow" type="button">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span class="sr-only">Loading...</span>
                              </button>
                            </>
                              :
                              <button className="apllynow" type="button" onClick={() => handleReview()}>
                                Submit <i className="fa-solid fa-arrow-right"></i>
                              </button>

                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-lg-8">
                  {
                    reviewList?.length > 1 &&
                    <div className="flex-shrink-0 d-flex justify-content-end">
                      <select className="form-select w-auto" id="sort-elem" onChange={handleSortChange}>
                        <option value="">Highest Rating</option>
                        <option value="low_to_high">Low to High</option>
                        <option value="high_to_low">High to Low</option>
                      </select>
                    </div>
                  }
                  <div className="reviews-members">
                    {
                      reviewList?.length > 0 ?
                        reviewList?.slice(0, showAll ? reviewList.length : maxVisibleReviews).map((item, i) => (
                          <div className="revie-feddback">
                            <div className="userrevie-info">
                              <img
                                alt=""
                                src={userimg}
                                className="mr-3 rounded-pill"
                              />
                              <div className="reviews-members-header">
                                <span className="star-rating">
                                  {getReviewStar(item?.star)}
                                </span>
                                <h6>{item?.name}</h6>
                                <p className="text-gray">{timeAgo(item?.created_at)}</p>
                              </div>
                            </div>
                            <div className="media-body">
                              <div className="reviews-members-body">
                                <h6 className="text-uppercase">{item?.name}</h6>
                                <p> {item?.review} </p>

                                <div className="upload-img-show">
                                  {item?.images?.split(',').map((media, i) => {
                                    const isVideo = media.endsWith('.mp4') || media.endsWith('.mov');
                                    const mediaURL = imgBaseURL() + media;


                                    return (
                                      <div key={i} className="media-container m-2" style={{ position: 'relative', width: '150px', height: '150px' }}>
                                        {isVideo ? (
                                          <video
                                            src={mediaURL}
                                            alt={`Video ${i}`}
                                            className="media-thumbnail"
                                            style={{ cursor: 'pointer', width: '150px', height: '150px', objectFit: 'cover' }}
                                            controls
                                            onClick={() => handleImageClick(media)}
                                          />
                                        ) : (
                                          <img
                                            src={mediaURL}
                                            alt={`Image ${i}`}
                                            className="img-thumbnail"
                                            style={{ cursor: 'pointer', width: '150px', height: '150px', objectFit: 'cover' }}
                                            onClick={() => handleImageClick(media)}
                                          />
                                        )}
                                        {/* <i className="fa fa-trash" onClick={() => handleDeleteMedia(i)} style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer' }}></i> */}
                                      </div>
                                    );
                                  })}
                                </div>


                              </div>
                            </div>
                          </div>
                        ))
                        :
                        <></>
                    }

                  </div>
                  {reviewList?.length > maxVisibleReviews && (
                    <div className="text-center">
                      {showAll ? (
                        <button className="btn-2 px-5" onClick={toggleShowAll}>View Less</button>
                      ) : (
                        <button className="btn-2 px-5" onClick={toggleShowAll}>See All Reviews</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* <Spotlight /> */}

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Zoomed Image"
            className="modal-content review_pop_up"
            overlayClassName="modal-overlay"
          >
            <button className="close-button" onClick={closeModal}>
              <i className="fa fa-close"></i>
            </button>
            <div className="fullheight">
              <div className="zoom-container">
                {fullFileCheck ? (
                  <video
                    src={currentImage}
                    controls
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <img
                    src={currentImage}
                    alt="Zoomed Media"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductDetail;
