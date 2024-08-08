import { Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import productimg from "../../../assets/img/product.png";

const Address = () => {
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
            <Link underline="hover" href="/">
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
            <div className="col-lg-12">
              <div
                className="alert alert-danger alert-modern alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-box-arrow-in-right icons"></i>Returning
                customer?
                <a href="/customer/login" className="link-danger">
                  <strong> Click here to login</strong>.
                </a>
                <button
                  type="button"
                  className="btn-close p-4"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="mt-md-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-grow-1">
                    <h5 className="mb-0">Billing Address</h5>
                  </div>
                </div>
                <div className="row gy-3">
                  <div className="col-lg-6 col-12">
                    <div className="form-check card-radio">
                      <input
                        id="shippingAddress03"
                        name="shippingAddress"
                        type="radio"
                        checked
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        for="shippingAddress03"
                      >
                        <h6 className="mb-2">Witney Blessington</h6>
                        <p className="mb-0">
                          144 Cavendish Avenue, Indianapolis, IN 46251
                        </p>
                        <p className="mb-0">Mo. 012-345-6789</p>
                      </label>
                    </div>
                    <div className="d-flex flex-wrap p-2 py-1 bg-grays rounded-bottom border mt-n1">
                      <div>
                        <a href="" className="d-block p-1 px-2">
                          <i className="fa fa-edit me-1"></i> Edit
                        </a>
                      </div>
                      <div>
                        <a
                          href="#removeAddressModal"
                          className="d-block p-1 px-2"
                          data-bs-toggle="modal"
                        >
                          <i className="fa fa-trash me-1"></i> Remove
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="form-check card-radio">
                      <input
                        id="shippingAddress04"
                        name="shippingAddress"
                        type="radio"
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        for="shippingAddress04"
                      >
                        <h6 className="mb-2">Witney Blessington</h6>
                        <p className="mb-0">
                          144 Cavendish Avenue, Indianapolis, IN 46251
                        </p>
                        <p className="mb-0">Mo. 012-345-6789</p>
                      </label>
                    </div>
                    <div className="d-flex flex-wrap p-2 py-1 bg-grays rounded-bottom border mt-n1">
                      <div>
                        <a href="" className="d-block p-1 px-2">
                          <i className="fa fa-edit me-1"></i> Edit
                        </a>
                      </div>
                      <div>
                        <a
                          href="#removeAddressModal"
                          className="d-block p-1 px-2"
                          data-bs-toggle="modal"
                        >
                          <i className="fa fa-trash me-1"></i> Remove
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-4 mb-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-0">Add Address</h5>
                  </div>
                </div>
                <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="row">
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
            </div>
            <div className="col-lg-4  rightdiv-tableorder mt-lg-0 mt-3">
              <div className="sticky-side-div">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center">
                      <h6 className="mb-3 fs-14">
                        Have a <span className="fw-semibold">promo</span> code ?
                      </h6>
                    </div>
                    <div className="hstack gap-3 px-3 mx-n3">
                      <input
                        className="form-control me-auto"
                        type="text"
                        placeholder="Enter coupon code"
                        value="Toner15"
                        aria-label="Add Promo Code here..."
                      />
                      <button type="button" className="btn-normals w-xs">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card overflow-hidden mt-4">
                  <div className="card-header border-bottom-dashed">
                    <h5 className="card-title mb-0 fs-15">Order Summary</h5>
                  </div>
                  <div className="card-body pt-4">
                    <div className="table-responsive table-card">
                      <table className="table table-borderless mb-0 fs-15">
                        <tbody>
                          <tr>
                            <td>Sub Total :</td>
                            <td className="text-end cart-subtotal">$510.50</td>
                          </tr>
                          <tr>
                            <td>
                              Discount{" "}
                              <span>(Toner15)</span>:
                            </td>
                            <td className="text-end cart-discount">$18.00</td>
                          </tr>
                          <tr>
                            <td>Shipping Charge :</td>
                            <td className="text-end cart-shipping">$2.4</td>
                          </tr>
                          <tr>
                            <td>Estimated Tax (12.5%) : </td>
                            <td className="text-end cart-tax">$1.6</td>
                          </tr>
                          <tr className=" bg-grays">
                            <th><strong>Total (USD) :</strong></th>
                            <td className="text-end">
                              <span className="fw-semibold cart-total">
                                $630.25
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="product-button">
                  <div className="doble_btn-pro">
                    <Link to="/cart" className="btn-2 buy-btn">
                      Back To Cart{" "}
                    </Link>
                    <Link to="/payment" className="btn-2">
                      Continue Payment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Address;
