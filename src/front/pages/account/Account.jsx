import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import points from '../../../assets/img/points.jpg'
import akshicon from '../../../assets/img/akscoin.png'
import {
  authCustomer,
  checkItem,
  getStatusColor,
  imgBaseURL,
  textFormated,
  textSlice,
  toastifyError,
  toastifySuccess,
  validateEmail,
} from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { timeAgo } from "./../../../utility/Date";
import { APICALL, postDataAPI } from "../../../utility/api/api";
import { SERVER_ERR } from "../../../utility/Constants";
import { addToCartRepeater } from "./../../../utility/api/RepeaterAPI";
import FrontLoader from "../../../components/front/FrontLoader";

const Account = () => {
  // const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [profileUpdate, setProfileUpdate] = useState(false)
  const navigate = useNavigate();
  const {
    customerDetails,
    wishlistData,
    getWishlistFun,
    getOrderListFun,
    orderList,
    getCartFun,
    getCustomerDetails,
    loading
  } = useFrontDataContext();
  const { page } = useParams();

  useEffect(() => {
    if (!authCustomer()?.token) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    getWishlistFun();
    getOrderListFun();
    getCustomerDetails()
  }, []);

  const addWishlist = async (id) => {
    try {
      const param = { customer_id: authCustomer()?.id, product_id: id };
      const res = await postDataAPI("/v1/add-wishlist", param);
      if (res?.status) {
        getWishlistFun();
        toastifySuccess(res?.msg);
      } else {
        toastifyError("Product can not be added in wishlist");
      }
    } catch (error) {
      toastifyError(SERVER_ERR);
    }
  };

  const [value, setValue] = useState({
    'name': customerDetails?.name,
    'email': customerDetails?.email,
    'phone': customerDetails?.phone,
    'id': customerDetails?.id
  })

  const openEdit = () => {
    setProfileUpdate(true)
    setValue({
      ...value,
      'name': customerDetails?.name,
      'email': customerDetails?.email,
      'phone': customerDetails?.phone,
      'id': customerDetails?.id
    })
  }
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const handleUpdateProfile = async () => {
    setSubLoading(true);

    const newErrors = {};
    if (!value.name) {
      newErrors.name = 'Name is required';
    }
    if (!value.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(value.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubLoading(false);
      return;
    } else {
      setErrors({});
    }
    try {
      const res = await APICALL('/v1/update-customer-details', 'post', value);
      if (res?.status) {
        setProfileUpdate(false);
        getCustomerDetails();
      } else {
      }
    } catch (error) {
    } finally {
      setSubLoading(false);
    }
  };

  const handleLogout = async () => {
    navigate('/')
    localStorage.clear()
    sessionStorage.clear();
  }
  const [cartCounts, setCartCounts] = useState({});
  const addToCartFun = (item) => {
    const itemId = item.product?.id;
    const currentCount = cartCounts[itemId] || 0;
    
    if (currentCount >= 5) {
      toastifyError('You cannot add more than 5 of this item.');
      return false;
    } else {
      const newCount = currentCount + 1;
      setCartCounts({ ...cartCounts, [itemId]: newCount });
      
      const param = { product_id: item.product?.id, qnt: 1 };
      addToCartRepeater(param, getWishlistFun, getCartFun, 0);
    }
  }

  return (
    <>

      {loading && <FrontLoader />}
      <div
        className="innabout-section"
        style={{ backgroundImage: `url(${siderbg})` }}
      >
        <div className="container">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="breacrumb-custom py-md-3 py-2"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Link underline="hover" to="/">
              Home
            </Link>
            <Typography>{textFormated(page)}</Typography>
          </Breadcrumbs>
          <h1>{textFormated(page)}</h1>
        </div>
      </div>

      <section className="cart-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-md-0 mb-4">
              <div className="card">
                <div className="card-body">
                  <ul
                    className="nav nav-pills flex-column gap-3"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <Link
                        className={`nav-link fs-15 justify-content-start ${page === "account-info" && "active"
                          }`}
                        data-bs-toggle="tab"
                        to="#custom-v-pills-profile"
                        role="tab"
                        aria-selected={page === "account-info" && true}
                        onClick={() => navigate("/account/account-info")}
                      >
                        <i className="fa fa-user align-middle me-1"></i> Account
                        Info
                      </Link>
                    </li>

                    <li className="nav-item" role="presentation">
                      <Link
                        className={`nav-link fs-15 justify-content-start ${page === "my-loyalty-points" && "active"
                          }`}
                        data-bs-toggle="tab"
                        to="#custom-v-pills-loyalty"
                        role="tab"
                        aria-selected={page === "my-loyalty-points" && true}
                        onClick={() => navigate("/account/my-loyalty-points")}
                      >
                        <i className="fa fa-inr align-middle me-1"></i> My AksCoins
                      </Link>
                    </li>

                    <li className="nav-item" role="presentation">
                      <Link
                        className={`nav-link fs-15 justify-content-start ${page === "wishlist" && "active"
                          }`}
                        data-bs-toggle="tab"
                        to="#custom-v-pills-list"
                        role="tab"
                        aria-selected={page === "wishlist" && true}
                        tabIndex="-1"
                        onClick={() => navigate("/account/wishlist")}
                      >
                        <i className="fa fa-heart align-middle me-1"></i>{" "}
                        Wishlist
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className={`nav-link fs-15 justify-content-start ${page === "orders" && "active"
                          }`}
                        data-bs-toggle="tab"
                        to="#custom-v-pills-order"
                        role="tab"
                        aria-selected={page === "orders" && true}
                        tabIndex="-1"
                        onClick={() => navigate("/account/orders")}
                      >
                        <i className="fa fa-bag-shopping align-middle me-1"></i>{" "}
                        Order
                      </Link>
                    </li>

                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link fs-15 justify-content-start"
                        to="/"
                        onClick={() => handleLogout()}
                        aria-selected="false"
                        tabIndex="-1"
                        role="tab"
                      >
                        <i className="fa-solid fa-right-from-bracket align-middle me-1"></i>{" "}
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="tab-content p-0">
                {/* Personal Info */}
                <div className={`tab-pane fade ${page === "account-info" && "active show"}`} id="custom-v-pills-profile" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex mb-4">
                        <h6 className="fs-15 mb-0 flex-grow-1 mb-0"> Personal Info</h6>
                        <div className="flex-shrink-0">
                          <Link to="#" onClick={() => openEdit()} className="editnum">{" "}
                            <i className="fa fa-edit me-1"></i> Edit
                          </Link>
                        </div>
                      </div>
                      {
                        !profileUpdate ?
                          <div className="table-responsive table-card text-dark">
                            <table className="table table-borderless table-sm">
                              <tbody>
                                <tr>
                                  <td>Customer Name</td>
                                  <td className="fw-medium">
                                    {checkItem(customerDetails?.name)}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Mobile / Phone Number</td>
                                  <td className="fw-medium">
                                    {customerDetails?.phone}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Email Address</td>
                                  <td className="fw-medium">
                                    {checkItem(customerDetails?.email)}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Since Member</td>
                                  <td className="fw-medium">
                                    {timeAgo(customerDetails?.created_at)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          :
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="firstnameInput" className="form-label" >Name</label>
                                <input type="text" className="form-control" id="firstnameInput" placeholder="Name"
                                  value={value.name}
                                  name='name'
                                  onChange={handleChange}
                                />
                                <span className="errMsg">{errors?.name}</span>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="firstnameInput" className="form-label" > Email</label>
                                <input type="text" className="form-control" id="firstnameInput" placeholder="Email"
                                  value={value.email}
                                  name='email'
                                  onChange={handleChange}
                                />
                                <span className="errMsg">{errors?.email}</span>

                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="firstnameInput" className="form-label" >Phone</label>
                                <input type="text" className="form-control" id="firstnameInput" placeholder="Phone"
                                  value={value.phone}
                                  name='phone'
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-12 text-end">
                              <button type="button" className="btn btn-primary mx-2" onClick={() => setProfileUpdate(false)}>Cancel</button>

                              {
                                subLoading ?
                                  <button class="btn btn-primary" type="button">
                                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    <span role="status">Loading...</span>
                                  </button>
                                  :
                                  <button type="button" className="btn btn-primary" onClick={() => handleUpdateProfile()}>
                                    Update <i className="ms-2 fa-solid fa-arrow-right"></i>
                                  </button>
                              }


                            </div>
                          </div>
                      }



                      <div className="mt-3">
                        <h6 className="fs-15 mb-0">Addresses</h6>
                      </div>
                      <div className="row mt-3">
                        {customerDetails?.address?.length > 0 ? (
                          <>
                            {customerDetails?.address?.map((item, i) => (
                              <div className="col-md-6 mb-3">
                                <div className="card mb-md-0">
                                  <div className="card-body">
                                    <div>
                                      <h6 className="fs-15">{"Address"} - {i + 1} - {item?.name}</h6>
                                      <span>{item?.address}</span>
                                      <br />
                                      <p className="mt-2 fw-bold">{item?.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Loyalty Coins */}
                <div className={`tab-pane fade ${page === "my-loyalty-points" && "active show"}`} id="custom-v-pills-loyalty" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex mb-4">
                        <h6 className="fs-15 mb-0 flex-grow-1 mb-0"> My AksCoins</h6>
                      </div>

                      <div>
                        <img style={{ width: '400px', margin: 'auto' }} src={points} alt="" />
                      </div>

                      <div className="text-center">
                        <h1 className="loyalty_text"><img style={{ width: '30px', height: '30px', objectFit: 'contain' }} src={akshicon} alt="icon-aksh" /> {customerDetails?.loyalty}</h1>
                      </div>

                      <div className="div text-center">
                        <p >Earn AksCoins with every purchase at Aksvedas - 1 AksCoin = 1 Rs , making your wellness journey even more rewarding!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/*WishList*/}
                <div
                  className={`tab-pane fade ${page === "wishlist" && "active show"
                    }`}
                  id="custom-v-pills-list"
                  role="tabpanel"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive table-card whishlist-page">
                        {wishlistData?.length > 0 ? (
                          <>
                            <table className="table fs-15 table-nowrap align-middle">
                              <thead>
                                <tr>
                                  <th scope="col">Product</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Stock Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {wishlistData?.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div className="d-flex gap-3 align-items-center">
                                        <div className="avatar-sm">
                                          <div className="avatar-title rounded">
                                            <img
                                              src={
                                                imgBaseURL() +
                                                item?.product?.cover
                                              }
                                              alt=""
                                              className="avatar-xs"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex-grow-1">
                                          <Link
                                            to={`/product-detail/${item.product?.slug}`}
                                          >
                                            <h6 className="fs-16">
                                              {textSlice(
                                                item?.product?.name,
                                                50
                                              )}
                                            </h6>
                                          </Link>
                                          <p className="mb-0 text-capitalize fs-13">
                                            {item?.product?.category?.name}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="price_product">
                                        ₹{item?.product?.sale_price}{" "}
                                        <span className="high_price">
                                          {item?.product?.price}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="py-1 px-2 bg-success-subtle text-success ">
                                        In Stock
                                      </span>
                                    </td>
                                    <td>
                                      <ul className="list-unstyled d-flex gap-3 mb-0">
                                        <li>
                                          <Link
                                            to="#"
                                            className="btn btn-soft-info btn-icon btn-sm"
                                            onClick={() => addToCartFun(item)}
                                          >
                                            <i className="fa fa-cart-plus fs-13"></i>
                                          </Link>
                                        </li>
                                        <li>
                                          <button onClick={() => addWishlist(item?.product?.id)} className="btn btn-soft-danger btn-icon btn-sm">
                                            <i className="fa-solid fa-xmark  fs-13"></i>
                                          </button>
                                        </li>
                                      </ul>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <div className="text-center py-3">
                            <div className="avatar-md avatrat-list mx-auto mb-2">
                              <div className="avatar-title rounded-circle">
                                <i className="fa-regular fa-heart"></i>
                              </div>
                            </div>
                            <h4 className="fs-20 mb-3">
                              Add Wishlist Product
                            </h4>
                            <p className=" w-75 mx-auto">
                              <Link className="text-decoration" to="/shop/all">
                                Add Items{" "}
                                <i className="fa-solid fa-arrow-right  ms-2"></i>
                              </Link>
                            </p>
                          </div>
                        )}
                      </div>
                      {wishlistData?.length > 0 && (
                        <div className="row justify-content-end mt-2">
                          <div className="col-lg-6 col-md-7">
                            <div className="product-button">
                              <div className="doble_btn-pro flex-md-nowrap flex-wrap">
                                <Link to="/shop/all" className="btn-2 buy-btn">
                                  Continue Shopping{" "}
                                  <i className="ms-2 fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link to="/checkout" className="btn-2">
                                  Checkout{" "}
                                  <i className="ms-2 fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/*Order List*/}
                <div
                  className={`tab-pane fade ${page === "orders" && "active show"
                    }`}
                  id="custom-v-pills-order"
                  role="tabpanel"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table fs-15 align-middle table-nowrap">
                          <thead>
                            <tr>
                              <th scope="col">Order ID</th>
                              <th scope="col">Date</th>
                              <th scope="col">Total Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col">Earned AksCoins</th>
                              <th scope="col">Review</th>
                              <th scope="col" className="text-center">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderList?.length > 0 ? (
                              <>
                                {orderList?.map((item, i) => (
                                  <tr>
                                    <td>
                                      <Link to={`/order-details/${item?.id}`}>
                                        {item?.id}
                                      </Link>
                                    </td>
                                    <td>
                                      <span>{timeAgo(item?.created_at)}</span>
                                    </td>
                                    <td className="fw-medium">
                                      ₹{item?.total_amount}
                                    </td>
                                    <td>
                                      <span style={{ color: getStatusColor(item?.order_status)?.color, background: getStatusColor(item?.order_status)?.bg }}
                                        className={`order_status_front`}
                                      >
                                        {item?.order_status}
                                      </span>
                                    </td>
                                    <td className="fw-medium">
                                      {item.earned_loyalty_discount ? item.earned_loyalty_discount : "---"}
                                    </td>
                                    <td>{item?.order_status == "Delivered" ? <><Link to={`/product-detail/${item?.order_products[0]?.product?.slug}`}>Add Review</Link></> : "---"}</td>
                                    <td className="fw-medium text-center">
                                      <Link to={`/order-details/${item?.id}`}>
                                        <i className="fa fa-eye"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <tr >
                                <td colspan="5">
                                  <div className="text-center py-3">
                                    <div className="avatar-md avatrat-list mx-auto mb-2">
                                      <div className="avatar-title rounded-circle">
                                        <i className="fa fa-bag-shopping"></i>
                                      </div>
                                    </div>
                                    <h4 className="fs-20 mb-3">
                                      You don't have any order history yet
                                    </h4>
                                    <p className=" w-75 mx-auto">
                                      <Link
                                        className="text-decoration"
                                        to="/shop/all"
                                      >
                                        Add Items{" "}
                                        <i className="fa-solid fa-arrow-right  ms-2"></i>
                                      </Link>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Add more rows as needed */}
                          </tbody>
                        </table>
                      </div>
                      <div className="row justify-content-end mt-2">
                        <div className="col-lg-3 col-md-4">
                          <div className="product-button">
                            <div className="doble_btn-pro">
                              <Link to="/shop/all" className="btn-2">
                                Continue Shopping{" "}
                                <i className="ms-2 fa-solid fa-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>{" "}
        </div>
      </section>

    </>
  );
};

export default Account;
