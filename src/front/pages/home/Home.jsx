import React, { useState, useEffect, useContext } from "react";
import OwlCarousel from "react-owl-carousel";
import emptycart from "../../../assets/img/empty-cart.webp";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "swiper/swiper-bundle.min.css";
import siderbg from "../../../assets/img/sliderbg.png";
import newarrivals from "../../../assets/img/newarrivals.webp";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Review from "../../../components/front/Review";
import { getPercentageOff, imgBaseURL } from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import ProductItemButton from "../../../components/front/ProductItemButton";
import { Rating, Skeleton, imageListClasses } from "@mui/material";
import { APICALL } from "../../../utility/api/api";
import FrontLoader from "../../../components/front/FrontLoader";
import Spotlight from "./../../../components/front/Spotlight";

const imageUrl = [
  "https://aksvedas.com/storage/tags_img/immu.webp",
  "https://aksvedas.com/storage/tags_img/dig.webp",
  "https://aksvedas.com/storage/tags_img/perf.webp",
  "https://aksvedas.com/storage/tags_img/slep.webp",
  "https://aksvedas.com/storage/tags_img/tired.webp",
  "https://aksvedas.com/storage/tags_img/tagimg6.webp",
  "https://aksvedas.com/storage/tags_img/bonee.webp",
  "https://aksvedas.com/storage/tags_img/fitness.webp",
];

