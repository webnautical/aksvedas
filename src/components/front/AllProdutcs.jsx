import React, { useState, useEffect } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "swiper/swiper-bundle.min.css";
import emptycart from "../../assets/img/empty-cart.webp";

import Aos from "aos";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import {
  getPercentageOff,
  imgBaseURL,
} from "../../utility/Utility";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { postDataAPI } from "../../utility/api/api";
import FrontLoader from "./FrontLoader";
import ProductItemButton from "./ProductItemButton";
import { Rating } from "@mui/material";

const AllProducts = ({ filterVal }) => {
  const navigate = useNavigate();
  const stateData = useLocation()?.state
  const {
    products,
    wishlistData,
    getWishlistFun,
    addProductInWishlistFun,
  } = useFrontDataContext();
  const { category } = useParams();
  const [loading, setLoading] = useState(false);
  const [proudctList, setProductList] = useState([]);

  const [filterProductList, setFilterProductList] = useState([])

  useEffect(() => {
    Aos.init();
    getWishlistFun();
    if (category) {
      getProductListFun();
    } else {
      setProductList(products);
      setFilterProductList(products)
    }
  }, [category]);

  const getProductListFun = async () => {
    try {
      setLoading(true);
      let params = {};
      if (category.startsWith('t-')) {
        params.slugs = category;
        params.type = "tags";
      } else {
        params.slugs = category.split('+');
        params.type = "category";
      }

      const param = params;
      const res = await postDataAPI("/v1/get-products", JSON.stringify(param));
      if (res?.status) {
        setProductList(res?.data);
        if(stateData?.searchVal){
          const updatedProducts = res?.data.filter(product =>
            product.name.toLowerCase().includes(stateData?.searchVal.toLowerCase())
          );
          setFilterProductList(updatedProducts);
        }else{
          setFilterProductList(res?.data);
        }
        setLoading(false);
      } else {
        setProductList(null);
        setFilterProductList(null);
        setLoading(false);
      }
    } catch (error) {
      setFilterProductList(null);
      setProductList(null);
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistData.some((item) => item.product_id === productId);
  };

  useEffect(() => {
    if (filterVal.searchText == "" && filterVal.sort == "") {
      setFilterProductList(proudctList);
    }
    if (filterVal.sort !== '') {
      let updatedProducts = [...proudctList];
      if (filterVal.sort === 'low_to_high') {
        updatedProducts.sort((a, b) => a.sale_price - b.sale_price);
      } else if (filterVal.sort === 'high_to_low') {
        updatedProducts.sort((a, b) => b.sale_price - a.sale_price);
      }
      setFilterProductList(updatedProducts);
    }
    if (filterVal.searchText !== "") {
      const updatedProducts = proudctList.filter(product =>
        product.name.toLowerCase().includes(filterVal.searchText.toLowerCase())
      );
      setFilterProductList(updatedProducts);
    }
    if(stateData?.searchVal){
      const updatedProducts = proudctList.filter(product =>
        product.name.toLowerCase().includes(stateData?.searchVal.toLowerCase())
      );
      setFilterProductList(updatedProducts);
    }
  }, [filterVal, filterVal.sort, filterVal.searchText, stateData]);


  return (

    <>
      <div className="row">
        {loading ? (
          <> <FrontLoader /></>
        ) : filterProductList?.length > 0 ? (
          filterProductList?.map((item, i) => (
            <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6 mb-4">
              <div className="product_box_main">
                <div className="quick-access-btns">
                  <button className="btn1" onClick={() => addProductInWishlistFun(item.id)}>
                    {isInWishlist(item.id) ? (
                      <i
                        class="fa-solid fa-heart"
                        style={{ fontSize: "18px", color: "#ddad67" }}
                        aria-hidden="true"
                      ></i>
                    ) : (
                      <>
                        <i
                          class="fa-solid fa-heart text-white"
                          aria-hidden="true"
                        ></i>
                      </>
                    )}
                  </button>
                </div>
                <div className="img_product">
                  <Link
                    to={`/product-detail/${item?.slug}`}
                    className=""
                  >
                    <img
                      className="withouthover"
                      src={imgBaseURL() + item.cover}
                      alt="product_img"
                      width='300'
                      height="400"
                        loading="lazy"
                    />
                    <img
                      className="withhover"
                      src={imgBaseURL() + item.hover_img}
                      alt="product_img"
                         width='300'
                      height="400"
               
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="rating_box mt-3">
                  <div className="ratings-custom d-flex align-items-center">
                    <Rating name="read-only" value={item?.review_average} readOnly /> {item?.review_count > 0 && <span>({item?.review_count})</span>} 
                  </div>
                </div>
                <div className="product_name">
                  <Link
                    to={`/product-detail/${item?.slug}`}
                    className=""
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="price_product">
                  ₹{item.sale_price}{" "}
                  <span className="high_price">₹{item.price}</span>
                </div>
                <ProductItemButton row={item} />
                <div className="off_price_badge">
                  {getPercentageOff(item.price, item.sale_price)}% off
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div class="product-item-inner">
              <img src={emptycart} alt="empty-box" width={300} height={300} />
              <h4>
                No products were found matching your selection.
              </h4>
            </div>
          </>
        )}
      </div>
    </>

  );
};

export default AllProducts;
