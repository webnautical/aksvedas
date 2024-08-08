import React, { useEffect, useState } from "react";
import "react-input-range/lib/css/index.css";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { useNavigate, useParams } from "react-router";

function Filters(props) {
  const navigate = useNavigate()
  const { categories } = useFrontDataContext()

  const [checkboxes, setCheckboxes] = useState({});

  const handleCategoryChange = (categorySlug) => {
    setCheckboxes({ ...checkboxes, [categorySlug]: !checkboxes[categorySlug] });
  };

  var checkedCategories = Object.keys(checkboxes).filter(key => checkboxes[key]);
  checkedCategories = checkedCategories.join('+')
  const handleFilter = () => {
    navigate(`/shop/${checkedCategories ? checkedCategories : 'all'}`)
  }
  const { category } = useParams();
  
  useEffect(() => {
    const params = category?.split('+');
    if(params){
      const result = {};
      params.forEach(key => {
        result[key] = true;
      });
      setCheckboxes(result)
    }
  }, [category])

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
      <button className="apllynow" onClick={() => handleFilter()}>Apply Now <i class="fa-solid fa-arrow-right"></i></button>
    </div>

  );
}

export default Filters;
