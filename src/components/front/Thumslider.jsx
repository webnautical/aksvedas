import React, { useRef, useState, useEffect } from "react";
import Glider from "react-glider";
import "glider-js/glider.min.css";
import PropTypes from "prop-types";
import { imgBaseURL } from "../../utility/Utility";

const Thumslider = ({ images, productDT }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);
  const mainGliderRef = useRef(null);
  const thumbGliderRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const reorderMedia = (media) => {
    const video = media.find((item) => item.endsWith(".mp4"));
    const imgs = media.filter((item) => !item.endsWith(".mp4"));
    return video ? [imgs[0] || video, video, ...imgs.slice(1)] : media;
  };

  const updatedImages = reorderMedia([...images]);

  const buttonStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    zIndex: 10,
  };

  const goToSlide = (index) => {
    if (mainGliderRef.current) {
      mainGliderRef.current.scrollItem(index, true);
    }
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
    setActiveIndex(index);
  };

  return (
    <>
      <div className="product-slider-container">
        <Glider
          ref={mainGliderRef}
          className="glider-container"
          hasArrows
          style={{ border: "none", boxShadow: "none" }}
          draggable          
          hasDots={false}
          slidesToShow={1}
          scrollLock
          arrows={{
            prev: ".glider-prev",
            next: ".glider-next",
          }}
        >
          {updatedImages.map((item, index) => (
            <div className="item" key={index}>
              {item.endsWith(".mp4") ? (
                <div className="video_main_box" style={{ position: "relative" }}>
                  <video ref={videoRef} width="100%" height="auto">
                    <source src={item} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button onClick={handlePlayPause} style={buttonStyle}>
                    <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
                  </button>
                </div>
              ) : (
                <img src={item} alt="product" />
              )}
            </div>
          ))}
        </Glider>

        {/* Custom Arrows */}
        <div className="glider-prev swiper-button-prev">
          <i className="fa-solid fa-arrow-left"></i> {/* Left arrow */}
        </div>
        <div className="glider-next swiper-button-next">
          <i className="fa-solid fa-arrow-right"></i> {/* Right arrow */}
        </div>
      </div>

      <div className="product-slider-thumbs" style={{ marginTop: "20px" }}>
        <Glider
          ref={thumbGliderRef}
          className="glider-thumbs"
          slidesToShow={6}
          scrollLock
          draggable
          
        >
          {updatedImages.map((item, index) => (
            <div
              className={`thumb-item ${activeIndex === index ? "active-thumb" : ""}`}
              key={index}
              onClick={() => goToSlide(index)}
              style={{ cursor: "pointer", padding: "5px" }}
            >
              {item.endsWith(".mp4") ? (
                <div className="video_thumbnail" style={{ position: "relative" }}>
                  {productDT?.video_thumbnail ? (
                    <>
                      <img
                        src={imgBaseURL() + productDT.video_thumbnail}
                        alt="video thumbnail"
                      />
                      <i className="fa fa-play"></i>
                    </>
                  ) : (
                    <>
                      <video height="62">
                        <source src={item} type="video/mp4" />
                      </video>
                      <i className="fa fa-play"></i>
                    </>
                  )}
                </div>
              ) : (
                <img src={item} alt="product thumbnail" />
              )}
            </div>
          ))}
        </Glider>
      </div>
    </>
  );
};

Thumslider.propTypes = {
  images: PropTypes.array.isRequired,
  productDT: PropTypes.object,
};

export default Thumslider;
