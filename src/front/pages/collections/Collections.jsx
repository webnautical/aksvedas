import React from "react";
import siderbg from "../../../assets/img/bundle-banner.png";
import { Link } from "react-router-dom";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { imgBaseURL } from "../../../utility/Utility";
const Collections = () => {
  const { categories } = useFrontDataContext()

  return (
    <div className="collection-page">
      <div className="banner-img">
        <img src={siderbg} alt="" />
      </div>

      <div className="collectioncategries-outer">
        <div className="container">
          <h2>All Categories</h2>
          <div className="collectioncategries">
            <ul className="">

              {
                categories?.map((item, i) => (
                  <li key={i}>
                    <Link to={`/shop/${item?.slug}`}>
                      <div className="img-bg-cat">
                        <img src={imgBaseURL()+item.cover} alt="" />
                      </div>
                      <h4 className="text-capitalize">{item?.name}</h4>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
