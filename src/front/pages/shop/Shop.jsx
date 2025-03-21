import React, { useEffect, useState } from "react";
import siderbg from "../../../assets/img/shopimg.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AllProducts from "../../../components/front/AllProdutcs";
import Filters from "../../../components/front/Filters";
import mensbanner from '../../../assets/img/mens-banner.webp'
import womensbanner from '../../../assets/img/womens-banner.webp'
import combobanner from '../../../assets/img/combo-banner.webp'
import mobilewomenbaner from '../../../assets/img/mobile-women.webp'
import mobilemenbaner from '../../../assets/img/mobile-men.webp'
import mobilecombobaner from '../../../assets/img/mobile-combo.webp'
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { imgBaseURL } from "../../../utility/Utility";
import { APICALL } from "../../../utility/api/api";


const Shop = () => {
  const { categories } = useFrontDataContext();
  const { category } = useParams()
  const navigate = useNavigate()
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [shopBanner, setShopBanner] = useState([])
  const toggleFilterOverlay = () => {
    setIsFilterVisible(!isFilterVisible);
    setIsFilterApplied(!isFilterApplied);
  };
  const closeFilterOverlay = () => {
    setIsFilterVisible(false);
  };

  useEffect(() => {
    if (category === "mens-health" || category === "womens-health" || category === "womens-health-suppliment") {
      navigate('/not-found')
    }
  }, [category])

  const [filterVal, setFilterVal] = useState({
    sort: '',
    searchText: ''
  })

  const handleFilter = (e) => {
    if (e.target.name === 'sort') {
      setFilterVal({ ...filterVal, 'sort': e.target.value })
    }
    if (e.target.name === 'searchText') {
      setFilterVal({ ...filterVal, 'searchText': e.target.value })
    }
  }

  const capitalizeWords = (str) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const transformCategories = (categories) => {
    return categories.map(category => capitalizeWords(category)).join(', ');
  };
  const categoriesArray = category.split('+');
  const transformedCategories = transformCategories(categoriesArray);


  const getCategoryImage = () => {
    const catBanner = categories.find(cat => cat.slug === category);
    if(catBanner){
      return catBanner ? catBanner.banner ? imgBaseURL() + catBanner.banner : siderbg : siderbg;
    }else{
      const image = getImageByTitle(category)?.img;
      return imgBaseURL() + image
    }
  };


  const getCategoryImageMobile = () => {
    const catBanner = categories.find(cat => cat.slug === category);
    if(catBanner){
      return catBanner ? catBanner?.mobile_banner ? imgBaseURL() + catBanner?.mobile_banner : siderbg : siderbg;
    }else{
      const image = getImageByTitle(category)?.m_img;
      return imgBaseURL() + image
    }
  };

  useEffect(() =>{
    getShopBannerFun()
  },[])

  const getShopBannerFun = async () =>{
    try {
      const res = await APICALL('shop-banner')
      if(res?.status){
        setShopBanner(res?.data)
      }else{
        setShopBanner([])
      }
    } catch (error) {
      setShopBanner([])
      console.log(error)
    }
  }

  const getImageByTitle = (url) => {
    if (!url) return "No Image Found";
    const sortedUrlTitle = url.split("+").sort().join("+");
    const banner = shopBanner.find(item => 
      item.title.split("+").sort().join("+") === sortedUrlTitle
    );
    if(banner){
      const data = {img : banner?.img ? banner?.img : siderbg, m_img : banner?.m_img ? banner?.m_img : siderbg}
      return data
    }else{
      const data = {img : siderbg, m_img : siderbg}
      return data
    }
  };





  
  return (
    <div className="collection-page pb-5">
      <div className="banner-img">
        <img className="for_desktop_banner d-md-block d-none" src={getCategoryImage()} alt="Category Banner" />
        <img className="for_movile_banner d-md-none d-block" src={getCategoryImageMobile()} alt="Category Banner" />
      </div>
      <div className="container">
        <Breadcrumbs
          aria-label="breadcrumb"
          className="breacrumb-custom py-md-3 py-2"
          separator={<NavigateNextIcon fontSize="small" />}
        >
          <Link underline="hover" to="/"> Home</Link>
          <Link to="/shop/all" underline="hover" color="inherit"> Shop</Link>
          <Link to="#" underline="hover" color="inherit"> {transformedCategories}</Link>
        </Breadcrumbs>

        <div className="all-shopitems mt-3">
          <div
            className={`filter-overlay ${isFilterVisible ? "overlaymobile" : ""
              }`}
            onClick={toggleFilterOverlay}
          >
            {/* Filter content goes here */}
          </div>
          <div className="row">
            <div className="col-lg-3">
            <div className={`filter-outer ${isFilterVisible ? "mobile-view" : ""}`}>
      <div className="d-md-none d-block addtitlefilter">
        <h2>Filter</h2>
        <button className="close-button" onClick={closeFilterOverlay}>
          <i className="fa fa-times"></i>
        </button>
      </div>
      <Filters closeFilterOverlay={closeFilterOverlay} />
    </div>
            </div>
            <div className="col-lg-9">
              <div className="dy_heading">
                <h1 style={{ fontSize: '20px' }}> {category === "mens-health-supplement" ? "Men's Health Supplement" : category === "womens-health-supplement" ? "Women's Health Supplements" : ""} </h1>
              </div>
              <div className="shop-lisitng">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
                  <div className="d-md-none d-block filtermobile cursor-pointer text-black"
                    onClick={toggleFilterOverlay}
                  >
                    <i className="fa fa-filter pe-1"></i>
                    Filter
                  </div>
                  <div className="search-box-filter d-md-block d-none">
                    <input
                      type="text"
                      className="form-control"
                      id="searchProductList"
                      autocomplete="off"
                      onChange={handleFilter}
                      value={filterVal.searchText}
                      name="searchText"
                      placeholder="Search Products..."
                    />
                    <i className="fa fa-magnifying-glass"></i>
                  </div>
                  <div className="flex-shrink-0 select-most">
                    <div className="d-flex gap-2">
                      <div className="flex-shrink-0">
                        <label for="sort-elem" className="col-form-label">
                          Sort By:
                        </label>
                      </div>
                      <div className="flex-shrink-0">
                        <select className="form-select w-md" name="sort" value={filterVal.sort} onChange={handleFilter} id="sort-elem">
                          <option value="">Sort</option>
                          <option value="low_to_high">Low to High</option>
                          <option value="high_to_low">High to Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <AllProducts filterVal={filterVal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
