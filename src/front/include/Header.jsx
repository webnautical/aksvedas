import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logosite.svg";
import TopHeader from "../../components/front/TopHeader";
import CartPopUp from "../../components/front/CartPopUp";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { authCustomer, imgBaseURL } from "../../utility/Utility";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // You can adjust the scroll threshold
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const {
    categories,
    wishlistData,
    customerDetails,
    cartData,
    webAttr,
    products,
    getFuxedReviewList,
  } = useFrontDataContext();
  const navigate = useNavigate();
  const [isOpen, setDropdownOpen] = useState(false);
  const [headerSearchVal, setHeaderSearchVal] = useState();

  useEffect(() => {
    const handleBodyClick = (event) => {
      if (!event.target.closest(".dropdown") && isOpen) {
        setDropdownOpen(false);
      }
    };
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLinkClick = () => {
    // setIsOpen(false);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setHeaderSearchVal();
    setSuggestions([]);
  };

  useEffect(() => {
    getFuxedReviewList();
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const redirectPage = (tab) => {
    navigate(`/account/${tab}`);
  };

  const handleLogout = async () => {
    navigate("/");
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleMobileRedirect = (page) => {
    navigate(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/shop/all", { state: { searchVal: headerSearchVal } });
  };

  const [suggestions, setSuggestions] = useState([]);
  const handleChange = (e) => {
    const value = e.target.value;
    setHeaderSearchVal(value);

    if (value) {
      const filteredSuggestions = products
        ?.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = () => {
    setHeaderSearchVal("");
    setIsSearchOpen(false);
    setSuggestions([]);
  };
  return (
    <>
      <CartPopUp />

      <div
        className={`mbile-heaader d-md-none d-block ${
          isScrolled ? "scrolled" : ""
        }`}
      >
        <TopHeader />
        <div className="container">
          <div className="mobile-menu-inner">
            <div className="moble-logo">
              <Link onClick={handleLinkClick} to="/">
                {" "}
                <img src={imgBaseURL() + webAttr?.logo} alt="" />
              </Link>
            </div>
            <div className="mboiel-right">
              <ul>
                {authCustomer()?.id ? (
                  <li className="dropdown">
                    <span className="user_mb" onClick={toggleDropdown}>
                      <i className="fa-regular fa-user"></i>
                    </span>
                    {isOpen && (
                      <div className="dropdown-menu dropdown-menu-end show">
                        <h6 className="dropdown-header">
                          Welcome {authCustomer()?.name?.split(" ")[0]}
                        </h6>
                        <Link
                          className="dropdown-item"
                          to={`/account/account-info`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fa fa-user me-1"></i>My Account
                        </Link>

                        <Link
                          className="dropdown-item coin_gap "
                          to={"/account/my-loyalty-points"}
                        >
                          <i className="fa fa-wallet me-1"></i> My Akscoins
                          {customerDetails?.loyalty !== undefined &&
                            customerDetails?.loyalty !== 0 && (
                              <span class="mobile_ak ak_coinss">
                                {customerDetails.loyalty}
                              </span>
                            )}
                        </Link>

                        <Link
                          className="dropdown-item"
                          to={"/account/orders"}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fa fa-cart-plus me-1"></i>My Orders
                        </Link>

                        <div className="dropdown-divider"></div>
                        <Link
                          to={"/"}
                          onClick={() => handleLogout()}
                          className="dropdown-item"
                        >
                          <i class="fa-solid fa-right-from-bracket"></i>Logout
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/login">
                      <i class="fa-regular fa-user"></i>Login
                    </Link>{" "}
                  </li>
                )}

                {/* {authCustomer()?.id && ( */}
                  <li
                    className="wish_phone_btn"
                    style={{ position: "relative" }}
                    onClick={() => redirectPage("wishlist")}
                  >
                    <button className="border-0 p-0 text-dark">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={20}
                        height={20}
                        x="0"
                        y="0"
                        viewBox="0 0 100 100"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <g>
                          <path
                            d="M50 91a10.183 10.183 0 0 1-7.242-2.999V88L9.629 54.871C4.71 49.952 2 43.412 2 36.454v-.407c0-6.958 2.71-13.499 7.629-18.417S21.09 10 28.045 10h.41c6.955 0 13.497 2.71 18.416 7.629L50 20.758l3.129-3.129C58.048 12.71 64.59 10 71.545 10h.41c6.955 0 13.497 2.71 18.416 7.629S98 29.088 98 36.046v.407c0 6.958-2.71 13.499-7.629 18.417L57.242 88A10.18 10.18 0 0 1 50 91zm-3-7.242c1.608 1.605 4.395 1.601 6-.001L86.129 50.63A19.925 19.925 0 0 0 92 36.454v-.407c0-5.355-2.086-10.389-5.871-14.175S77.308 16 71.955 16h-.41a19.91 19.91 0 0 0-14.174 5.871l-5.25 5.25a2.998 2.998 0 0 1-4.242 0l-5.25-5.25A19.91 19.91 0 0 0 28.455 16h-.41c-5.353 0-10.389 2.084-14.174 5.871S8 30.691 8 36.046v.407a19.919 19.919 0 0 0 5.871 14.175z"
                            fill={333330}
                            opacity="1"
                            data-original="#000000"
                          ></path>
                        </g>
                      </svg>
                      {wishlistData?.length != 0 && (
                        <span>{wishlistData?.length}</span>
                      )}
                    </button>
                  </li>
                {/* )} */}

                {/* {authCustomer()?.id && ( */}
                  <li className="cart_li">
                    <Link
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={24}
                        height={24}
                        x="0"
                        y="0"
                        viewBox="0 0 64 64"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <g>
                          <path
                            d="M25.308 61.679c-3.514 0-6.373-2.859-6.373-6.373s2.859-6.372 6.373-6.372 6.373 2.858 6.373 6.372-2.859 6.373-6.373 6.373zm0-8.745a2.375 2.375 0 0 0-2.373 2.372c0 1.309 1.064 2.373 2.373 2.373s2.373-1.064 2.373-2.373a2.375 2.375 0 0 0-2.373-2.372zM47.462 61.679c-3.514 0-6.372-2.859-6.372-6.373s2.858-6.372 6.372-6.372 6.373 2.858 6.373 6.372-2.86 6.373-6.373 6.373zm0-8.745a2.375 2.375 0 0 0-2.372 2.372 2.375 2.375 0 0 0 2.372 2.373 2.375 2.375 0 0 0 2.373-2.373 2.375 2.375 0 0 0-2.373-2.372zM52.128 43.994H20.709a6.482 6.482 0 0 1-6.35-5.061L7.838 10.456a1.264 1.264 0 0 0-.696-.86L1.733 7.089a2.5 2.5 0 0 1 2.102-4.536L9.244 5.06a6.293 6.293 0 0 1 3.468 4.28l6.521 28.479a1.506 1.506 0 0 0 1.476 1.176h31.419a1.51 1.51 0 0 0 1.476-1.171l5.07-21.813a1.488 1.488 0 0 0-.288-1.284 1.49 1.49 0 0 0-1.186-.572h-37a2.5 2.5 0 1 1 0-5h37c1.999 0 3.857.897 5.101 2.462s1.696 3.579 1.244 5.526l-5.071 21.814a6.489 6.489 0 0 1-6.346 5.037z"
                            fill={333330}
                            opacity="1"
                            data-original="#000000"
                          ></path>
                        </g>
                      </svg>
                      {cartData?.length != 0 && <span>{cartData?.length}</span>}
                    </Link>
                  </li>
                {/* // )} */}
                <li className="toggle_mobile">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                  >
                    <i className="fa fa-bars"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={headerSearchVal}
              onChange={handleChange}
            />
            <button onClick={(e) => handleSearch(e)}>
              <i className="fa fa-search"></i>
            </button>

            <div className="suggestion">
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product-detail/${product?.slug}`}
                        onClick={() => handleSuggestionClick()}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`main_header ${isScrolled ? "scrolled" : ""}`}>
        <TopHeader />
        <section className="header d-md-block d-none">
          <div className="container">
            <div className="main_inner_header">
              <div className="text-center top_logo_section">
                <Link onClick={handleLinkClick} to="/">
                  {" "}
                  <img
                    className="mx-auto"
                    src={imgBaseURL() + webAttr?.logo}
                    alt=""
                  />
                </Link>
              </div>

              <div className="right_option_bar">
                <ul>
                  {authCustomer()?.id ? (
                    <li>
                      <Link to="#">
                        <span>
                          <i class="fa-regular fa-user"></i>
                          {authCustomer()?.name
                            ? authCustomer()?.name?.split(" ")[0]
                            : "User"}
                        </span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end show">
                        <h6 className="dropdown-header">
                          Welcome {authCustomer()?.name}
                        </h6>
                        <Link
                          className="dropdown-item"
                          to={`/account/account-info`}
                        >
                          <i className="fa fa-user me-1"></i>My Account
                        </Link>
                        <Link
                          className="dropdown-item"
                          to={"/account/my-loyalty-points"}
                        >
                          <i className="fa fa-wallet me-1"></i>My Akscoins
                          {customerDetails?.loyalty !== undefined &&
                            customerDetails?.loyalty !== 0 && (
                              <span class="ak_coinss">
                                {customerDetails.loyalty}
                              </span>
                            )}
                        </Link>
                        <Link className="dropdown-item" to={"/account/orders"}>
                          <i className="fa fa-cart-plus"></i>My Orders
                        </Link>

                        <div className="dropdown-divider"></div>
                        <Link
                          to={"/"}
                          onClick={() => handleLogout()}
                          className="dropdown-item"
                        >
                          <i class="fa-solid fa-right-from-bracket"></i>Logout
                        </Link>
                      </div>
                    </li>
                  ) : (
                    <li>
                      {" "}
                      <Link to="/login">
                        <i class="fa-regular fa-user"></i>Login
                      </Link>{" "}
                    </li>
                  )}

                  {/* {authCustomer()?.id && ( */}
                    <li>
                      <button
                        className="text-dark planBtn"
                        onClick={() => redirectPage("wishlist")}
                      >
                        <i class="fa-regular fa-heart"></i>
                        {wishlistData?.length != 0 && (
                          <span>{wishlistData?.length}</span>
                        )}
                      </button>
                    </li>
                  {/* )} */}

                  <li>
                    <Link>
                      <div className="search-icon" onClick={toggleSearch}>
                        <i className="fa fa-search"></i>
                      </div>
                      {isSearchOpen && (
                        <>
                          <form action="" onSubmit={handleSearch}>
                            <div>
                              <div className="search-bar" ref={searchRef}>
                                <input
                                  type="text"
                                  placeholder="Search"
                                  value={headerSearchVal}
                                  onChange={handleChange}
                                />
                                <button type="button" onClick={closeSearch}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>

                                <div className="suggestion">
                                  {suggestions.length > 0 && (
                                    <ul className="suggestions">
                                      {suggestions.map((product) => (
                                        <li key={product.id}>
                                          <Link
                                            to={`/product-detail/${product?.slug}`}
                                            onClick={() =>
                                              handleSuggestionClick()
                                            }
                                          >
                                            {product.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </Link>
                  </li>

                  {/* {authCustomer()?.id && ( */}
                    <li className="cart_li">
                      <Link
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width={24}
                          height={24}
                          x="0"
                          y="0"
                          viewBox="0 0 64 64"
                          style={{ enableBackground: "new 0 0 512 512" }}
                          xmlSpace="preserve"
                        >
                          <g>
                            <path
                              d="M25.308 61.679c-3.514 0-6.373-2.859-6.373-6.373s2.859-6.372 6.373-6.372 6.373 2.858 6.373 6.372-2.859 6.373-6.373 6.373zm0-8.745a2.375 2.375 0 0 0-2.373 2.372c0 1.309 1.064 2.373 2.373 2.373s2.373-1.064 2.373-2.373a2.375 2.375 0 0 0-2.373-2.372zM47.462 61.679c-3.514 0-6.372-2.859-6.372-6.373s2.858-6.372 6.372-6.372 6.373 2.858 6.373 6.372-2.86 6.373-6.373 6.373zm0-8.745a2.375 2.375 0 0 0-2.372 2.372 2.375 2.375 0 0 0 2.372 2.373 2.375 2.375 0 0 0 2.373-2.373 2.375 2.375 0 0 0-2.373-2.372zM52.128 43.994H20.709a6.482 6.482 0 0 1-6.35-5.061L7.838 10.456a1.264 1.264 0 0 0-.696-.86L1.733 7.089a2.5 2.5 0 0 1 2.102-4.536L9.244 5.06a6.293 6.293 0 0 1 3.468 4.28l6.521 28.479a1.506 1.506 0 0 0 1.476 1.176h31.419a1.51 1.51 0 0 0 1.476-1.171l5.07-21.813a1.488 1.488 0 0 0-.288-1.284 1.49 1.49 0 0 0-1.186-.572h-37a2.5 2.5 0 1 1 0-5h37c1.999 0 3.857.897 5.101 2.462s1.696 3.579 1.244 5.526l-5.071 21.814a6.489 6.489 0 0 1-6.346 5.037z"
                              fill={333330}
                              opacity="1"
                              data-original="#000000"
                            ></path>
                          </g>
                        </svg>
                        {cartData?.length != 0 && (
                          <span>{cartData?.length}</span>
                        )}
                      </Link>
                    </li>
                  {/* )} */}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <header className="d-md-block d-none">
          <nav>
            <ul>
              <li>
                <Link
                  to="/"
                  className={
                    location.pathname === "/" ? "active-tab " : ""
                  }
                >
                  {" "}
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={
                    location.pathname === "/about"
                      ? "active-tab "
                      : ""
                  }
                >
                  About Us{" "}
                </Link>
              </li>
              <li className=" dropdown dropdown-hover">
                <Link to="/shop/all" className="dropdown-toggle">
                  Shop
                </Link>
                <ul className="dropdown-menu dropdown-menu-md dropdown-menu-center dropdown-menu-list submenu">
                  {categories?.map((item, i) => {
                    const isActive = location.pathname.includes(
                      `/shop/${item?.slug}`
                    );

                    return (
                      <li key={i}>
                        <Link
                          to={`/shop/${item?.slug}`}
                          className={isActive ? "active-tab " : ""}
                        >
                          {item?.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={
                    location.pathname === "/blog"
                      ? "active-tab "
                      : ""
                  }
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className={
                    location.pathname === "/contact-us"
                      ? "active-tab "
                      : ""
                  }
                >
                  Contact{" "}
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <div
        className="offcanvas offcanvas-start offcanvas-mobile-header"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            {" "}
            <Link onClick={handleLinkClick} to="/">
              {" "}
              <img src={imgBaseURL() + webAttr?.logo} alt="" />
            </Link>
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="#"
                onClick={() => handleMobileRedirect("/")}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                className="nav-link"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#"
                onClick={() => handleMobileRedirect("/about")}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                className="nav-link"
              >
                About Us
              </Link>
            </li>
            <li className="nav-item dropdown dropdown-fullwidth">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                data-bs-toggle="dropdown"
                id="menu-item-blocks-canvas"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Shop
              </Link>
              <div
                className="dropdown-menu mega-menu"
                aria-labelledby="menu-item-blocks-canvas"
              >
                <div className="megamenu-home">
                  <ul className="list-unstyled">
                    {categories?.map((item, i) => (
                      <li>
                        <Link
                          onClick={() =>
                            handleMobileRedirect(`/shop/${item?.slug}`)
                          }
                          to={`#`}
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        >
                          {item?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link
                to="#"
                onClick={() => handleMobileRedirect("/blog")}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                className="nav-link"
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                className="nav-link"
                to="#"
                onClick={() => handleMobileRedirect("/contact-us")}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