const Home = () => {
  const {
    getHomeDataFun,
    getWishlistFun,
    allData,
    wishlistData,
    getCartFun,
    getCustomerDetails,
    categories,
    loading,
    addProductInWishlistFun,
  } = useFrontDataContext();
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init();
  }, []);

  const collections = {
    loop: false,
    autoplay: true,
    autoplaySpeed: 10000,
    smartSpeed: 4000,
    margin: 20,
    dots: false,
    nav: true,
    responsiveClass: true,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
    infinite: true,

    responsive: {
      0: {
        items: 2,
      },
      575: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,

        loop: true,
      },
    },
  };

  const knowledgebaseowl = {
    loop: true,
    autoplayTimeout: 4000, // Autoplay interval in milliseconds
    autoplaySpeed: 1000,
    autoplay: true,
    loop: true,
    margin: 0,
    dots: false,
    nav: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
        loop: true,
      },
    },
  };

  const productslider = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 6000, // Autoplay interval in milliseconds
    autoplaySpeed: 1000,
    margin: 30,
    dots: false,
    nav: true,
    autoplayHoverPause: true, // Stops autoplay on hover
    responsiveClass: true,

    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
    responsive: {
      0: {
        items: 2,
        nav: false,
        margin: 10,
      },
      600: {
        items: 2.5,
        nav: false,
        margin: 10,
      },
      1000: {
        items: 3,
        margin: 10,
      },
      1250: {
        items: 4,
      },
    },
  };

  // Usage in your component
  <OwlCarousel className="owl-theme" {...productslider}>
    {/* Your slides here */}
  </OwlCarousel>;

  const heroslider = {
    loop: true,
    autoplayTimeout: 10000, // Autoplay interval in milliseconds
    autoplay: true,
    autoplaySpeed: 4000,
    margin: 0,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ], // Custom arrow icons
    responsive: {
      0: {
        items: 1,
        nav: false,
        autoplay: true,
        autoplaySpeed: 4000,
      },
      600: {
        items: 1,

        autoplay: true,
        autoplaySpeed: 4000,
        nav: false,
      },
      1000: {
        items: 1,
        margin: 10,
      },

      1250: {
        items: 1,
      },
    },
  };

  const isInWishlist = (productId) => {
    return wishlistData.some((item) => item.product_id === productId);
  };

  useEffect(() => {
    getHomeDataFun();
    getWishlistFun();
    getCartFun();
    getCustomerDetails();
    selectedTagsFun();
  }, []);
  const [wishCount, setWishlistCount] = useState(0);
  useEffect(() => {
    getWishlistFun();
  }, [wishCount]);

  const [tags, setTags] = useState([]);
  const selectedTagsFun = async () => {
    try {
      const res = await APICALL("get-tags/tags");
      if (res?.status) {
        const tagsArray =
          res?.data?.tags?.split?.(",")?.map((tag) => tag?.trim()) || [];
        setTags(tagsArray);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  document.querySelectorAll(".owl-prev").forEach((button) => {
    button.setAttribute("aria-label", "Previous slide");
  });

  document.querySelectorAll(".owl-next").forEach((button) => {
    button.setAttribute("aria-label", "Next slide");
  });

  return (
    <>
      {loading && <FrontLoader />}
      <div class="hero_section d-lg-block d-none">
        <OwlCarousel className="owl-theme" {...heroslider}>
          {allData ? (
            allData?.banner?.map((item, i) => (
              <>
                {item?.title == "null" ? (
              <Link
              to={!item?.url || item?.url !== "null" ? item?.url : "/shop/all"}
              title={item?.name || "Shop Now"} // Adding a discernible name
              aria-label={item?.name || "Shop Now"} // Improves accessibility
            >
             <div className="only_banner">
                      <img
                        src={`${imgBaseURL() + item?.img}`}
                        alt="Banner"
                        style={{
                          objectFit: "cover",
                        }}
                        width="1920"
                        height="1080"
          
                      />
                    </div>
            </Link>
            
                ) : (
                  <div className="item" key={i}>
                    <div
                      className="slider"
                      style={{
                        backgroundImage: `url(${siderbg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="container">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <div
                              className="left_product_about"
                              data-aos="fade-up"
                            >
                              <div className="off_price">30% off</div>
                              <p>{item?.title}</p>
                              <h2>{item?.desc}</h2>
                              <button
                                onClick={() =>
                                  navigate(
                                    !item?.url || item?.url !== "null"
                                      ? item?.url
                                      : "/shop/all"
                                  )
                                }
                                className="btn-2"
                              >
                                Shop Now
                              </button>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="slider_product text-end">
                              <img
                                src={imgBaseURL() + item?.img}
                                alt="slider product"
                                loading="lazy"  // Add lazy loading here
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))
          ) : (
            // Render skeleton loader while data is loading
            <div className="item">
              <div className="slider">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="left_product_about" data-aos="fade-up">
                        <Skeleton height={30} width={200} />
                        <Skeleton height={20} width={300} />
                        <Skeleton height={40} width={200} />
                        <Skeleton height={50} width={150} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="slider_product text-end">
                        <Skeleton height={300} width={300} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OwlCarousel>
      </div>

      <div class="hero_section d-lg-none d-block">
        <OwlCarousel className="owl-theme" {...heroslider}>
          {allData ? (
            allData?.mobileBanner?.map((item, i) => (
              <div className="item" key={i}>
                <div className="slider p-0">
                  <Link to={item?.url !== "null" ? item?.url : "/shop/all"}>
                    <img
                      src={imgBaseURL() + item?.img}
                      alt="slider product"
                      className="img-fluid"
                      loading="lazy"  // Add lazy loading here
                    />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="item">
              <div className="slider">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="left_product_about" data-aos="fade-up">
                        <Skeleton height={30} width={200} />
                        <Skeleton height={20} width={300} />
                        <Skeleton height={40} width={200} />
                        <Skeleton height={50} width={150} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="slider_product text-end mt-0">
                        <Skeleton height={300} width={300} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OwlCarousel>
      </div>

      <section className="bestseller">
        <div className="container">
          <div className="top_bar">
            <div className="global_heading">
              <h2>Aksvedas Products</h2>
            </div>

            <div className="view_all_btn">
              <Link to={"/shop/all"}>View All</Link>
            </div>
          </div>

          {allData?.products?.length > 0 ? (
            <div className="row mt-lg-5 mt-4 pt-lg-0 pt-2">
              <OwlCarousel className="owl-theme" {...productslider}>
                {allData?.products?.map((item, i) => (
                  <div className="item" key={i}>
                    <div className="product_box_main">
                      <div className="quick-access-btns">
                        <button
                          className="btn1"
                          onClick={() => {
                            addProductInWishlistFun(item.id);
                            setWishlistCount(wishCount + 1);
                          }}
                          aria-label={
                            isInWishlist(item.id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isInWishlist(item.id) ? (
                            <i
                              className="fa-solid fa-heart"
                              style={{ fontSize: "18px", color: "#ddad67" }}
                              aria-hidden="true"
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-heart text-white"
                              aria-hidden="true"
                            ></i>
                          )}
                        </button>
                      </div>
                      <div className="img_product">
                        <Link to={`/product-detail/${item?.slug}`}>
                          <img
                            className="withouthover"
                            src={imgBaseURL() + item.cover}
                            alt="product_img"
                            width='300'
                            height="400"
                              loading="lazy"
                          />
                          <img
                            className="withhover"
                            src={imgBaseURL() + item.hover_img}
                            alt="product_img"
                            width='300'
                            height="400"
                              loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="rating_box mt-2">
                        <div className="ratings-custom d-flex align-items-center">
                          <Rating
                            name="read-only"
                            value={item?.review_average}
                            readOnly
                          />
                          {item?.review_count > 0 && (
                            <span>({item?.review_count})</span>
                          )}
                        </div>
                      </div>
                      <div className="product_name">
                        <Link to={`/product-detail/${item?.slug}`}>
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
          ) : (
            <div className="product-item-inner">
              <img src={emptycart} alt="empty-cart" width={300} height={300} />
              <h4>No items found Products.</h4>
            </div>
          )}
        </div>
      </section>

      <section className="bestseller">
        <div className="container">
          <div className="top_bar">
            <div className="global_heading">
              <h2>Combo Products</h2>
            </div>

            <div className="view_all_btn">
              <Link to={"/shop/combo"}>View All</Link>
            </div>
          </div>

          {allData?.comboProductList?.length > 0 ? (
            <div className="row mt-lg-5 mt-4 pt-lg-0 pt-2">
              <OwlCarousel className="owl-theme" {...productslider}>
                {allData?.comboProductList?.map((item, i) => (
                  <div className="item" key={i}>
                    <div className="product_box_main">
                      <div className="quick-access-btns">
                        <button
                          className="btn1"
                          onClick={() => {
                            addProductInWishlistFun(item.id);
                            setWishlistCount(wishCount + 1);
                          }}
                          aria-label={
                            isInWishlist(item.id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isInWishlist(item.id) ? (
                            <i
                              className="fa-solid fa-heart"
                              style={{ fontSize: "18px", color: "#ddad67" }}
                              aria-hidden="true"
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-heart text-white"
                              aria-hidden="true"
                            ></i>
                          )}
                        </button>
                      </div>
                      <div className="img_product">
                        <Link to={`/product-detail/${item?.slug}`}>
                          <img
                            className="withouthover"
                            src={imgBaseURL() + item.cover}
                            alt="product_img"
                            width='300'
                            height="400"
                              loading="lazy"
                          />
                          <img
                            className="withhover"
                            src={imgBaseURL() + item.hover_img}
                            alt="product_img"
                            width='300'
                            height="400"
                              loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="rating_box mt-2">
                        <div className="ratings-custom d-flex align-items-center">
                          <Rating
                            name="read-only"
                            value={item?.review_average}
                            readOnly
                          />
                          {item?.review_count > 0 && (
                            <span>({item?.review_count})</span>
                          )}
                        </div>
                      </div>
                      <div className="product_name">
                        <Link to={`/product-detail/${item?.slug}`}>
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
          ) : (
            <div className="product-item-inner">
              <img src={emptycart} alt="empty-cart " width={300} height={300} />
              <h4>No items found Products.</h4>
            </div>
          )}
        </div>
      </section>

      <section className="shop_by_consern mt-0">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-xxl-4 col-lg-5 mb-lg-0 mb-4">
              <div className="global_heading text-start">
                <h2>Shop By Concern</h2>
                <p className="mt-4">
                  Discover products tailored to your specific health needs.
                </p>
                <Link to={"/shop/all"} className="viewproducts">
                  View All Products <i className="fa fa-chevron-right"></i>
                </Link>
              </div>
            </div>
            <div className="d-lg-none d-block">
              <OwlCarousel className="owl-theme" {...collections}>
                {tags?.map((item, i) => (
                  <Link to={`/shop/t-${item}`}>
                    <div class="item" key={i}>
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          // style={{
                          //   backgroundImage: `url('${imageUrl[i]}')`,
                          //   backgroundSize: "cover",
                          //   backgroundRepeat: "no-repeat",
                          //   backgroundPosition: "center",
                          // }}
                        >
                          <img src={`${imageUrl[i]}`} alt={item} width={100} height={100}  />
                          <div className="categri-title">
                            <h2>{item}</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </OwlCarousel>
            </div>

            <div className="col-xl-6 col-lg-7 d-lg-block d-none">
              <div className="row align-items-center">
                {tags[0] && (
                  <div className="col-md-3 col-sm-6">
                    <div
                      className="cat_box-outer"
                      style={{ marginLeft: "-10px" }}
                    >
                      <Link to={`/shop/t-${tags[0]}`}>
                        <div className="cat_box">
                          <img
                            src="https://aksvedas.com/storage/tags_img/immu.webp"
                            alt="tag img" 
                            width="100"
                            height="100"
                            loading="lazy"
                          ></img>
                          <div className="categri-title">
                            <h2>{tags[0]}</h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    {tags[1] && (
                      <div className="col-md-12 mb-4">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[1]}`}>
                            <div className="cat_box">
                              <img
                                src="https://aksvedas.com/storage/tags_img/dig.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[1]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                    {tags[2] && (
                      <div className="col-md-12 mb-3 ">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[2]}`}>
                            <div className="cat_box">
                              <img
                                src="https://aksvedas.com/storage/tags_img/perf.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[2]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    {tags[3] && (
                      <div className="col-md-12 mb-4">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[3]}`}>
                            <div
                              className="cat_box"
                              // style={{
                              //   backgroundImage: `url('${imgBaseURL() + categories[0]?.cover}')`,
                              //   backgroundSize: "cover",
                              //   backgroundRepeat: "no-repeat",
                              //   backgroundPosition: "center",
                              // }}
                            >
                              <img
                                src="https://aksvedas.com/storage/tags_img/slep.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[3]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}

                    {tags[4] && (
                      <div className="col-md-12 mb-4 ">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[4]}`}>
                            <div
                              className="cat_box"
                              // style={{
                              //   backgroundImage: `url('${imgBaseURL() + categories[2]?.cover}')`,
                              //   backgroundSize: "cover",
                              //   backgroundRepeat: "no-repeat",
                              //   backgroundPosition: "center",
                              // }}
                            >
                              <img
                                src="https://aksvedas.com/storage/tags_img/tired.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[4]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}

                    {tags[5] && (
                      <div className="col-md-12 mb-4 ">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[5]}`}>
                            <div
                              className="cat_box"
                              // style={{
                              //   backgroundImage: `url('${imgBaseURL() + categories[0]?.cover}')`,
                              //   backgroundSize: "cover",
                              //   backgroundRepeat: "no-repeat",
                              //   backgroundPosition: "center",
                              // }}
                            >
                              <img
                                src="https://aksvedas.com/storage/tags_img/tagimg6.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[5]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    {tags[6] && (
                      <div className="col-md-12 mb-4 ">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[6]}`}>
                            <div
                              className="cat_box"
                              // style={{
                              //   backgroundImage: `url('${imgBaseURL() + categories[2]?.cover}')`,
                              //   backgroundSize: "cover",
                              //   backgroundRepeat: "no-repeat",
                              //   backgroundPosition: "center",
                              // }}
                            >
                              <img
                                src="https://aksvedas.com/storage/tags_img/bonee.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[6]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}

                    {tags[7] && (
                      <div className="col-md-12 mb-4 ">
                        <div className="cat_box-outer">
                          <Link to={`/shop/t-${tags[7]}`}>
                            <div
                              className="cat_box"
                              // style={{
                              //   backgroundImage: `url('${imgBaseURL() + categories[1]?.cover}')`,
                              //   backgroundSize: "cover",
                              //   backgroundRepeat: "no-repeat",
                              //   backgroundPosition: "center",
                              // }}
                            >
                              <img
                                src="https://aksvedas.com/storage/tags_img/fitness.webp"
                                alt="tag img"
                                width="100"
                                height="100"
                                loading="lazy"
                              ></img>

                              <div className="categri-title">
                                <h2>{tags[7]}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="new_arrivals">
        <div className="container">
          <div className="global_heading text-center">
            <h2>New Arrivals</h2>
          </div>
          <div className="row mt-lg-5 mt-4 pt-lg-0 pt-2">
            {allData?.newArrivals?.length > 0 ? (
              <>
                {allData?.newArrivals?.map((item, i) => (
                  <div className="col-lg-6 mb-lg-0 mb-4">
                    <div
                      className="new_arrivals_box"
                      style={{
                        backgroundImage: `url(${newarrivals})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="product_cnt">
                        <div className="product_type">Immunity Booster</div>
                        <div className="new_arrival_product_name">
                          {item?.name}
                        </div>
                        {/* <div className="new_arrival_details">
                          <div className="d-block text-wrap mt-2">
                            {" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.description,
                              }}
                            />
                          </div>
                        </div> */}
                        <button
                          className="shop_now btn-2 mt-3"
                          onClick={() =>
                            navigate(`/product-detail/${item.slug}`)
                          }
                        >
                          Shop Now <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                      <div
                        className="product_box_new"
                        onClick={() => navigate(`/product-detail/${item.slug}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="new_arrival_product">
                          <img
                            src={imgBaseURL() + item.cover}
                            alt="product_img"
                            width="100"
                            height="100"
                            loading="lazy"

                          />
                          <div className="product_tags">
                            <div className="new_tag">New</div>
                            <div className="price_new">₹{item.sale_price}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>

      <Spotlight spotlight={allData?.spotlight} />

      <section className="about_experince">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-md-0 mb-4" data-aos="fade-left">
              <div className="images_box">
                <div className="big_one_img">
                  <img
                    src={imgBaseURL() + allData?.getAyurvedExperience?.img1}
                    alt="img"
                    width="100%"
                    height="auto"
                  />
                </div>
                <div className="small_second_image">
                  {allData?.getAyurvedExperience?.img2 && (
                    <img
                      src={imgBaseURL() + allData?.getAyurvedExperience?.img2}
                      alt="img"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6" data-aos="fade-right">
              <div className="expert_cnt">
                <h2>{allData?.getAyurvedExperience?.title}</h2>
                <div className="d-block text-wrap mt-2">
                  {" "}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: allData?.getAyurvedExperience?.desc,
                    }}
                  />
                  <div className="doble_btn text-md-start text-center ">
                    <Link
                      className="shop_now btn-2"
                      to={allData?.getAyurvedExperience?.product_url}
                    >
                      Shop Now <i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="concern_new">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-3 mb-3">
              <div className="global_heading text-start">
                <h2>Shop By Concern</h2>
                <p className="mt-4">
                  Discover products tailored to your specific health needs.
                </p>
                <Link to={"/shop/all"} className="viewproducts">
                  View All Products <i className="fa fa-chevron-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-8 mb-3">
              <div className="all_tags_classes">
                <ul className="p-0">
                  {tags?.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={`/shop/t-${item}`}
                        className="global_tra_btn my-1"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {allData ? (
        <Review />
      ) : (
        <Skeleton variant="rectangular" width={360} height={240} />
      )}

      <section className="product_knowlenge_base d-lg-block d-none">
        <div className="container-fluid px-lg-0 px-3">
          <div className="global_heading text-center mb-3">
            <h2>Product Knowledge Base</h2>
          </div>
          <OwlCarousel className="mt-5 owl-theme" {...knowledgebaseowl}>
            {allData?.ProductKnowledgeBase?.map((item, i) => (
              <div className="item">
                <div className="row justify-content-between align-items-center ">
                  <div className="col-xl-12 col-lg-12 col-md-12 mb-md-0 ">
                    <div className="product_img">
                      {allData ? (
                        <>
                          <Link
                            to={item?.product_url ? item?.product_url : "#"}
                            target="_blank"
                          >
                            <img
                              src={imgBaseURL() + item?.img1}
                              alt="product_img"
                            />
                          </Link>
                        </>
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={360}
                          height={240}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="col-xl-7 col-lg-7 col-md-6 ">
                    <div className="product_cnt ps-md-5">
                      <h2>{item?.title}</h2>
                      <HTMLContent data={item?.desc} />
                      {allData ? (
                        <button
                          className="shop_now btn-2 mt-1"
                          onClick={() => navigate("/shop/all")}
                        >
                          Shop Now
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </section>

      <section className="product_knowlenge_base d-lg-none d-block">
        <div className="container">
          <div className="global_heading text-center mb-3">
            <h2>Product Knowledge Base</h2>
          </div>
        </div>
        <OwlCarousel className="mt-5 owl-theme" {...knowledgebaseowl}>
          {allData?.ProductKnowledgeBaseMobile?.map((item, i) => (
            <div className="item">
              <div className="row justify-content-between align-items-center ">
                <div className="col-xl-12 col-lg-12 col-md-12 mb-md-0 ">
                  <div className="product_img">
                    {allData ? (
                      <Link
                        to={item?.product_url ? item?.product_url : "#"}
                        target="_blank"
                      >
                        <img
                          src={imgBaseURL() + item?.img1}
                          alt="product_img"
                        />
                      </Link>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        width={360}
                        height={240}
                      />
                    )}
                  </div>
                </div>
                {/* <div className="col-xl-7 col-lg-7 col-md-6 ">
                    <div className="product_cnt ps-md-5">
                      <h2>{item?.title}</h2>
                      <HTMLContent data={item?.desc} />
                      {allData ? (
                        <button
                          className="shop_now btn-2 mt-1"
                          onClick={() => navigate("/shop/all")}
                        >
                          Shop Now
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </div>
                  </div> */}
              </div>
            </div>
          ))}
        </OwlCarousel>
      </section>
    </>
  );
};

export default Home;
