import React from 'react'
import { defaultIMG, imgBaseURL } from '../../utility/Utility'

const ItemImg = ({img}) => {
  return (
    <><img src={img ? imgBaseURL() + img : defaultIMG} alt={'img'} style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'contain', background: '#ddd'}} /></>
  )
}

export default ItemImg