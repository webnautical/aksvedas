import React from 'react'
import { defaultIMG, imgBaseURL } from '../../utility/Utility'

const ItemImg = ({img}) => {
  const isString = typeof img === 'string';
  const isVideo = isString && (img.endsWith('.mp4') || img.endsWith('.mov'));
  const mediaURL = img ? imgBaseURL() + img : defaultIMG;
  return (
    <>
    <div className="media-item" style={{ position: 'relative', margin: '5px' }}>
      {isVideo ? (
        <video
          src={mediaURL}
          alt="Video"
          style={{ width: '40px', height: '40px', objectFit: 'cover', }}
          controls
        />
      ) : (
        <img src={mediaURL} alt={'img'} style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'contain', background: '#ddd'}} />
      )}
    </div>
    
    </>
  )
}

export default ItemImg