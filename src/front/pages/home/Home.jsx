import React, { useState, useEffect, useContext } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "swiper/swiper-bundle.min.css";
import siderbg from "../../../assets/img/sliderbg.png";
import freecall from "../../../assets/img/bgcall.png";
import siderproduct from "../../../assets/img/sliderpro.png";
import newarrivals from "../../../assets/img/newarrivals.png";
import productimg from "../../../assets/img/product.png";
import productimgsec from "../../../assets/img/productsec.png";
import experincesecimg from "../../../assets/img/green.png";
import smallimg from "../../../assets/img/smallimg.png";
import { Link, useNavigate } from "react-router-dom";
import newarrive from "../../../assets/img/newarriveproduct.png";
import cat from "../../../assets/img/cat.png";
import cons from "../../../assets/img/counsult (1).png";
import conss from "../../../assets/img/counsult (2).png";
import subs from "../../../assets/img/subs.png";
import knowledgebase from "../../../assets/img/shilajit.png";
import blogsimg from "../../../assets/img/blogs (1).png";
import AOS from "aos";
import "aos/dist/aos.css";
import Spotlight from "../../../components/front/Spotlight";
import Review from "../../../components/front/Review";
import { getPercentageOff, imgBaseURL } from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import FrontLoding from "../../../components/FrontLoding";
import { addToCartRepeater } from "../../../utility/api/RepeaterAPI";

