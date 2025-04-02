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
      return image
    }
  };


  const getCategoryImageMobile = () => {
    const catBanner = categories.find(cat => cat.slug === category);
    if(catBanner){
      return catBanner ? catBanner?.mobile_banner ? imgBaseURL() + catBanner?.mobile_banner : siderbg : siderbg;
    }else{
      const image = getImageByTitle(category)?.m_img;
      return  image
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
      const data = {img : banner?.img ? imgBaseURL() + banner?.img : siderbg, m_img : banner?.m_img ? imgBaseURL() + banner?.m_img : siderbg}
      return data
    }else{
      const data = {img :  siderbg, m_img : siderbg}
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
          {category == "mens-health-supplement" &&
        <div className="men_health_content row">
          <div className="col-12">
     <h2>Why Men Need Specialized Supplements 
     </h2>
     <p>Men's bodies have particular requirements, such as testosterone management, prostate health, and huge muscular mass, they require specific nutrients. The combination of age-related changes with daily stress levels and current eating patterns creates deficiency conditions that minimize energy levels and sexual function while harming immunity. The supplements designed to bridge specific gaps between nutrients assist men in maintaining hormonal equilibrium together with better physical performance and enhanced overall vitality. Men's formula supplements deliver targeted benefits for specific health needs including stamina improvements and joint function enhancements.</p>

     <h2>Key Benefits of Aksvedas Health Supplements for Men </h2>

     <p>Aksvedas produces plant-based nutritional supplements that enhance masculine health. The supplement Shilajit with Ginseng provides men with increased stamina while Testo At Max enhances male hormones alongside libido functions and Cal-D provides benefits for post-workout muscle repair. The supplements support maximum immune function with Immune At Max while Ashwagandha reduces stress and Progut optimizes gut health. The combination of anti-aging properties in Be Young and joint relief in Joint Care Oil creates a complete wellness solution that keeps active men strong and fit.
     </p>

     <h2 className="mb-2 mt-5">Aksvedas Men's Health Supplements – A Closer Look </h2>

<div className="points_product">
<h3 className="mt-2">1. Aksvedas Be Young | Anti-Aging Juice</h3>
     <p>Aksvedas Be Young represents an antioxidant juice combination created to prolong human lifespan. Men who consume this supplement will experience benefits from its combination of antioxidants and vitamins and herbal extracts because it supports skin health, energy production, and cellular repair and effectively fights oxidative stress for youthful vitality maintenance.</p>

     
     <h3 className="mt-2">2. Aksvedas Man At Max | Performance Booster </h3>
     <p>Man At Max uses natural energizing substances and libido-enhancing additives to boost male performance. This product enhances stamina, strength, and endurance levels that benefit men who want maximum physical capacities both in routine activities and intimate situations.
     </p>


     <h3 className="mt-2">3. Aksvedas Shilajit – The Ultimate Stamina Enhancer</h3>
     <p>Shilajit, a potent resin, boosts stamina and energy. Natural minerals and fulvic acid-rich Shilajit demonstrate its strength as a natural male vitality booster through its ability to boost testosterone and aid in muscle recovery and endurance.
     </p>

     <h3 className="mt-2">4. Aksvedas Multivitamin – Daily Nutritional Support</h3>
     <p>Aksvedas Multivitamin contains the essential vitamins and minerals specifically designed for men's nutritional needs. The supplement serves as a daily nutritional base because it completes diet deficiencies and supplies energy while boosting immunity to support every aspect of men's health.
     </p>

     <h3 className="mt-2">5. Aksvedas Moringa – The Superfood Supplement</h3>
     <p>Moringa delivers a dense combination of vital nutrients which include antioxidants together with anti-inflammatory properties. The supplement activates energy systems in addition to reinforcing immune responses while assisting detox operations which makes it adaptable for men's holistic health routines.
     </p>

     <h3 className="mt-2">6. Aksvedas Testo At Max | Testosterone Booster</h3>
     <p>Natural testosterone boosting occurs in Testo At Max due to its composition of ashwagandha and fenugreek ingredients. This supplement supports key development of muscles, and sexual drive and boosts energy production to help men stay strong throughout their aging process.
     </p>

     <h3 className="mt-2">7. Aksvedas Ginseng – The Ultimate Adaptogen</h3>
     <p>Ginseng, a renowned adaptogen, boosts energy and resilience. Testo At Max functions as a fatigue reducer which enhances mental clarity while boosting physical abilities suitable for active men facing stressful responsibilities.

     </p>


     <h3 className="mt-2">8. Aksvedas Ashwagandha – The Stress Buster</h3>
     <p>The stress-reducing adaptogenic characteristics of Ashwagandha help fight against stress. Ashwagandha helps men reduce cortisol levels and improve their mood while boosting their energy and delivering better sleep quality which makes it a natural method to maintain balance and strength.
     </p>

     <h3 className="mt-2">9. Aksvedas Immune At Max – Immunity Booster</h3>
     <p>Immune At Max supports immune health through its combination of vitamins and zinc along with herbal extract components. The product helps boost immune function while fighting fatigue and supporting recovery which enables men to stay healthy throughout the entire year.
     </p>

     <h3 className="mt-2">10. Aksvedas Progut – Gut Health Capsules</h3>
     <p>The gut health benefits of Progut exist because it combines prebiotics with probiotics to deliver results. The digestive system works better with Progut and it enhances both absorption of nutrients and immune system function leading to improved wellness for men.
     </p>


     
     <h3 className="mt-2">11. Aksvedas Joint Care Oil – Muscle & Joint Relief</h3>
     <p>The herbal extract components in Joint Care Oil function as a pain reliever for muscles and joints. The product helps active men who engage in physical activities to minimize stiffness and related discomfort while facilitating movement after intense workouts.
     </p>

     <h3 className="mt-2">12. Aksvedas Cal-D – Bone & Muscle Health</h3>
     <p>Cal-D works by combining calcium and vitamin D to provide bone and muscle strengthening benefits. This supplement supports joint flexibility and muscle function, protecting skeletal health, which is essential for extended physical performance in men.
     </p>


</div>

<h2>How to Choose the Right Men's Health Supplement?</h2>
     <p>Selecting the appropriate supplement product starts with defining the requirements, such as increased energy levels, better testosterone production, stronger immunity, or reduced joint problems. Check the needs based on your lifestyle choice and biological age as well as identified deficiencies. Natural and high-quality supplements from Aksvedas should be your choice while ensuring both the potency and safety of your ingredients. Always seek medical advice before combining supplements when managing specific health conditions to check their compatibility together with effectiveness.
     </p>


     <div className="row justify-content-center product_page_faq  all_product_additional_details mt-md-5 mt-3">
      <div className="col-md-8">
<h2 className="text-center mb-3">Frequently Asked Questions (FAQs)</h2>
      <div class="accordion" id="faqAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
        <h3>1. Why should men take health supplements?</h3>
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Supplements serve men by filling nutrient voids and boosting testosterone production and energy levels as well as supporting prostate and muscle wellness particularly because aging and stress affect overall vitality.
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
        <h3>2. How does testosterone booster help men?</h3>
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        The natural rise of hormone levels from testosterone boosters helps people gain muscle size and increases their sexual drive while boosting their energy and mood to offset aging effects and choices in life.
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
        <h3>3. How do multivitamins benefit men?</h3>
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Multivitamins contribute essential dietary components that benefit energy levels, immunity, and general health for active men who consume deficient diets.
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFour">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
        <h3>4. Can these health supplements be used together?</h3>
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Different health supplements can be combined although users should limit their intake of repetitive ingredients such as zinc. Request professional guidance for designing both safe and efficient stacked supplements.
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFive">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
        <h3>5. How long does it take to see results from health supplements?</h3>
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Health supplement outcomes differ according to product type since energy rise may manifest within a few days but testosterone and muscle development requires four to eight weeks with sustained intake alongside lifestyle support.
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingSix">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
        <h3>6. Are Aksvedas supplements natural?</h3>
      </button>
    </h2>
    <div id="collapseSix" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        The plant-based natural products at Aksvedas are produced in facilities that uphold GMP standards to ensure men's health products meet safety requirements and preserve their quality.
      </div>
    </div>
  </div>
</div>


      </div>
     </div>

          </div>
        </div>
      }
        </div>
      </div>
    </div>
  );
};

export default Shop;
