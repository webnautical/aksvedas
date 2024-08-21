import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import free1 from "../../assets/img/experiment.png";
import free2 from "../../assets/img/india.png";
import free3 from "../../assets/img/freeshiping3.png";
import crufree from "../../assets/img/cruelty-free.png";
import free4 from "../../assets/img/freeshiping4.png";
import free5 from "../../assets/img/freeshiping5.png";
import bgfree from "../../assets/img/bg-free.png";
import BackToTop from "../../components/front/BackToTop";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { APICALL } from "../../utility/api/api";
import { imgBaseURL, toastifyError } from "../../utility/Utility";
import { SOMETHING_ERR } from "../../utility/Constants";
import HTMLContent from "../../components/HTMLContent";
import icon2 from "../../assets/img/qualitys.png";

const Footer = () => {
  const { categories, getWebAttrFun, webAttr,allData } = useFrontDataContext();
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getWebAttrFun()
  }, [])

  const handleSubmit = async () => {
    try {
      if (email === "") {
        setMsg(<span className="text-danger">Please enter email address</span>);
        return false
      } else if (!validateEmail(email)) {
        setMsg(<span className="text-danger">Please enter a valid email address.</span>);
        return false
      }
      const res = await APICALL('/v1/subscribe', 'post', { email });
      if (res?.status) {
        setMsg(<span className="text-success">Thank you for the subscribe.</span>);
      } else {
        toastifyError(SOMETHING_ERR)
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR);
    }
  }
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <>
      <section className="news_letter">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-5">
              <div className="inner_news_letter">
                <h2>Subscribe to Our Newsletter</h2>
                {/* <p>
                  Sign up for 10% off and be the first to know about new
                  products, offers, and all the Products.
                </p> */}
                <div className="suns_input d-flex ps-3 mt-3">
                  <i className="fa-regular fa-envelope align-items-center d-flex"></i>
                  <input className="ps-1" type="text" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
                  <div className="submit">
                    <button className="button" onClick={() => handleSubmit()} class="shop_now btn-2">Subscribe</button>
                  </div>
                </div>
                <p>{msg}</p>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="free-shipping"
        style={{
          backgroundImage: `url(${bgfree})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row row-cols-2 row-cols-sm-3 row-cols-xl-5 row-cols-lg-5 row-cols-md-5 g-md-3 g-2">
            <div className="col borer-right">
              <div className="free-box">
                <img src={free1} alt="footer_logo" />
                <h5>
                LAB TESTED
                </h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={free2} alt="footer_logo" />
                <h5>
                MAKE IN INDIA
                </h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
              <img src={icon2} alt="footer_logo" />
                <h5>
                QUALITY GUARANTEE
                </h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={crufree} alt="footer_logo" />
                <h5>
                CRUELTY FREE
                </h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
              <img src={free3} alt="footer_logo" />
                <h5>
                SECURED PAYMENT
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer>

        


        <div className="container">
          <div className="row mb-md-5 mb-4">
            <div className="col-lg-4 col-md-6 pe-md-5 mb-lg-0 mb-4">
              <div className="footer_logo">
                <img src={imgBaseURL() + webAttr?.logo} alt="footer_logo" />
                <p className="mt-3">
                  <HTMLContent data={webAttr?.footer_text} />
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-2 col-sm-4 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>About</h2>
                    <ul className="p-0">
                      <li>
                        <Link to="/about">About Us </Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/shop/all">Shop</Link>
                      </li>

                      {/* <li>
                        <Link to="/blog">Blog</Link>
                      </li> */}
                      <li>
                        <Link to="/contact-us">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-4 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>Categories</h2>
                    <ul className="p-0">
                      {categories?.slice(0, 5).map((item, i) => (
                        <li key={i}>
                          <Link to={`/shop/${item?.slug}`}>{item?.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-4 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>Get In touch</h2>
                    <ul className="p-0">
                      <li>
                        <Link to="/privacy-policy">Privacy Policy </Link>
                      </li>
                      <li>
                        <Link to="/term-and-condition">Terms and Conditions</Link>
                      </li>
                      <li>
                        <Link to="/shipping-policy">Shipping Policy</Link>
                      </li>
                      <li>
                        <Link to="/cancellation-returns-refunds-policy">
                          Cancellation Policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-sm-8 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>We Are Also Available On:</h2>
                    <div className="row">
                    {
                        allData?.availableOn?.map((item, i) => (
                          <div className="col-md-6  col-sm-4 col-5 mb-4"> <Link to={item.url} target="_blank"><img src={imgBaseURL() + item?.img} alt="" className="img-fluid w-100" /></Link></div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="payemenet_accept">
            <p>PAYMENTS WE ACCEPT</p>
            <div className="row">
              <div className="col-lg-6 mx-auto">
                <img src={imgBaseURL() + webAttr?.payment_we_accept} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
          <div className="bottum_bar">
            <HTMLContent data={webAttr?.copyright} />
            <ul className="social_icons">
              <li>
                <Link to={webAttr?.fb_url} target="_blank">
                  <i class={webAttr?.fb_icon}></i>
                </Link>
              </li>
              <li>
                <Link to={webAttr?.ig_url} target="_blank">
                  <i class={webAttr?.ig_icon}></i>
                </Link>
              </li>
              <li>
                <Link to={webAttr?.twitter_url} target="_blank">
                <i class="fa-brands fa-linkedin-in"></i>
                </Link>
              </li>
              {
                webAttr?.yt_url?.length > 10 &&
                <li>
                  <Link to={webAttr?.yt_url} target="_blank">
                    <i class={webAttr?.yt_icon}></i>
                  </Link>
                </li>
              }
              <li>
                <BackToTop></BackToTop>
              </li>
            </ul>
          </div>
        </div>
        <Link
          to="https://api.whatsapp.com/send?phone=+919001115559&text=Hello"
          className="whatspapp-footer"
          target="_blank"
        >
          <i class="fab fa-whatsapp"></i>
        </Link>
      </footer>

    </>
  );
};

export default Footer;
