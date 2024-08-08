import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import About from '../about/About'
import PrivacyPolicy from '../privacy-policy/PrivacyPolicy'
import CancellationReturnsRefundsPolicy from '../terms-and-conditons/CancellationReturnsRefundsPolicy'
import ShippingPolicy from '../shipping-policy/ShippingPolicy'
import { getPageData } from '../../../utility/api/RepeaterAPI'
import FrontLoader from '../../../components/front/FrontLoader'
import ContactUs from '../contact/ContactUs'

const StaticPagesFront = () => {
    const path = useLocation()?.pathname
    const newPath = path.replace('/', '');
    const [pageData, setPageData] = useState(null)
    const [loading, setLaoding] = useState(false)
    useEffect(()=>{getData()},[path])
    const getData = async () =>{
      setLaoding(true)
      const params = newPath === 'about' ? 'about-us' : newPath
      const res = await getPageData(params)
      if(res?.status){
        setPageData(res?.data)
        setLaoding(false)
      }
    }

    console.log("pageData",pageData)
    return (
        <>
        {loading && <FrontLoader />}
            {
                path === '/about' ?
                    <About {...{pageData}}/>
                    :
                    path === '/contact-us' ?
                    <ContactUs {...{pageData}}/>
                    :
                    path === '/privacy-policy' ?
                        <PrivacyPolicy {...{pageData}}/>
                        :
                        path === '/cancellation-returns-refunds-policy' ?
                            <CancellationReturnsRefundsPolicy {...{pageData}}/>
                            :
                            path === '/shipping-policy' ?
                                <ShippingPolicy {...{pageData}}/>
                                :

                                path === '/term-and-condition' ?
                                <ShippingPolicy {...{pageData}}/>
                                :
                                <></>

            }
        </>
    )
}

export default StaticPagesFront