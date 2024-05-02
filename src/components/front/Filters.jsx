import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { useNavigate } from "react-router";

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

  const [value, setValue] = useState({ min: 0, max: 2000 });

  const handleSliderChange = (newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value: inputValue } = event.target;
    const numericValue = parseInt(
      inputValue.replace("₹", "").replace(/,/g, ""),
      10
    );

    setValue((prevValue) => ({
      ...prevValue,
      [name]: isNaN(numericValue)
        ? 0
        : Math.min(Math.max(0, numericValue), 2000),
    }));
  };
  const formatLabel = (value) => `₹${value.toLocaleString()}`;



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

      <div className="category">
        <h2>Price Range</h2>
        <div className="range-slider">
          <InputRange
            minValue={0}
            maxValue={2000}
            value={value}
            onChange={handleSliderChange}
            formatLabel={formatLabel}
          />
          <div className="text-min-max">
            <input
              type="text"
              name="min"
              value={`₹${value.min.toLocaleString()}`}
              onChange={handleInputChange}
              placeholder="Min price"
            />
            <input
              type="text"
              name="max"
              value={`₹${value.max.toLocaleString()}`}
              onChange={handleInputChange}
              placeholder="Max price"
            />
          </div>
        </div>

        <div className="price-radio-options">
          <div className="radio-options">
            {[
              "All Price",
              "Under ₹20",
              "₹25 to ₹100",
              "₹100 to ₹300",
              "₹300 to ₹500",
              "₹500 to ₹1,000",
              "₹1,000 to ₹10,000",
            ].map((option, index) => (
              <label key={index} className="custom-radio">
                <input
                  type="radio"
                  name="priceOption"
                  value={option}
                />
                <span className="checkmark"></span>
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button className="apllynow" onClick={() => handleFilter()}>Apply Now <i class="fa-solid fa-arrow-right"></i></button>
    </div>

  );
}

export default Filters;