const Home = () => {

  const { getHomeDataFun, getWishlistFun, allData,getCartFun,getCustomerDetails } = useFrontDataContext()
  const navigate = useNavigate()
  useEffect(() => {
    AOS.init();
  }, []);
  const blogs = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,

    responsive: {
      0: {
        items: 1.2,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,

        loop: true,
      },
    },
  };
  const collections = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,

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
    autoplay: true,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,

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
        items: 1.2,
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

  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    // You can add any logic for maximum quantity if needed
    setQuantity(quantity + 1);
  };
  const [loading, setLoading] = useState(false)

  useEffect( ()  => {
    setLoading(true)
    getHomeDataFun()
    setLoading(false)
    getWishlistFun()
    getCartFun()
    getCustomerDetails()
  }, [])


  const addToCartFun = async (type, product_id) => {
    const param = {product_id: product_id, qnt: 1 }
    addToCartRepeater(param,getWishlistFun,getCartFun)
    if(type == 'buy'){
      navigate('/checkout')
    }
  }

  return (
    <>
      <section
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
              <div className="left_product_about" data-aos="fade-up">
                <div className="off_price">30% off</div>
                <p>
                  {/* <span className="highlight_txt">free delivery</span> on all
                  orders */}
                  {allData?.banner[0]?.title}
                </p>
                <h2>
                  {allData?.banner[0]?.desc}
                </h2>
                <button className="btn-2 ">Shop Now</button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="slider_product text-end">
                <img src={imgBaseURL() + allData?.banner[0]?.img} alt="slider product" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bestseller">
        <div className="container">
          <div className="top_bar">
            <div className="global_heading">
              <h2>Aksvedas Products</h2>
            </div>

            <div className="view_all_btn">
              <Link to={'/shop/all'}>View All</Link>
            </div>
          </div>

          {
            allData?.products?.length > 0 ?
              <>
                <div className="row mt-5">
                  <OwlCarousel className="owl-theme" {...productslider}>

                    {
                      allData?.products?.map((item, i) => (
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
                              <button className="btn-2 w-100" onClick={() => addToCartFun("buy", item.id)}>
                                Buy Now <i className="fa-solid fa-arrow-right"></i>
                              </button>
                              <button className="btn-2 w-100" onClick={() => addToCartFun("cart", item.id)}>
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


      {/* The Ultimate Ayurved Experience */}
      <section className="about_experince">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-md-0 mb-4" data-aos="fade-left">
              <div className="images_box">
                <div className="big_one_img">
                  <img src={imgBaseURL() + allData?.getAyurvedExperience?.img1} alt="img" />
                </div>
                <div className="small_second_image">
                  <img src={imgBaseURL() + allData?.getAyurvedExperience?.img2} alt="img" />
                </div>
              </div>
            </div>

            <div className="col-md-6" data-aos="fade-right">
              <div className="expert_cnt">
                <h2>{allData?.getAyurvedExperience?.title}</h2>
                <div className='d-block text-wrap mt-2'> <div dangerouslySetInnerHTML={{ __html:  allData?.getAyurvedExperience?.desc }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* New Arrivals */}
      <section className="new_arrivals">
        <div className="container">
          <div className="global_heading text-center">
            <h2>New Arrivals</h2>
          </div>
          <div className="row mt-5">
            {
              allData?.newArrivals?.length > 0 ?

                <>
                  {
                    allData?.newArrivals?.map((item, i) => (
                      <div className="col-lg-6">
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
                            <div className="product_type">IMMUNITY BOOSTER</div>
                            <div className="new_arrival_product_name">
                              {item?.name}
                            </div>
                            <div className="new_arrival_details">
                            <div className='d-block text-wrap mt-2'> <div dangerouslySetInnerHTML={{ __html: item?.description }} /></div>
                            </div>
                            <button className="shop_now btn-2 mt-3">
                              Shop Now <i className="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                          <div className="product_box_new">
                            <div className="new_arrival_product">
                              <img src={imgBaseURL() + item.cover} alt="product_img" />
                              <div className="product_tags">
                                <div className="new_tag">New</div>
                                <div className="price_new">₹{item.sale_price}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </>
                :
                <></>
            }


            {/* <div className="col-lg-6">
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
                  <div className="product_type">IMMUNITY BOOSTER</div>
                  <div className="new_arrival_product_name">
                    Pure Himalayan Shilajit
                  </div>
                  <div className="new_arrival_details">
                    Lorem ipsum dolor sit amet consectetur. Morbi cursus diam
                    morbi elit consequat pretium sollicitudin. Facilisi sit eget
                    in massa nibh in turpis. Enim quisque leo eleifend
                    vel.laoreet diam.
                  </div>
                  <button className="shop_now btn-2 mt-3">
                    Shop Now <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                <div className="product_box_new">
                  <div className="new_arrival_product">
                    <img src={newarrive} alt="product_img" />
                    <div className="product_tags">
                      <div className="new_tag">New</div>
                      <div className="price_new">₹120</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </section>
      <Spotlight></Spotlight>
      <section className="shop_by_consern">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-xxl-3 col-lg-4 mb-lg-0 mb-4">
              <div className="global_heading text-start">
                <h2>Shop By Concern</h2>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa.
                </p>
                <a href="" className="viewproducts">
                  View All Products <i className="fa fa-chevron-right"></i>
                </a>
              </div>
            </div>
            <div className="d-lg-none d-block">
              <OwlCarousel className="owl-theme" {...collections}>
                <div class="item">
                  <div className="cat_box-outer">
                    <div
                      className="cat_box"
                      style={{
                        backgroundImage: `url('${cat}')`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="categri-title">
                        <h2>Hair Care</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
            <div className="col-xl-6 col-lg-7 d-lg-block d-none">
              <div className="row align-items-center">
                <div className="col-md-3 col-sm-6 p-0">
                  <div className="cat_box-outer">
                    <div
                      className="cat_box"
                      style={{
                        backgroundImage: `url('${cat}')`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="categri-title">
                        <h2>Hair Care</h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    <div className="col-md-12 mb-4 p-0">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-3 p-0 ">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    <div className="col-md-12 mb-4 p-0">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-4 p-0 ">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-3 p-0 ">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="row">
                    <div className="col-md-12 mb-4 p-0">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-3 p-0 ">
                      <div className="cat_box-outer">
                        <div
                          className="cat_box"
                          style={{
                            backgroundImage: `url('${cat}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="categri-title">
                            <h2>Hair Care</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="freecalll"
        style={{
          backgroundImage: `url(${freecall})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="main_counsult_cust_box">
                <div className="img_box">
                  <img src={cons} alt="img" />
                </div>
                <div className="main_counsult_cust_box_cnt">
                  <h2>Free Doctor Consultant</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Morbi cursus diam
                    morbi elit consequat pretium sollicitudin. Facilisi sit eget
                    in massa nibh in turpis. Enim quisqu.
                  </p>
                  <button className="shop_now btn-2 mt-1">
                    Contact Us <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="main_counsult_cust_box">
                <div className="img_box">
                  <img src={conss} alt="img" />
                </div>
                <div className="main_counsult_cust_box_cnt">
                  <h2>Free Doctor Consultant</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Morbi cursus diam
                    morbi elit consequat pretium sollicitudin. Facilisi sit eget
                    in massa nibh in turpis. Enim quisqu.
                  </p>
                  <button className="shop_now btn-2 mt-1">
                    Customise Now <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="subs_product" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="subs_prodect_img">
                <img src={subs} alt="product_img" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="subs_cnt">
                <h2>Subscriptions Products</h2>
                <p>
                  With a <span className="highlight_txt">Aksvedas</span>{" "}
                  subscription, watch your favorite products show up at your
                  door automatically and save up to 25%.
                </p>

                <button className="shop_now btn-2 mt-1">
                  Subscribe Now <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Review></Review>

      <section className="product_knowlenge_base">
        <div className="container-fluid">
          <div className="global_heading text-center mb-3">
            <h2>Product Knowledge Base</h2>
          </div>
          <OwlCarousel className="mt-5 owl-theme" {...knowledgebaseowl}>
            <div className="item">
              <div className="row justify-content-between align-items-center ">
                <div className="col-xl-5 col-lg-5 col-md-6 mb-md-0 mb-4">
                  <div className="product_img">
                    <img src={knowledgebase} alt="product_img" />
                  </div>
                </div>

                <div className="col-xl-7 col-lg-7 col-md-6 ">
                  <div className="product_cnt ps-md-5">
                    <h2>Pure Himalayan Shilajit</h2>
                    <p>
                      Lorem ipsum dolor sit amet consectetur. Morbi cursus diam
                      morbi elit consequat pretium sollicitudin. Facilisi sit
                      eget in massa nibh in turpis. Enim quisque leo eleifend
                      vel. Scelerisque purus praesent aenean laoreet diam.
                    </p>
                    <ul className="p-0">
                      <li>Lorem ipsum dolor sit amet consectetur. Morbi </li>
                      <li>Lorem ipsum dolor sit amet consectetur. Morbi </li>
                      <li>Lorem ipsum dolor sit amet consectetur. Morbi </li>
                      <li>Lorem ipsum dolor sit amet consectetur. Morbi </li>
                    </ul>

                    <button className="shop_now btn-2 mt-1">
                      Shop Now <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <section className="our_blogs">
        <div className="container">
          <div className="global_heading text-center mb-3">
            <h2>Our Blogs</h2>
          </div>

          <OwlCarousel className="owl-theme mt-5" {...blogs}>
            <div className="item">
              <div className="Blogs_box">
                <div className="blogs_img">
                  <img src={blogsimg} alt="blog_img" />
                </div>
                <div className="poster_details">
                  <p>
                    Women's Health <span className="mx-1"> | </span> Post by{" "}
                    <span className="highlight_txt">Admin</span>
                  </p>
                </div>
                <h2>Chyawanprash: Unveiling Ancient Ayurvedic</h2>

                <button className="global_no_bg_btn">
                  Read More <i className="fa-solid fa-chevron-right"></i>
                </button>

                <div className="date_tag">
                  <div className="date">29</div>
                  <div>Jan</div>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <FrontLoding loading={loading}/>
    </>
  );
};

export default Home;
