import React from "react";
import { useFrontDataContext } from "../../context/FrontContextProvider";

const TopHeader = () => {
  const { allData } = useFrontDataContext()

  return (
    <>
      <div className="top_alert">
        <div
          className="main_box_alert text-center alert  alert-dismissible fade show"
          role="alert"
        >
          {allData?.offer.offer}
          {/* <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button> */}
        </div>
      </div>
    </>
  );
};

export default TopHeader;
