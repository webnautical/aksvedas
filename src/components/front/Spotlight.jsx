import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper';

import siderbg from "../../assets/img/video.mp4";
import { Link } from 'react-router-dom';
import { imgBaseURL } from '../../utility/Utility';


function Spotlight({ spotlight }) {
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const togglePlayPause = (index) => {
    if (playingIndex === index) {
      videoRefs.current[index].pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null) {
        videoRefs.current[playingIndex].pause();
      }
      videoRefs.current[index].play();
      setPlayingIndex(index);
    }
  };

  const handleSlideChange = (swiper) => {
    if (playingIndex !== null) {
      videoRefs.current[playingIndex].pause();
      setPlayingIndex(null);
    }
  };

  const handleScroll = () => {
    if (playingIndex !== null) {
      videoRefs.current[playingIndex].pause();
      setPlayingIndex(null);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [playingIndex]);

  console.log("playingIndex",playingIndex)
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
          onSlideChange={handleSlideChange}
          breakpoints={{
            480: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            }
          }}
        >
          {
            spotlight?.map((item, i) => (
              <>
                <SwiperSlide key={i} className={`${playingIndex === i && "new_video_box"}`}>
                  <div className={`video_box`} style={{ position: 'relative' }}>
                    <video ref={(el) => (videoRefs.current[i] = el)}>
                      <source src={imgBaseURL() + item?.img} type="video/mp4" />
                    </video>
                    <button onClick={() => togglePlayPause(i)} className="play-pause-btn">
                      {playingIndex === i ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
                    </button>
                  </div>
                  <div className="button-video">

                    <Link to={item?.url == null ? "/shop/all" : item?.url == 'null' ? "/shop/all" : item?.url} className="shop_now btn-2 mt-3">Shop Now <i className="fa-solid fa-arrow-right"></i></Link>
                  </div>
                </SwiperSlide>
              </>
            ))
          }
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


