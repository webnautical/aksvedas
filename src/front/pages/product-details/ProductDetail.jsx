import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import userimg from "../../../assets/img/revie-user.png";
import shilajieetabout from "../../../assets/img/shilajeet-about.jpg";
import shilajieet from "../../../assets/img/shilajieet.png";
import gauntee from "../../../assets/img/gauntee.png";
import benefits1 from "../../../assets/img/2-s.webp";
import benefits2 from "../../../assets/img/shilajitbenfuse-1.webp";
import benefits3 from "../../../assets/img/3-s.webp";
import step1 from "../../../assets/img/step1.png";
import pro from "../../../assets/img/product1.png";
import icon1 from "../../../assets/img/icon1.png";
import icon2 from "../../../assets/img/icon2.png";
import icon3 from "../../../assets/img/icon3.png";
import icon4 from "../../../assets/img/icon4.png";
import step2 from "../../../assets/img/step2.png";
import step3 from "../../../assets/img/step3.png";
import step4 from "../../../assets/img/step4.png";
import step5 from "../../../assets/img/step5.png";
import productimg from "../../../assets/img/product.png";
import productimgsec from "../../../assets/img/productsec.png";
import Spotlight from "../../../components/front/Spotlight";
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
import { postDataAPI } from "../../../utility/api/api";
import { getPercentageOff, imgBaseURL } from "../../../utility/Utility";
import HTMLContent from "../../../components/HTMLContent";
import { addToCartRepeater } from "../../../utility/api/RepeaterAPI";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
const ProductDetail = () => {
  const { getWishlistFun,getCartFun } = useFrontDataContext()

  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [productDetails, setProductDetails] = useState(null)
  const [productContents, setProductContents] = useState(null)
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedVideos([...selectedVideos, ...files]);
  };

  const handleDeleteImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  const handleDeleteVideo = (index) => {
    const newVideos = [...selectedVideos];
    newVideos.splice(index, 1);
    setSelectedVideos(newVideos);
  };
  const [rating, setRating] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const handleClick = (value) => {
    setRating(value);
  };

  const handleWriteReviewClick = () => {
    setShowContactForm(true);
  };

  const [productImages, setProductImages] = useState([])
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Function to format the quantity with leading zeros if less than 10
  const formatQuantity = (quantity) => {
    return quantity < 10 ? `0${quantity}` : quantity;
  };

  const benefitsshilajit = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 100,
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
        loop: true,
      },

      1250: {
        items: 3,
        loop: true,
      },
    },
  };
  const productslider = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 100,
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
      getProductDetailsFun()
    } else {
      navigate(`/shop`)
    }
  }, [slug])


  const getProductDetailsFun = async () => {
    try {
      setLoading(true)
      const param = { slug: slug }
      const res = await postDataAPI('/v1/get-product-details', param)
      if (res?.status) {
        setProductDetails(res?.data?.details)
        setProductContents(res?.data?.product_content)
        getRelatedProductFun(res?.data?.details?.category?.slug)
        if (res?.data?.product_images?.length > 0) {
          setProductImages(res.data?.details?.product_images.map(image => imgBaseURL() + image.src));
        } else {
          setProductImages([imgBaseURL() + res?.data?.details?.cover])
        }
        setLoading(false)
      } else {
        setProductDetails(null)
        setLoading(false)
      }
    } catch (error) {
      setProductDetails(null)
      setLoading(false)
    }
  }

  const [relatedProduct, setRelatedProducts] = useState([])
  const getRelatedProductFun = async (categorySlug) => {
    try {
      setLoading(true)
      const param = { type: 'category', slugs: [categorySlug] }
      const res = await postDataAPI('/v1/get-products', JSON.stringify(param))
      if (res?.status) {
        setRelatedProducts(res?.data)
        setLoading(false)
      } else {
        setRelatedProducts(null)
        setLoading(false)
      }
    } catch (error) {
      setRelatedProducts(null)
      setLoading(false)
    }
  }

  const addToCartFun = async (type) => {
    const param = {product_id: productDetails?.id, qnt: quantity }
    addToCartRepeater(param,getWishlistFun,getCartFun)
    if(type == 'buy'){
      navigate('/checkout')
    }
  }

  return (
    <>
      <div className="product-details">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb" className="breacrumb-custom py-md-3 py-2" separator={<NavigateNextIcon fontSize="small" />}>
            <Link to={'/'} underline="hover">Home</Link>
            <Link to={'/collections'} underline="hover" color="inherit">Collections</Link>
            <Typography>{productDetails?.category?.name}</Typography>
            <Typography>{productDetails?.name}</Typography>
          </Breadcrumbs>
          <div className="thumb-slider-pro mt-md-0 mt-4">
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
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <span className="fw-medium"> (4)</span>
                    </div>
                    <div className="skuno">
                      <ul>
                        <li> Sku: <strong>{productDetails?.sku}</strong></li>
                        <li>
                          Availability:{" "}
                          {
                            productDetails?.quantity ?
                              <span className="instock">In Stock</span>
                              :
                              <span className="outoff-stock">Out off Stock</span>
                          }
                        </li>
                        <li className="text-capitalize">Category: <strong>{productDetails?.category?.name}</strong></li>
                      </ul>
                    </div>
                    {/* <div className="row">
                      <div className="col-lg-8 col-md-6">
                        <div className="select-plan">
                          <p>Subscription Plan</p>
                          <div className="radio-options">
                            <label className="custom-radio w-100">
                              <input
                                type="radio"
                                name="priceOption"
                                value="All Price"
                                checked
                              />
                              <span className="checkmark"></span>30 Days ₹1,39 9
                              @22% off
                            </label>
                            <label className="custom-radio w-100">
                              <input
                                type="radio"
                                name="priceOption"
                                value="All Price"
                                checked
                              />
                              <span className="checkmark"></span>60 Days ₹3,569
                              @34% off off
                            </label>
                            <label className="custom-radio w-100">
                              <input
                                type="radio"
                                name="priceOption"
                                value="All Price"
                                checked
                              />
                              <span className="checkmark"></span>90 Days ₹3,569
                              @34% off off
                            </label>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <h5 className="fs-24">
                      ₹{productDetails?.sale_price}{' '}
                      <span className="text-muted">
                        <del>₹{productDetails?.price}{' '}</del>
                      </span>{" "}
                      <span className="fs-14 ms-2"> ({getPercentageOff(productDetails?.price, productDetails?.sale_price)} % OFF)</span>
                    </h5>
                    <div className="product-button">
                      <div className="input-step">
                        <button type="button" className="minus" onClick={handleDecrement}>–</button>
                        <input type="text" className="product-quantity1" value={formatQuantity(quantity)}readOnly/>
                        <button type="button" className="plus"  onClick={handleIncrement}>+</button>
                      </div>

                      <div className="doble_btn-pro">
                        <button className="btn-2" onClick={() => addToCartFun("cart")}>
                          Add To cart <i className="ms-2 fa fa-cart-plus"></i>
                        </button>
                        <button className="btn-2 buy-btn" onClick={() => addToCartFun("buy")}>Buy Now</button>
                      </div>
                    </div>

                    <div className="delivery-datecheck">
                      <p>Check Delivery Date</p>
                      <div className="subscribe-date">
                        <input
                          className="ps-1"
                          type="text"
                          placeholder="Enter Your Email"
                        />
                        <div className="submit">
                          <button className="shop_now btn-2">Subscribe</button>
                        </div>
                      </div>
                      <p className="bold-fre-deli">
                        FREE delivery between <span>16 - 17 Feb</span> to Jaipur
                      </p>
                    </div>
                    <div className="gurantee-safe">
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
          <div className="how-use">
            <div className="row">
              <div className="col-xl-6 col-md-7 col-sm-8 mx-auto">
                <div className="get-special">
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
                </div>
                <div className="row row-cols-2 row-cols-sm-2 row-cols-xl-4 row-cols-lg-4 row-cols-md-2 g-3 mt-md-4 mt-4 mb-2">
                  <div className="col">
                    <div className="iconpro-box">
                      <img src={icon1} alt="footer_logo" />
                      <h5>Formulated by Ayurvedic Experts</h5>
                    </div>
                  </div>
                  <div className="col">
                    <div className="iconpro-box">
                      <img src={icon2} alt="footer_logo" />
                      <h5>5% off on online payment</h5>
                    </div>
                  </div>
                  <div className="col">
                    <div className="iconpro-box">
                      <img src={icon3} alt="footer_logo" />
                      <h5>Easy Refunds</h5>
                    </div>
                  </div>
                  <div className="col">
                    <div className="iconpro-box">
                      <img src={icon4} alt="footer_logo" />
                      <h5>5% cashback on all orders</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Know About */}
          {
            productContents?.knowabout?.length > 0 &&
            <>
              <div className="how-use mb-md-5 mb-4">
                <h3>Know About {productDetails?.name}</h3>
                <div className="row">
                  <div className="col-xl-8 col-md-9  mx-auto">
                    <div className="about-shilajit">
                      <div className="row mx-0">
                        <div className="col-sm-6 px-0">
                          <div className="about-shilajit-inner">
                            <h4> {productContents?.knowabout[0]?.title}</h4>
                            <HTMLContent data={productContents?.knowabout[0]?.desc} />
                          </div>
                        </div>
                        <div className="col-sm-6 px-0">
                          <div className="about-shilaimg">
                            {" "}
                            <img src={imgBaseURL() + productContents?.knowabout[0]?.img} alt=""></img>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-center mt-4">
                  <div className="col-lg-3 col-md-4">
                    <div className="product-button">
                      <div className="doble_btn-pro">
                        <Link className="btn-2" to="/shop">
                          Donwload Attachment
                          <i className="ms-2 fa-solid fa-download"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }

          {/* Benefits */}
          {
            productDetails?.product_benefits?.length > 0 &&
            <>
              <div className="how-use mb-md-5 mb-4">
                <h3>Benefits of {productDetails?.name}</h3>
                <OwlCarousel className="owl-theme " {...benefitsshilajit}>

                  {
                    productDetails?.product_benefits?.map((item, i) => (
                      <div className="item">
                        <div className="benefitsshilajits">
                          <BenifitsVideo thumbnailSrc={benefits2} />

                          <h4>{item?.title}</h4>
                        </div>
                      </div>
                    ))
                  }

                  {/* <div className="item">
                    <div className="benefitsshilajits">
                      <BenifitsVideo thumbnailSrc={benefits2} />

                      <h4>Helps in boosting stamina & vitality</h4>
                    </div>
                  </div> */}

                </OwlCarousel>
              </div>
            </>
          }

          {/* Key Ingredients */}
          {
            productContents?.keyingredients?.length > 0 &&
            <>
              <div className="how-use">
                <h3>Key Ingredients</h3>
                <div className="row justify-content-center">
                  {
                    productContents?.keyingredients?.map((item, i) => (
                      <div className="col-md-4 col-sm-6  mb-md-5 mb-4">
                        <div className="keyingrents">
                          <img src={imgBaseURL() + item?.img} alt=""></img>
                          <h4>{item?.title}</h4>
                          <HTMLContent data={item?.desc} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </>
          }

          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* How to use */}
              {
                productContents?.useoff?.length > 0 &&
                <>
                  <div className="how-use">
                    <h3>How to use {productDetails?.name}</h3>
                    <div className="row justify-content-center">
                      {productContents?.useoff?.map((item, i) => (
                        <div className="col-sm-6">
                          <div className="how-tobox">
                            <div className="how-imgbox">
                              <img src={imgBaseURL() + item?.img} alt=""></img>
                            </div>
                            <h4>Step {i + 1}</h4>
                            <HTMLContent data={item?.desc} />
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </>
              }

              {/* recommended with */}

              {
                productContents?.recommendedwith?.length > 0 &&
                <>
                  <div className="how-use">
                    <h3>{productDetails?.name} is recommended with</h3>

                    <div className="row justify-content-center">
                      {productContents?.recommendedwith?.map((item, i) => (
                        <div className="col-sm-6 mb-md-5 mb-4">
                          <div className="how-tobox">
                            <div className="how-imgbox">
                              <img src={imgBaseURL() + item?.img} alt=""></img>
                            </div>
                            <h4>{item.title}</h4>
                            <HTMLContent data={item?.desc} />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </>
              }
            </div>
          </div>

          {/* FAQ */}

          {
            productContents?.faq?.length > 0 &&
            <>
              <div className="how-use">
                <div className="faq-section">
                  <h3>FAQ</h3>

                  <div className="row">
                    <div className="col-lg-8 mx-auto">
                      <div className="accordion accordion-flush" id="accordionFlushExample">
                        {productContents?.faq?.map((item, i) => (
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingOne">
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
                              className={`accordion-collapse collapse ${i == 0 && 'show'}`}
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
          }

        </div>
      </section>


      <section className="bestseller">
        <div className="container">
          <div className="global_heading text-center mb-5">
            <h2>Aksvedas Related Products</h2>
          </div>

          {
            relatedProduct?.length > 0 ?
              <>
                <div className="row mt-5">
                  <OwlCarousel className="owl-theme" {...productslider}>

                    {
                      relatedProduct?.map((item, i) => (
                        <div className="item">
                          <div className="product_box_main">
                            <div className="quick-access-btns">
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
                              <button className="btn-2 w-100">
                                <i className="me-1 fa-solid fa-cart-plus"></i>Add To cart
                              </button>
                            </div>

                            <div className="off_price_badge">{parseInt(getPercentageOff(item.price, item.sale_price)) || 0}% off</div>
                          </div>
                        </div>
                      ))

                    }

                  </OwlCarousel>
                </div>
              </>
              :
              <>
                <div className='col-12 text-center  mt-4'>
                  <h6 className='text-danger'>There are no product to display.</h6>
                </div>
              </>
          }
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
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <span className="fw-medium"> 4 out of 5 </span>
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
                        style={{ width: "75%" }} // Change the width as desired
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="rating-list-right text-black">3</div>
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
                        style={{ width: "75%" }} // Change the width as desired
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="rating-list-right text-black">3</div>
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
                        style={{ width: "75%" }} // Change the width as desired
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="rating-list-right text-black">3</div>
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
                        style={{ width: "75%" }} // Change the width as desired
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="rating-list-right text-black">3</div>
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
                        style={{ width: "75%" }} // Change the width as desired
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="rating-list-right text-black">3</div>
                </div>
              </div>
              <div className="graph-star-rating-footer text-center mt-3 mb-4">
                <button
                  type="button"
                  className="btn-2 rate-a-reviews"
                  onClick={handleWriteReviewClick}
                >
                  WRITE A REVIEWS
                </button>
              </div>
              {showContactForm && (
                <div className="contact-us-inner p-0">
                  <h2>Leave a message</h2>
                  <form>
                    <div className="row">
                      <div className="mb-3 col-sm-6">
                        <label htmlFor="firstName" className="form-label">
                          Name*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          required
                        />
                      </div>
                      <div className="mb-3 col-sm-6">
                        <label htmlFor="email" className="form-label ">
                          Your Email*
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          required
                        />
                      </div>
                      <div className="mb-3 col-sm-12">
                        <label className="form-label d-block">Rating</label>

                        {[...Array(5)].map((_, index) => {
                          const ratingValue = index + 1;
                          return (
                            <span
                              key={index}
                              onClick={() => handleClick(ratingValue)}
                            >
                              {ratingValue <= rating ? (
                                <Star sx={{ fontSize: 30, color: "#ffd600" }} />
                              ) : (
                                <StarBorderOutlined
                                  sx={{ fontSize: 30, color: "#ffd600" }}
                                />
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mb-3 col-sm-12">
                        <label className="form-label d-block">
                          Upload Image
                        </label>
                        <div className="outuploadimg">
                          <div className="uploadimg-vdieoouter">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                            />
                            <i className="fa fa-camera"></i>
                          </div>
                          {selectedImages.map((image, index) => (
                            <div className="lis-timg-upload" key={index}>
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Uploaded image ${index}`}
                              />
                              <i
                                className="fa fa-trash"
                                onClick={() => handleDeleteImage(index)}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3 col-sm-12">
                        <label className="form-label d-block">
                          Upload Video
                        </label>
                        <div className="outuploadimg">
                          <div className="uploadimg-vdieoouter">
                            <input
                              type="file"
                              accept="video/*"
                              multiple
                              onChange={handleVideoChange}
                            />
                            <i className="fa fa-video"></i>
                          </div>
                          {selectedVideos.map((video, index) => (
                            <div key={index} className="lis-timg-upload">
                              <video key={index} controls>
                                <source
                                  src={URL.createObjectURL(video)}
                                  type={video.type}
                                />
                                Your browser does not support the video tag.
                              </video>
                              <i
                                className="fa fa-trash"
                                onClick={() => handleDeleteVideo(index)}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3 col-sm-12">
                        <label htmlFor="message" className="form-label">
                          Your Message
                        </label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                        ></textarea>
                      </div>
                      <div className="mb-3 col-sm-5">
                        <button className="apllynow">
                          Submit <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="col-lg-8">
              <div className="flex-shrink-0 d-flex justify-content-end">
                <select className="form-select w-auto" id="sort-elem">
                  <option value="">Highest Rating</option>
                  <option value="low_to_high">Low to High</option>
                  <option value="high_to_low">High to Low</option>
                </select>
              </div>
              <div className="reviews-members">
                <div className="revie-feddback">
                  <div className="userrevie-info">
                    <img alt="" src={userimg} className="mr-3 rounded-pill" />
                    <div className="reviews-members-header">
                      <span className="star-rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </span>
                      <h6>Singh Osahan</h6>
                      <p className="text-gray">Tue, 20 Mar 2020</p>
                    </div>
                  </div>
                  <div className="media-body">
                    <div className="reviews-members-body">
                      <h6>Great Fits</h6>
                      <p>
                        Contrary to popular belief, Lorem Ipsum is not simply
                        random text. It has roots in a piece of classical Latin
                        literature from 45 BC, making it over 2000 years old.
                        Richard McClintock, a Latin professor at Hampden-Sydney
                        College in Virginia, looked up one of the more obscure
                        Latin words, consectetur, from a Lorem Ipsum passage,
                        and going through the cites of the word in classical
                        literature, discovered the undoubtable source. Lorem
                        Ipsum comes from sections{" "}
                      </p>
                      <div className="upload-img-show">
                        <img src={pro} alt=""></img>
                        <img src={pro} alt=""></img>
                        <img src={pro} alt=""></img>
                        <img src={pro} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="revie-feddback">
                  <div className="userrevie-info">
                    <img alt="" src={userimg} className="mr-3 rounded-pill" />
                    <div className="reviews-members-header">
                      <span className="star-rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </span>
                      <h6>Singh Osahan</h6>
                      <p className="text-gray">Tue, 20 Mar 2020</p>
                    </div>
                  </div>
                  <div className="media-body">
                    <div className="reviews-members-body">
                      <h6>Great Fits</h6>
                      <p>
                        Contrary to popular belief, Lorem Ipsum is not simply
                        random text. It has roots in a piece of classical Latin
                        literature from 45 BC, making it over 2000 years old.
                        Richard McClintock, a Latin professor at Hampden-Sydney
                        College in Virginia, looked up one of the more obscure
                        Latin words, consectetur, from a Lorem Ipsum passage,
                        and going through the cites of the word in classical
                        literature, discovered the undoubtable source. Lorem
                        Ipsum comes from sections{" "}
                      </p>
                      <div className="upload-img-show">
                        <img src={pro} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button className="btn-2 px-5">See All Reviews</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Spotlight></Spotlight>
    </>
  );
};

export default ProductDetail;
