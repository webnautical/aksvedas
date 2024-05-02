import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper';

import siderbg from "../../assets/img/video.mp4";
import { Link } from 'react-router-dom';


function Spotlight() {
  return (
    <section className="spotlight">
      <div className="container">
        <div className="global_heading text-center mb-5">
          <h2>IN THE SPOTLIGHT</h2>
        </div>
        <Swiper
          loop={true}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 100,
            depth: 150,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ el: '.swiper-pagination', clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
          breakpoints={{
            // when window width is >= 480px
            480: {
              slidesPerView: 2,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 3,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            }
          }}
        >
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />
            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <video controls>
              <source src={siderbg} type="video/mp4" />

            </video>
            <div className="button-video">
              <Link to="#" className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </SwiperSlide>
          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <i className="fa fa-chevron-left"></i>
            </div>
            <div className="swiper-button-next slider-arrow">
              <i className="fa fa-chevron-right"></i>
            </div>
          </div>
        </Swiper>
      </div>
    </section>
  );
}

export default Spotlight;


