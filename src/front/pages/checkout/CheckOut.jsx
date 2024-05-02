import React from "react";
import { Link } from "react-router-dom";
import { imgBaseURL } from "../../../utility/Utility";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
const CheckOut = () => {
  const { cartData } = useFrontDataContext()
  return (
    <>
      <div className="col-xl-8">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive table-card whishlist-page">
              <table className="table align-middle table-borderless table-nowrap text-center mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-start">
                      Product
                    </th>
                    <th scope="col">Price</th>
                    <th scope="col">QNT</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    cartData?.length > 0 ?
                      cartData?.map((item, i) => (
                        <tr>
                          <td className="text-start">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar-sm flex-shrink-0">
                                <div className="avatar-title  rounded-3">
                                  <img
                                    src={imgBaseURL() + item?.product?.cover}
                                    alt=""
                                    className="avatar-xs"
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fs-16">
                                  {item?.product?.name}
                                </h6>
                                <p className="mb-0 text-muted fs-13">
                                  {item?.product?.sku}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="price_product">
                              ₹{item?.product?.sale_price} <span className="high_price">₹{item?.product?.price}</span>
                            </div>
                          </td>
                          <td>{item?.qnt}</td>
                        </tr>
                      ))
                      :
                      <>
                        <h5>There are no product added on your cart.</h5>
                      </>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1">
              <h5 className="mb-0">Billing Address</h5>
            </div>
            <div className="flex-shrink-0">
              <Link href="/add-address" className="fs-14">
                Add Address
              </Link>
            </div>
          </div>
          <div className="row gy-3">
            <div className="col-lg-6 col-12">
              <div className="form-check card-radio">
                <input
                  id="shippingAddress03"
                  name="shippingAddress"
                  type="radio"
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
        </div>
      </div>
    </>
  );
};

export default CheckOut;
