import React, { useEffect } from "react";
import { useDataContext } from "../../../context/ContextProvider";
import Spinner from "../../../components/admin/Spinner";
import { authUser } from "../../../utility/Utility";
import { Link, useNavigate } from "react-router-dom";
export const Dashboard = () => {
  const navigate = useNavigate()
  const { countData, contextLoading, fetchData } = useDataContext();
  useEffect(() => {
    fetchData();
  }, []);

  console.log("countData", countData)

  return (
    <>
      <div className="content-wrapper">
        <div className="flex-grow-1 pt-3">
          <div className="row">
            <div class="col-12 mb-3">
              <div class="card tt-page-header">
                <div class="card-body d-lg-flex align-items-center justify-content-lg-between">
                  <div class="tt-page-title">
                    <h2
                      class="h5 mb-lg-0 text-capitalize"
                      data-sider-select-id="e5dbc98d-9ad1-416b-94b8-12e029965e98"
                    >
                      {authUser()?.name} Dashboard 🎉
                    </h2>
                  </div>
                  <div class="tt-action d-flex align-items-center" style={{ gap: '10px' }}>
                    <Link to={"/admin/orders"} class="global_tra_btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-shopping-cart me-2"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Manage Sales
                    </Link>

                    <Link to={"/admin/add-products"} class="btn btn-primary ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-plus me-2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <Link to='#'>
                    <div className="card h-100">
                      <div className="p-4 card-body">
                        <div className="main_box_admin d-flex align-items-center">
                          {/* <div className="badge rounded-pill bg-label-info  p-2">
                            <i className="ti ti-chart-pie-2 ti-sm" />
                          </div> */}
                          <div className="card-info">
                            <h6 className="mb-0">₹{countData?.salesSummary?.today_sale}</h6>
                            <small>Today Sale</small>
                          </div>
                          <div className="card-info">
                            <h6 className="mb-0">₹{countData?.salesSummary?.total_sale}</h6>
                            <small>Total Sale</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to='/admin/category'>
                    <div className="card h-100">
                      <div className="p-4 card-body">
                        <div className="main_box_admin d-flex align-items-center">
                          <div className="badge rounded-pill bg-label-info p-2">
                            <i className="ti ti-currency-dollar ti-sm" />
                          </div>
                          <div className="card-info">
                            <h5 className="mb-0">{countData?.categories}</h5>
                            <small>Categories</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to='/admin/customer'>
                    <div className="card h-100">
                      <div className="p-4 card-body">
                        <div className="main_box_admin d-flex align-items-center">
                          <div className="badge rounded-pill bg-label-info p-2">
                            <i className="ti ti-users ti-sm" />
                          </div>
                          <div className="card-info">
                            <h5 className="mb-0">{countData?.users}</h5>
                            <small>Customers</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to='/admin/products'>
                    <div className="card h-100">
                      <div className="p-4 card-body">
                        <div className="main_box_admin d-flex align-items-center">
                          <div className="badge rounded-pill bg-label-danger p-2">
                            <i className="ti ti-shopping-cart ti-sm" />
                          </div>
                          <div className="card-info">
                            <h5 className="mb-0">{countData?.products?.total}</h5>
                            <small>Products</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Today Orders */}
                <div className="col-md-12 mb-3">
                  <div className="p-4 card-body card">
                    <h6 class="border-bottom global_heading_sixe">Today Orders</h6>
                    <div className="table-responsive">
                      {
                        countData?.todayOrders?.length > 0 ?
                          <>
                            <table class="table global_table_cs  table-hover">
                              <thead>
                                <tr>
                                  <th scope="col">Order id</th>
                                  <th scope="col">Product</th>
                                  <th scope="col">Customer</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Status</th>
                                </tr>
                              </thead>
                              <tbody>

                                {
                                  countData?.todayOrders?.map((item, i) => (
                                    <tr>
                                      <th scope="row">{item?.id}</th>
                                      <td>{"---"}</td>
                                      <td>{item?.name}</td>
                                      <td>{item?.total_amount}</td>
                                      <td>
                                        <span className={`p-1  ${item?.order_status == "pending" ? "bg-warning-subtle text-warning" : item?.order_status == "sucess" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}  `}>
                                          {item?.order_status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                }

                              </tbody>
                            </table>
                          </>
                          :
                          <>
                            <h6>There are no order today.</h6>
                          </>
                      }

                    </div>
                  </div>
                </div>

                {/* Top Sold Product */}
                <div className="col-md-12 mb-3">
                  <div className="p-4 card-body card">
                    <h6 class="border-bottom global_heading_sixe">Top Sold Product</h6>
                    <div className="table-responsive">
                      <table class="table global_table_cs  table-hover">
                        <thead>
                          <tr>
                            <th scope="col">Product id</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Order Count</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            countData?.topOrderedProducts?.map((item, i) => (
                              <tr>
                                <th scope="row">{item?.id}</th>
                                {/* <td><Link to={`/admin/products/${item?.slug}`}>{item?.name}</Link></td> */}
                                <td>{item?.name}</td>
                                <td>
                                  <span className={`p-1  ${item?.order_status == "pending" ? "bg-warning-subtle text-warning" : item?.order_status == "sucess" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}  `}>
                                    {item?.order_count}
                                  </span>
                                </td>
                              </tr>
                            ))
                          }

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Top Customer */}
                <div className="col-md-12 mb-3">
                  <div className="p-4 card-body card">
                    <h6 class="border-bottom global_heading_sixe">Top Customer</h6>
                    <div className="table-responsive">
                      <table class="table global_table_cs  table-hover">
                        <thead>
                          <tr>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Order Count</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            countData?.topCustomer?.map((item, i) => (
                              <tr>
                                <td>{item?.name}</td>
                                <td>{item?.phone}</td>
                                <td>{item?.email}</td>
                                <td>
                                  <span className={`p-1  ${item?.order_status == "pending" ? "bg-warning-subtle text-warning" : item?.order_status == "sucess" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}  `}>
                                    {item?.order_count}
                                  </span>
                                </td>
                              </tr>
                            ))
                          }

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3">
              <div className="row right_box">
                <div className="col-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-info">
                        <h6 className="border-bottom">Order Status</h6>

                        <div className="dash-container d-flex align-items-center justify-content-between">
                          <div className="dash-box">
                            <h5 className="mb-0">{countData?.orders?.total}</h5>
                            <small>Total Orders</small>
                          </div>
                          <div className="dash-box">
                            <h5 className="mb-0">
                              {countData?.orders?.pending}
                            </h5>
                            <small className="text-warning">Pending</small>
                          </div>
                          <div className="dash-box">
                            <h5 className="mb-0">
                              {countData?.orders?.success}
                            </h5>
                            <small className="text-success">Complete</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-info">
                        <h6 className="border-bottom">Product Status</h6>

                        <div className="dash-container d-flex align-items-center justify-content-between">
                          <div className="dash-box">
                            <h5 className="mb-0">
                              {countData?.products?.total}
                            </h5>
                            <small>Total Products</small>
                          </div>
                          <div className="dash-box">
                            <h5 className="mb-0">
                              {countData?.products?.inStocks}
                            </h5>
                            <small className="text-success">InStocks</small>
                          </div>
                          <div className="dash-box">
                            <h5 className="mb-0">
                              {countData?.products?.outOfStocks}
                            </h5>
                            <small className="text-danger">Out of Stocks</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="col-md-12">
                    <div className="p-4 card-body card">
                      <h6 class="border-bottom global_heading_sixe">New Customer</h6>
                      <div className="table-responsive">
                        <table class="table global_table_cs  table-hover">
                          <thead>
                            <tr>
                              <th scope="col">Customer Details</th>
                              <th scope="col">Phone No.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              countData?.recentCustomer?.map((item, i) => (
                                <tr>
                                  <th scope="row"><div className="name_cs">{item.name || "---"}</div><span className="d-block">{item?.email || "---"}</span></th>
                                  <td>{item?.phone}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-backdrop fade" />
      </div>

      <Spinner sppiner={contextLoading} />
    </>
  );
};