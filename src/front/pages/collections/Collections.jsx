import React from "react";
import siderbg from "../../../assets/img/bundle-banner.png";
import cat1 from "../../../assets/img/shilajit.png";
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
                    <Link to="/shop">
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

          {/* <nav className="page-padingtion navigation mt-md-5 mt-4">
            <ul className="pagination justify-content-center">
              <li className="page-item left">
                <Link className="page-link" href="#" aria-label="Previous">
                  <i className="fa fa-arrow-left"></i>
                </Link>
              </li>
              <li className="page-item acitve">
                <Link className="page-link" href="#">
                  01
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="#">
                  02
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="#">
                  03
                </Link>
              </li>
              <li className="page-item next">
                <Link className="page-link" href="#" aria-label="Next">
                  <i className="fa fa-arrow-right"></i>
                </Link>
              </li>
            </ul>
          </nav> */}

        </div>
      </div>
    </div>
  );
};

export default Collections;
