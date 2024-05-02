import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logosite.svg";
import TopHeader from "../../components/front/TopHeader";
import CartPopUp from "../../components/front/CartPopUp";
import { useFrontDataContext } from "../../context/FrontContextProvider";
import { authCustomer, authUser } from "../../utility/Utility";
import { axiosInstance } from "../../utility/api/interceptor";

const Header = () => {
  const { categories, wishlistData, cartData } = useFrontDataContext()
  const navigate = useNavigate()
  const [isOpen, setDropdownOpen] = useState(false);

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

  const [showChildDropdown, setShowChildDropdown, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const [showMenu, setShowMenu] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  useEffect(() => {
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
    const data = { tab: tab }
    navigate('/account', { state: { date: data } })
  }

  const handleLogout = async () => {
    navigate('/')
    localStorage.clear()
    // const res = await axiosInstance.post('/logout')
    // if(res?.data.status){
    // }
  }

  return (
    <>
      <CartPopUp />
      <TopHeader></TopHeader>
      <div className="mbile-heaader d-md-none d-block">
        <div className="container">
          <div className="mobile-menu-inner">
            <div className="moble-logo">
              <Link onClick={handleLinkClick} to="/">
                {" "}
                <img src={logo} alt="" />
              </Link>
            </div>
            <div className="mboiel-right">
              <ul>
                <li className="dropdown">
                  <span onClick={toggleDropdown}>
                    <i className="fa-regular fa-user"></i>
                  </span>
                  {isOpen && (
                    <div className="dropdown-menu dropdown-menu-end show">
                      <h6 className="dropdown-header">Welcome Diana!</h6>
                      <a className="dropdown-item" href="order-history.html">
                        <i className="fa fa-cart-plus me-1"></i> Order History
                      </a>
                      <a className="dropdown-item" href="track-order.html">
                        <i className="fa fa-truck me-1"></i> Track Orders
                      </a>
                      <a className="dropdown-item" href="/account">
                        <i className="fa fa-user me-1"></i> My Account
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        href="auth-logout-basic.html"
                      >
                        <i class="fa-solid fa-right-from-bracket"></i> Logout
                      </a>
                    </div>
                  )}
                </li>

                <li>
                  <Link to="/whishlist">
                    <i class="fa-regular fa-heart"></i>
                    <span>2</span>
                  </Link>
                </li>
                <li className="cart_li">
                  <Link
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                  >
                    <i className="fa fa-cart-plus"></i>
                    <span> 2</span>
                  </Link>
                </li>
                <li>
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
            <input type="text" placeholder="Search..." />
            <button onClick={closeSearch}>
              <i className="fa fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      <section className="header d-md-block d-none">
        <div className="container">
          <div className="main_inner_header">
            <div className="text-center top_logo_section">
              <Link onClick={handleLinkClick} to="/">
                {" "}
                <img className="mx-auto" src={logo} alt="" />
              </Link>
            </div>

            <div className="right_option_bar">
              <ul>
                {
                  authCustomer()?.id ?
                    <li>
                      <Link to="#">
                        <span>
                          <i class="fa-regular fa-user"></i>User
                        </span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end show">
                        <h6 className="dropdown-header">Welcome {authCustomer()?.name}</h6>
                        <a className="dropdown-item" href="order-history.html">
                          <i className="fa fa-cart-plus me-1"></i> Order History
                        </a>
                        <a className="dropdown-item" href="track-order.html">
                          <i className="fa fa-truck me-1"></i> Track Orders
                        </a>
                        <Link className="dropdown-item" to={`/account`}>
                          <i className="fa fa-user me-1"></i> My Account
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to={'#'} onClick={() => handleLogout()} className="dropdown-item">
                          <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </Link>
                      </div>
                    </li>
                    :
                    <li>  <Link to="/login">
                      <i class="fa-regular fa-user"></i>Login
                    </Link> </li>
                }
                {authCustomer()?.id &&
                  <li>
                    <button className="text-dark planBtn" onClick={() => redirectPage('whishlist')}>
                      <i class="fa-regular fa-heart"></i>({wishlistData?.length})
                    </button>
                  </li>
                }

                <li>
                  <Link>
                    <div className="search-icon" onClick={toggleSearch}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    {isSearchOpen && (
                      <>
                        <div className="search-bar" ref={searchRef}>
                          <input type="text" placeholder="Search..." />
                          <button onClick={closeSearch}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </Link>
                </li>

                {authCustomer()?.id &&
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
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 48 48"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        fillRule="evenodd"
                        className=""
                      >
                        <g>
                          <path
                            d="M14.519 13.5h-2.657a3.5 3.5 0 0 0-3.491 3.251l-1.714 24a3.5 3.5 0 0 0 3.491 3.749h27.704a3.502 3.502 0 0 0 3.491-3.749l-1.714-24a3.5 3.5 0 0 0-3.491-3.251H33.5V13A9.5 9.5 0 0 0 24 3.5c-5.055 0-9.727 4.026-9.5 9.5l.019.5zm18.981 3V24a1.5 1.5 0 0 1-3 0v-7.5h-13V24a1.5 1.5 0 0 1-3 0s.13-3.505.087-7.5h-2.725a.5.5 0 0 0-.498.464l-1.715 24a.5.5 0 0 0 .499.536h27.704a.502.502 0 0 0 .499-.536l-1.715-24a.5.5 0 0 0-.498-.464zm-3-3V13a6.5 6.5 0 1 0-13 0v.5z"
                            fill="#000000"
                            opacity="1"
                            data-original="#000000"
                          />
                        </g>
                      </svg>
                      ({cartData?.length})
                    </Link>
                  </li>
                }


              </ul>
            </div>
          </div>
        </div>
      </section>

      <header className=" d-md-block d-none">
        <nav>
          <ul>
            <li><Link to="/"> Home</Link></li>
            <li><Link to="/about">About Us </Link></li>
            <li className=" dropdown dropdown-hover">
              <Link to="/shop/all" className="dropdown-toggle">Shop</Link>
              <ul className="dropdown-menu dropdown-menu-md dropdown-menu-center dropdown-menu-list submenu">

                {
                  categories?.map((item, i) => (
                    <li>
                      <Link to={`/shop/${item?.slug}`}>{item?.name}</Link>
                    </li>
                  ))
                }

              </ul>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/blog">Consult by Doctor</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>

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
              <img src={logo} alt="" />
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
              <Link onClick={handleLinkClick} className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={handleLinkClick} className="nav-link" to="/about">
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
                    <li>
                      <Link onClick={handleLinkClick} to="">
                        View All
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Cardiac Wellness
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Blood Purifier
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Pain Reliever
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Men’s Wellness
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Women’s Wellness
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Skin Wellness
                      </Link>
                    </li>
                    <li>
                      <Link onClick={handleLinkClick} to="#">
                        Hair Wellness
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link onClick={handleLinkClick} className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                onClick={handleLinkClick}
                className="nav-link"
                to="/contact-us"
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
