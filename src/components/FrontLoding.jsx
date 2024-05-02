import React from 'react'
import { logo } from '../utility/Utility'

const FrontLoding = ({loading}) => {
  return (
    <div className={`frontLoading ${!loading ? 'd-none' : ''}`}>
        <div className="box">
            <img src={logo} alt="logo" style={{height: '80px', width: '160px'}}/>
            <p className='text-center mt-2'>Loading...</p>
        </div>
    </div>
  )
}

export default FrontLoding