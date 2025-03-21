import React, { useEffect } from "react";
import quote from "../../assets/img/quote.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Rating } from "@mui/material";
import HTMLContent from "../HTMLContent";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { Link } from "react-router-dom";

const Review = () => {
  const {reviewList, getFuxedReviewList} = useFrontDataContext()
  const Reviews_cus = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout:3000,
    margin: 20,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
        nav: false,
        autoWidth: true,
      },
      1000: {
        items: 3.2,
        autoWidth: false,

        loop: true,
      },
    },
  };

  useEffect(() => {
    getFuxedReviewList();
  }, []);


  return (
    <section className="customer_review">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-3 mb-xl-0 mb-4">
            <div className="global_heading text-md-start text-center">
              <h2>Customer Reviews</h2>
              <p className="mt-4">
              Read real experiences from our valued customers. Share your own story and inspire others on their journey to better health!
              </p>
              <Link to={'/shop/all'} class="viewproducts">
                View All Products <i class="fa fa-chevron-right"></i>
              </Link>
            </div>
          </div>

          <div className="col-xl-9">
            <div className="review_inner_box">
              <OwlCarousel className="owl-theme" {...Reviews_cus}>
                {
                  reviewList?.map((item, i) => (
                    <div class="item">
                      <div className="review_box">
                        <div className="qouote_img text-center">
                          <img className="m-auto" src={quote} alt="qoute_img" />
                          <HTMLContent data={item?.review} />
                          <div>
                            <Rating name="read-only" value={item?.star} readOnly />
                          </div>
                          <div className="Name_peraon">{item?.name}</div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Review;
