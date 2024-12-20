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

    if (!lastCloseTime || currentTime - lastCloseTime > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setModal(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
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

  return (
    <>
      <Helmet>
        <title>{metaDetails?.meta_title}</title>
        <meta name="description" content={metaDetails?.meta_desc} />
      </Helmet>

      <Header />
      <Component />
      <Footer />

      {
        (modal && !authCustomer()?.id && pathname === '/') &&
        <div class="c-modal-for-banner">
          <div style={{ position: 'relative' }}>
            <div class="c-modal-dialog p-0" style={{ cursor: 'pointer', }} onClick={() => handleRedirect()}>
              <div class="modal-body p-0">
                <img src={imgBaseURL() + allData?.popupHomePage?.img1} alt='sad' />
              </div>
            </div>
            <button style={{ position: 'absolute', top: '-15px', right: '-15px', width: '25px', height: '25px', borderRadius: '100%', backgroundColor: 'white', opacity: 1 }} type="button" class="btn-close" aria-label="Close" onClick={() => handleCloseModal(false)}></button>
          </div>

        </div>
      }

    </>
  )
}

export default FrontWeb