import React from "react";
import quote from "../../assets/img/quote.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
    
const Review = () => {
    const Reviews_cus = {
      loop: true,
      autoplay: true,
      autoplaySpeed: 100,
      margin: 20,
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
          items: 3,
          nav: false,
        },
        1000: {
          items: 3.2,
  
          loop: true,
        },
      },
    };
  return (
    <section className="customer_review">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-3 mb-xl-0 mb-4">
            <div className="global_heading text-md-start text-center">
              <h2>Customer Reviews</h2>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa.
              </p>
              <a href="#" class="viewproducts">
                View All Products <i class="fa fa-chevron-right"></i>
              </a>
            </div>
          </div>

          <div className="col-xl-9">
            <div className="review_inner_box">
              <OwlCarousel className="owl-theme" {...Reviews_cus}>
                <div class="item">
                  <div className="review_box">
                    <div className="qouote_img text-center">
                      <img className="m-auto" src={quote} alt="qoute_img" />
                      <p>
                        Telehealth is fueled by digital technologies and DocTime
                        telemedicine app has brought a great revolution in
                        medical services specially an overpopulated country
                        where virtual chamber can create at anywhere thoughout
                        country
                      </p>
                      <ul>
                        <li>
                          {" "}
                          <i class="fa-solid fa-star"></i>
                        </li>
                        <li>
                          {" "}
                          <i class="fa-solid fa-star"></i>
                        </li>
                        <li>
                          {" "}
                          <i class="fa-solid fa-star"></i>
                        </li>
                        <li>
                          {" "}
                          <i class="fa-solid fa-star"></i>
                        </li>
                        <li>
                          {" "}
                          <i class="fa-solid fa-star"></i>
                        </li>
                      </ul>
                      <div className="Name_peraon">Alan Zara dilan</div>
                      <div className="place_from">Noida</div>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Review;
