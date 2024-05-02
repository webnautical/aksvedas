import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import { authCustomer, checkItem, imgBaseURL, textSlice, toastifyError, toastifySuccess } from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import { timeAgo } from './../../../utility/Date';
import { postDataAPI } from "../../../utility/api/api";

const Account = () => {
  const {customerDetails, wishlistData, getWishlistFun} = useFrontDataContext()

  useEffect(() => {
    getWishlistFun()
  }, [])

  const addWishlist = async (id) => {
    try {
      const param = { customer_id: authCustomer()?.id, product_id: id }
      const res = await postDataAPI('/v1/add-wishlist', param)
      if (res?.status) {
        getWishlistFun()
        toastifySuccess(res?.msg)
      } else {
        toastifyError('Product can not be added in wishlist')
      }
    } catch (error) {
      toastifyError('Server error')
    }
  }

  console.log("wishlistData",wishlistData)

  return (
    <>
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
            <Typography>About Us</Typography>
          </Breadcrumbs>
          <h1>About Us</h1>
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
                        className="nav-link fs-15 justify-content-start active"
                        data-bs-toggle="tab"
                        to="#custom-v-pills-profile"
                        role="tab"
                        aria-selected="true"
                      >
                        <i className="fa fa-user align-middle me-1"></i> Account
                        Info
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link fs-15 justify-content-start"
                        data-bs-toggle="tab"
                        to="#custom-v-pills-list"
                        role="tab"
                        aria-selected="false"
                        tabIndex="-1"
                      >
                        <i className="fa fa-heart align-middle me-1"></i> Wishlist
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link fs-15 justify-content-start"
                        data-bs-toggle="tab"
                        to="#custom-v-pills-order"
                        role="tab"
                        aria-selected="false"
                        tabIndex="-1"
                      >
                        <i className="fa fa-bag-shopping align-middle me-1"></i>{" "}
                        Order
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link fs-15 justify-content-start"
                        data-bs-toggle="tab"
                        to="#custom-v-pills-setting"
                        role="tab"
                        aria-selected="false"
                        tabIndex="-1"
                      >
                        <i className="fa fa-gear align-middle me-1"></i> Account
                        Settings
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link fs-15 justify-content-start"
                        to="/login"
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
                <div
                  className="tab-pane fade active show"
                  id="custom-v-pills-profile"
                  role="tabpanel"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex mb-4">
                        <h6 className="fs-15 mb-0 flex-grow-1 mb-0">
                          Personal Info
                        </h6>
                        <div className="flex-shrink-0">
                          <Link to="#!" className="editnum">
                            {" "}
                            <i className="fa fa-edit me-1"></i> Edit
                          </Link>
                        </div>
                      </div>

                      <div className="table-responsive table-card text-dark">
                        <table className="table table-borderless table-sm">
                          <tbody>
                            <tr>
                              <td>Customer Name</td>
                              <td className="fw-medium">{checkItem(customerDetails?.name)}</td>
                            </tr>
                            <tr>
                              <td>Mobile / Phone Number</td>
                              <td className="fw-medium">{customerDetails?.phone}</td>
                            </tr>
                            <tr>
                              <td>Email Address</td>
                              <td className="fw-medium">{checkItem(customerDetails?.email)}</td>
                            </tr>
                            <tr>
                              <td>Location</td>
                              <td className="fw-medium">{checkItem(customerDetails?.location)}</td>
                            </tr>
                            <tr>
                              <td>Since Member</td>
                              <td className="fw-medium">{timeAgo(customerDetails?.created_at)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3">
                        <h6 className="fs-15 mb-0">Billing Address</h6>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6 mb-3">
                          <div className="card mb-md-0">
                            <div className="card-body">
                              <div className="float-end clearfix">
                                <Link to="" className="editnum">
                                  <i className="fa fa-edit me-1"></i> Edit
                                </Link>
                              </div>
                              <div>
                                <h6 className="fs-15">Home Address</h6>
                                <h6>Raquel Murillo</h6>
                                <span>
                                  144 Cavendish Avenue, Indianapolis, IN 46251
                                </span>
                                <span>Mo. +(253) 01234 5678</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card mb-0">
                            <div className="card-body">
                              <div className="float-end clearfix">
                                <Link to="" className="editnum">
                                  <i className="fa fa-edit me-1"></i> Edit
                                </Link>
                              </div>
                              <div>
                                <p className="mb-3 fw-semibold fs-12 d-block  text-uppercase">
                                  Shipping Address
                                </p>
                                <h6>James Honda</h6>
                                <span>
                                  1246 Virgil Street Pensacola, FL 32501
                                </span>
                                <span>Mo. +(253) 01234 5678</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*end tab-pane*/}
                <div
                  className="tab-pane fade"
                  id="custom-v-pills-list"
                  role="tabpanel"
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive table-card whishlist-page">
                        {
                          wishlistData?.length > 0 ?
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
                                  {
                                    wishlistData?.map((item, i) => (
                                      <tr>
                                        <td>
                                          <div className="d-flex gap-3">
                                            <div className="avatar-sm">
                                              <div className="avatar-title rounded">
                                                <img
                                                  src={imgBaseURL() + item?.product?.cover}
                                                  alt=""
                                                  className="avatar-xs"
                                                />
                                              </div>
                                            </div>
                                            <div className="flex-grow-1">
                                              <Link to={`/product-detail/${item.product?.slug}`}>
                                                <h6 className="fs-16">
                                                  {textSlice(item?.product?.name, 50)}
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
                                            <span className="high_price">{item?.product?.price}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <span className="badge bg-success-subtle text-success ">
                                            In Stock
                                          </span>
                                        </td>
                                        <td>
                                          <ul className="list-unstyled d-flex gap-3 mb-0">
                                            <li>
                                              <Link
                                                to="shop-cart.html"
                                                className="btn btn-soft-info btn-icon btn-sm"
                                              >
                                                <i className="fa fa-cart-plus fs-13"></i>
                                              </Link>
                                            </li>
                                            <li>
                                              <button
                                                onClick={()=>addWishlist(item?.product?.id)}
                                                className="btn btn-soft-danger btn-icon btn-sm"
                                              >
                                                <i className="fa-solid fa-xmark  fs-13"></i>
                                              </button>
                                            </li>
                                          </ul>
                                        </td>
                                      </tr>
                                    ))
                                  }


                                </tbody>
                              </table>
                            </>
                            :
                            <>
                              <div className="col-12 text-center my-5">
                                <h6>There are no wishlist added.</h6>
                              </div>
                            </>
                        }

                      </div>
                      {
                        wishlistData?.length > 0 &&
                        <div className="row justify-content-end mt-2">
                          <div className="col-lg-6 col-md-7">
                            <div className="product-button">
                              <div className="doble_btn-pro flex-md-nowrap flex-wrap">
                                <Link to="/shop" className="btn-2 buy-btn">
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
                      }


                    </div>
                  </div>
                </div>
                {/*end tab-pane*/}
                <div
                  className="tab-pane fade"
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
                              <th scope="col">Product</th>
                              <th scope="col">Date</th>
                              <th scope="col">Total Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Link to="#">TBT15454841</Link>
                              </td>
                              <td>
                                <Link to="/shop">
                                  <h6 className="fs-15 mb-1">
                                    World's Most Expensive T Shirt
                                  </h6>
                                </Link>
                                <p className="mb-0  fs-13">Women's Clothes</p>
                              </td>
                              <td>
                                <span>01 Jul, 2022</span>
                              </td>
                              <td className="fw-medium">$287.53</td>
                              <td>
                                <span className="badge bg-success-subtle text-success">
                                  Delivered
                                </span>
                              </td>
                            </tr>
                            {/* Add more rows as needed */}
                          </tbody>
                        </table>
                      </div>
                      <div className="row justify-content-end mt-2">
                        <div className="col-lg-3 col-md-4">
                          <div className="product-button">
                            <div className="doble_btn-pro">
                              <Link to="/shop" className="btn-2">
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
                {/*end tab-pane*/}
                <div
                  className="tab-pane fade"
                  id="custom-v-pills-setting"
                  role="tabpanel"
                >
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col-lg-12">
                            <h5 className="fs-16 text-decoration-underline mb-4">
                              Personal Details
                            </h5>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="firstnameInput"
                                placeholder="Enter your firstname"
                                value="Raquel"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor="lastnameInput"
                                className="form-label"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastnameInput"
                                placeholder="Enter your lastname"
                                value="Murillo"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor="phonenumberInput"
                                className="form-label"
                              >
                                Phone Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="phonenumberInput"
                                placeholder="Enter your phone number"
                                value="+(253) 01234 5678"
                              />
                            </div>
                          </div>
                          {/*end col*/}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor="emailInput"
                                className="form-label"
                              >
                                Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="Enter your email"
                                value="raque@toner.com"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row justify-content-end mt-2">
                          <div className="col-lg-3 col-md-4">
                            <div className="product-button">
                              <div className="doble_btn-pro">
                                <button type="submit" className="btn-2">
                                  Update
                                  <i className="ms-2 fa-solid fa-arrow-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/*end tab-pane*/}
              </div>
            </div>
          </div>{" "}
        </div>
      </section>
    </>
  );
};

export default Account;
