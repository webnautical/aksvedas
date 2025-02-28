import React, { useEffect, useState } from 'react'
import Header from '../front/include/Header';
import Footer from '../front/include/Footer';
import { authCustomer, imgBaseURL } from '../utility/Utility';
import { useLocation, useNavigate } from 'react-router';
import { useFrontDataContext } from '../context/FrontContextProvider';
import { Helmet } from 'react-helmet';
import { APICALL } from '../utility/api/api';

const FrontWeb = ({ cmp }) => {
  const Component = cmp;
  const navigate = useNavigate()
  const [modal, setModal] = useState(false);
  const pathname = useLocation()?.pathname
  const { allData } = useFrontDataContext();
  useEffect(() => {
    const lastCloseTime = localStorage.getItem('modalCloseTime');
    const currentTime = new Date().getTime();

    // if (!lastCloseTime || currentTime - lastCloseTime > 24 * 60 * 60 * 1000) {
    //   const timer = setTimeout(() => {
    //     setModal(true);
    //   }, 10000);

    //   return () => clearTimeout(timer);
    // }

    setModal(true);
    
  }, []);

  const handleRedirect = () => {
    setModal(false);
    navigate('/login');
  };

  const handleCloseModal = () => {
    setModal(false);
    localStorage.setItem('modalCloseTime', new Date().getTime());
  };

  useEffect(() =>{
    getListFun()
  },[pathname])

  const [metaDetails, setMetaDetails] = useState(null)
  const location = useLocation()
  const path = location.pathname.startsWith("/") ? location.pathname.slice(1): location.pathname;
  const lastSegment = path.split('/').pop();
  const firstSegment = path.split("/")[0];
  const getListFun = async () => {
    const res = await APICALL(`/metas/${pathname == "/" ? "home" : lastSegment}`)
    if (res?.status) {
      setMetaDetails(res?.data)
    } else {
      setMetaDetails({
        "meta_title" : "Aksvedas",
        "meta_desc" : "Aksvedas",
      })
    }
  }

  useEffect(() => {
    if(firstSegment !== "product-detail"){
      if (metaDetails) {
        document.title = metaDetails.meta_title || "Aksvedas";
    
        const descriptionMetaTag = document.querySelector("meta[name='description']");
        if (descriptionMetaTag) {
          descriptionMetaTag.setAttribute("content", metaDetails.meta_desc || "Aksvedas");
        } else {
          const metaTag = document.createElement('meta');
          metaTag.name = "description";
          metaTag.content = metaDetails.meta_desc || "Aksvedas";
          document.head.appendChild(metaTag);
        }
    
        const keywordsMetaTag = document.querySelector("meta[name='keywords']");
        if (keywordsMetaTag) {
          keywordsMetaTag.setAttribute("content", metaDetails.meta_keyword || "default, keywords");
        } else {
          const metaTag = document.createElement('meta');
          metaTag.name = "keywords";
          metaTag.content = metaDetails.meta_keyword || "default, keywords";
          document.head.appendChild(metaTag);
        }
      }
    }
  }, [metaDetails]);
  
  return (
    <>
      <Header />
      <Component />
      <Footer />

      {(modal && !authCustomer()?.id && pathname === '/') &&
        <div class="c-modal-for-banner">
          <div style={{ position: 'relative' }}>
            <div class="c-modal-dialog p-0" style={{ cursor: 'pointer', }} onClick={() => handleRedirect()}>
              <div class="modal-body p-0">
                <img src={imgBaseURL() + allData?.popupHomePage?.img1} alt='sad' />
              </div>
            </div>
            <button style={{ position: 'absolute', top: '-15px', right: '-15px', width: '25px', height: '25px', borderRadius: '100%', backgroundColor: 'white', opacity: 1 }} type="button" class="btn-close" aria-label="Close" onClick={() => handleCloseModal(false)}></button>
          </div>
        </div>}

    </>
  )
}

export default FrontWeb