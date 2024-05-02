import React, { useState } from "react";
import siderbg from "../../../assets/img/shopimg.png";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AllProducts from "../../../components/front/AllProdutcs";
import Filters from "../../../components/front/Filters";
const Shop = () => {
  const { category } = useParams()

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const toggleFilterOverlay = () => {
    setIsFilterVisible(!isFilterVisible);
    setIsFilterApplied(!isFilterApplied);
  };
  const closeFilterOverlay = () => {
    setIsFilterVisible(false);
  };

  return (
    <div className="collection-page">
      <div className="banner-img">
        <img src={siderbg} alt="" />
      </div>
      <div className="container">

        <Breadcrumbs
          aria-label="breadcrumb"
          className="breacrumb-custom py-md-3 py-2"
          separator={<NavigateNextIcon fontSize="small" />}
        >
          <Link underline="hover" href="/">
            Home
          </Link>
          <Link href="/collections" underline="hover" color="inherit">
            Collections
          </Link>
          {/* <Typography>{category}</Typography> */}
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
                      placeholder="Search Products..."
                    />
                    <i className="fas fa-magnifying-glass"></i>
                  </div>
                  <div className="flex-shrink-0 select-most">
                    <div className="d-flex gap-2">
                      <div className="flex-shrink-0">
                        <label for="sort-elem" className="col-form-label">
                          Sort By:
                        </label>
                      </div>
                      <div className="flex-shrink-0">
                        <select className="form-select w-md" id="sort-elem">
                          <option value="">Most Popular</option>
                          <option value="low_to_high">Low to High</option>
                          <option value="high_to_low">High to Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <AllProducts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
