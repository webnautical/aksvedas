import React, { useEffect, useState } from "react";
import siderbg from "../../../assets/img/shopimg.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AllProducts from "../../../components/front/AllProdutcs";
import Filters from "../../../components/front/Filters";
const Shop = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const toggleFilterOverlay = () => {
    setIsFilterVisible(!isFilterVisible);
    setIsFilterApplied(!isFilterApplied);
  };
  const closeFilterOverlay = () => {
    setIsFilterVisible(false);
  };

  useEffect(()=>{
    if(category === "mens-health" || category === "womens-health"){
      navigate('/not-found')
    }
  },[category])

  const [filterVal, setFilterVal] = useState({
    sort : '',
    searchText: ''
  })
  const handleFilter = (e) =>{
    if(e.target.name === 'sort'){
      setFilterVal({...filterVal, 'sort' : e.target.value})
    }
    if(e.target.name === 'searchText'){
      setFilterVal({...filterVal, 'searchText' : e.target.value})
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


  return (
    <div className="collection-page pb-5">
      <div className="banner-img">
        <img src={siderbg} alt="" />
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
            className={`filter-overlay ${
              isFilterVisible ? "overlaymobile" : ""
            }`}
            onClick={toggleFilterOverlay}
          >
            {/* Filter content goes here */}
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div
                className={`filter-outer ${
                  isFilterVisible ? "mobile-view" : ""
                }`}
              >
               <div className="d-md-none d-block addtitlefilter"> <h2>Filter</h2>
                <button className="close-button" onClick={closeFilterOverlay}>
                  <i className="fa fa-times"></i>
                </button>
                </div> 
                <Filters></Filters>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="dy_heading">
                <h1 style={{fontSize:'20px'}}> {category === "mens-health-supplement" ? "Men's Health Supplement" : category === "womens-health-suppliment" ? "Supplements for Women" : ""} </h1>
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
                <AllProducts filterVal={filterVal}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
