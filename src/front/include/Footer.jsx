import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logosite.png";
import free1 from "../../assets/img/freeshiping1.png";
import free2 from "../../assets/img/freeshiping2.png";
import free3 from "../../assets/img/freeshiping3.png";
import free4 from "../../assets/img/freeshiping4.png";
import free5 from "../../assets/img/freeshiping5.png";
import bgfree from "../../assets/img/bg-free.png";
import paymemnt from "../../assets/img/payment.png";
import bradlogo from "../../assets/img/brand-online.png";
import BackToTop from "../../components/front/BackToTop";

const Footer = () => {
  return (
    <>
      <section className="news_letter">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-5">
              <div className="inner_news_letter">
                <h2>Subscribe to Our Newsletter</h2>
                <p>
                  Sign up for 10% off and be the first to know about new
                  products, offers, and all the Products.
                </p>
                <div className="suns_input d-flex ps-3">
                  <i className="fa-regular fa-envelope align-items-center d-flex"></i>
                  <input
                    className="ps-1"
                    type="text"
                    placeholder="Enter Your Email"
                  />
                  <div className="submit">
                    <button class="shop_now btn-2">Subscribe</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="free-shipping"  
      style={{
          backgroundImage: `url(${bgfree})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-3 row-cols-xl-5 row-cols-lg-5 row-cols-md-5 g-3">
            <div className="col borer-right">
              <div className="free-box">
                <img src={free1} alt="footer_logo" />
                <h5>free <br />shipping</h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={free2} alt="footer_logo" />
                <h5>100% hand <br /> packed</h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={free3} alt="footer_logo" />
                <h5>Secured<br /> payment</h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={free4} alt="footer_logo" />
                <h5>quality<br />
guarntee</h5>
              </div>
            </div>
            <div className="col borer-right">
              <div className="free-box">
                <img src={free5} alt="footer_logo" />
                <h5>quality<br /> guarntee</h5>
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
                <img src={logo} alt="footer_logo" />
                <p className="mt-3">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
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
                        <Link>Company</Link>
                        <Link>FAQ's</Link>
                        <Link>Quality</Link>
                        <Link>Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-4 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>Categories</h2>
                    <ul className="p-0">
                      <li>
                        <Link>Men's Health</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Women's Health</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Weight Management</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Lifestyle Diseases</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-4 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>Get In touch</h2>
                    <ul className="p-0">
                      <li>
                        <Link>Men's Health</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Women's Health</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Weight Management</Link>
                      </li>
                      <li>
                        {" "}
                        <Link>Lifestyle Diseases</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-sm-8 mb-md-0 mb-4">
                  <div className="f_menu">
                    <h2>We Are Also Available On:</h2>
                    <img src={bradlogo} alt="" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="payemenet_accept">
            <p>PAYMENTS WE ACCEPT</p>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <img src={paymemnt} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
          <div className="bottum_bar">
            <p>
              Copyright @ 2024 <span className="highlight_txt">Aksveds</span>.
              All rights reserved
            </p>
            <ul className="social_icons">
              <li>
                <Link>
                  <i class="fa-brands fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link>
                  <i class="fa-brands fa-instagram"></i>
                </Link>
              </li>
              <li>
                <Link>
                  <i class="fa-brands fa-x-twitter"></i>
                </Link>
              </li>
              <li>
                <BackToTop></BackToTop>
              </li>
            </ul>
          </div>
        </div>
        <Link className="whatspapp-footer">
          <i class="fab fa-whatsapp"></i>
        </Link>
      </footer>
    </>
  );
};

export default Footer;
