import React from "react";
import { Link } from "react-router-dom";

const Payment = () => {

  return (
    <>
      <div className="col-lg-8">
        <h5 className="mb-0 flex-grow-1">Payment Selection</h5>
        <ul
          className="nav nav-pills arrow-navtabs  bg-grays mb-3 mt-4 nav-justified custom-nav"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3"
              data-bs-toggle="tab"
              to="#paypal"
              role="tab"
              aria-selected="false"
              tabIndex="-1"
            >
              <span className="d-block d-sm-none">
                <i className="fa-brands fa-paypal"></i>
              </span>
              <span className="d-none d-sm-block">
                <i className="fa-brands fa-paypal pe-2"></i> Paypal
              </span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3 active"
              data-bs-toggle="tab"
              to="#credit"
              role="tab"
              aria-selected="true"
            >
              <span className="d-block d-sm-none">
                <i className="fa fa-credit-card"></i>
              </span>
              <span className="d-none d-sm-block">
                <i className="fa fa-credit-card pe-2"></i> Credit / Debit
                Card
              </span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3"
              data-bs-toggle="tab"
              to="#cash"
              role="tab"
              aria-selected="false"
              tabIndex="-1"
            >
              <span className="d-block d-sm-none">
                <i className="fa-solid fa-money-bill-1"></i>
              </span>
              <span className="d-none d-sm-block">
                <i className="fa-solid fa-money-bill-1 pe-2"></i> Cash on
                Delivery
              </span>
            </Link>
          </li>
        </ul>
        <div className="tab-content p-0">
          <div className="tab-pane" id="paypal" role="tabpanel">
            <div className="card">
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-md-12">
                    <label htmlFor="buyers-name" className="form-label">
                      Buyers First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-name"
                      placeholder="Enter Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="buyers-last" className="form-label">
                      Buyers Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-last"
                      placeholder="Enter Last Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="buyers-address"
                      className="form-label"
                    >
                      Email Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-address"
                      placeholder="Enter Email Address"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">
                      Select your paypal account type
                    </label>
                    <div className="d-flex gap-4 mt-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="formRadios"
                          id="formRadios1"
                          checked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="formRadios1"
                        >
                          Domestic
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="formRadios"
                          id="formRadios2"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="formRadios2"
                        >
                          International
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hstack gap-2 justify-content-md-end pt-4">
                  <button type="button" className="btn-normals w-xs">
                    <i className="fa-brands fa-paypal pe-2"></i> Log into
                    my Paypal
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="tab-pane active show"
            id="credit"
            role="tabpanel"
          >
            <div className="card">
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-md-12">
                    <label htmlFor="cc-name" className="form-label">
                      Name on card
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-name"
                      placeholder="Enter name"
                    />
                    <small className="text-muted">
                      Full name as displayed on card
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="cc-number" className="form-label">
                      Credit card number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-number"
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="cc-expiration" className="form-label">
                      Expiration
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-expiration"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="cc-cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-cvv"
                      placeholder="xxx"
                    />
                  </div>
                </div>

                <div className="hstack gap-2 justify-content-md-end pt-4">
                  <button type="button" className="btn-normals w-xs">
                    Pay
                    <i className="fa-solid fa-right-from-bracket ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane" id="cash" role="tabpanel">
            <div className="card">
              <div className="card-body">
                <div className="text-center py-3">
                  <div className="avatar-md mx-auto mb-2">
                    <div className="avatar-title bg-grays rounded-circle">
                      <i className="fa-solid fa-money-bill-1 text-dark"></i>
                    </div>
                  </div>
                  <h5 className="fs-16 mb-3">Cash on Delivery</h5>
                  <p className=" w-75 mx-auto">
                    Integer vulputate metus eget purus maximus porttitor.
                    Maecenas ut porta justo. Donec finibus nec nibh ut
                    urna viverra semper.
                  </p>
                </div>
                <div className="hstack gap-2 justify-content-end pt-3">
                  <button type="button" className="btn-normals w-xs">
                    Continue
                    <i className="fa-solid fa-right-from-bracket ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
