import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { imgBaseURL } from "../../utility/Utility";

const Thumslider = (props) => {
  const productDetails = props?.productDT
  const [activeThumb, setActiveThumb] = useState();

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNow = () =>{
    videoRef.current.play();
    setIsPlaying(true)
  }

  const buttonStyle = {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };


  const reorderMedia = (media) => {
    const video = media.find(item => item.endsWith(".mp4"));
    const images = media.filter(item => !item.endsWith(".mp4"));
    if (video) {
      return [images[0] || video, video, ...images.slice(1)];
    }
    return media;
  };

  const updatedImages = reorderMedia([...props.images]);

  useEffect(() => {
    document.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );
  }, []);
  return (
    <>
      <div className="product-slider-container">
        <Swiper
          allowTouchMove={true}  // Touch interaction allow karega
          simulateTouch={true}
          slidesPerView={1}    // Mouse se bhi swipe allow karega
          loop={true}
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation, Thumbs]}
          grabCursor={false}
          thumbs={{ swiper: activeThumb }}
          className="product-images-slider"
        >
          {updatedImages?.map((item, index) => (
            <SwiperSlide key={index}>
              {item.endsWith(".mp4") ||
                item.endsWith(".webm") ||
                item.endsWith(".ogg") ? (
                <>
                  <div className="video_main_box">
                    <video ref={videoRef} width="100%" height="auto">
                      <source src={item} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button className="play_pause_btn" onClick={handlePlayPause} style={buttonStyle}>
                      <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
                      {isPlaying ? '' : ''}
                    </button>
                  </div>
                </>
              ) : (
                <img src={item} alt="product images" />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="swiper-button-prev"><i class="fa-solid fa-arrow-left"></i></button>
        <button className="swiper-button-next"><i class="fa-solid fa-arrow-right"></i></button>
      </div>

      <Swiper
        onSwiper={setActiveThumb}
        loop={true}
        spaceBetween={10}
        slidesPerView={5}
        modules={[Navigation, Thumbs]}
        className="product-images-slider-thumbs"
      >
        {updatedImages?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="product-images-slider-thumbs-wrapper">
              {item.endsWith(".mp4") ||
                item.endsWith(".webm") ||
                item.endsWith(".ogg") ? (
                <>
                 <div className="video_thumbnail">
                    <img src={imgBaseURL() + productDetails?.video_thumbnail} alt="product images" />
                    <i className="fa fa-play" onClick={()=>playNow()}></i>
                 </div>
                </>
              ) : (
                <img src={item} alt="product images" />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

Thumslider.propTypes = {
  images: PropTypes.array.isRequired,
};

export default Thumslider;