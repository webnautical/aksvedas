import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "react-input-range/lib/css/index.css";
import { useFrontDataContext } from "../../context/FrontContextProvider";

function Filters({ closeFilterOverlay }) {
  const navigate = useNavigate();
  const { categories } = useFrontDataContext();
  const [checkboxes, setCheckboxes] = useState({});
  const { category } = useParams();

  const handleCategoryChange = (categorySlug) => {
    setCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev, [categorySlug]: !prev[categorySlug] };
  
      if (updatedCheckboxes["all"]) {
        delete updatedCheckboxes["all"];
      }
  
      return updatedCheckboxes;
    });
  };

  var checkedCategories = Object.keys(checkboxes).filter(key => checkboxes[key]);
  checkedCategories = checkedCategories.join('+');

  const handleFilter = () => {
    navigate(`/shop/${checkedCategories ? checkedCategories : 'all'}`);
    closeFilterOverlay(); // Close the filter overlay after applying the filter
  };

  useEffect(() => {
    const params = category?.split('+');
    if(params){
      const result = {};
      params.forEach(key => {
        result[key] = true;
      });
      setCheckboxes(result);
    }
  }, [category]);

  return (
    <div className="innerfiltermpbile">
      <div className="category">
        <h2>Category</h2>
        <div className="filter-checkbox">
          {categories?.map((option, index) => (
            <label key={index} className="custom-checkbox text-capitalize">
              <input
                type="checkbox"
                name={option.name}
                checked={!!checkboxes[option.slug]}
                onChange={() => handleCategoryChange(option.slug)}
              />
              <span className="checkmark"></span>
              {option.name}
            </label>
          ))}
        </div>
      </div>
      <button className="apllynow" onClick={handleFilter}>
        Apply Now <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}

export default Filters;
