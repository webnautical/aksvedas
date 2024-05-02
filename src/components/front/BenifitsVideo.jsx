import React, { useState } from 'react';

function BenifitsVideo({thumbnailSrc}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    // Toggle the isPlaying state only when the play button is clicked
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="video-benefits">
      {!isPlaying && (
        <>
          <img
            src={thumbnailSrc}
            alt="Video thumbnail"
            className="thumbnail"
            onClick={handleClick}
          />
          <div className="play-button" onClick={handleClick}>
            <i className="fa fa-play"></i>
          </div>
        </>
      )}
      {isPlaying && (
       <iframe frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="Boost Your Testosterone levels With Aksveda" width="640" height="360" src="https://www.youtube.com/embed/KZFOkvVUroQ?autoplay=1&amp;origin=https%3A%2F%2Fkapiva.in&amp;iv_load_policy=3&amp;enablejsapi=1&amp;widgetid=1"></iframe>

      )}
    </div>
  );
}

export default BenifitsVideo;
