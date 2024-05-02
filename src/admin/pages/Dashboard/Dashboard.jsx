import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authUser } from '../../../utility/Utility'
import { useDataContext } from '../../../context/ContextProvider'
import Spinner from '../../../components/admin/Spinner'
export const Dashboard = () => {
    const {countData, contextLoading, fetchData} = useDataContext()
    useEffect(() => {
        fetchData()
    },[])
    return (
        <>
            <div className="content-wrapper">
                {/* Content */}
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="row">
                        {/* View sales */}
                        <div className="col-xl-4 mb-4 col-lg-5 col-12">
                            <div className="card">
                                <div className="d-flex align-items-end row">
                                    <div className="col-7">
                                        <div className="card-body text-nowrap">
                                            <h5 className="card-title mb-0 text-uppercase">{authUser()?.name}🎉</h5>
                                            <p className="mb-2">Wellcome</p>
                                            <h4 className="text-primary mb-1">$48.9k</h4>
                                            <Link to={'/admin/my-profile'} className="btn btn-primary">My Profile</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* View sales */}
                        {/* Statistics */}
                        <div className="col-xl-8 mb-4 col-lg-7 col-12">
                            <div className="card h-100">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between mb-3">
                                        <h5 className="card-title mb-0">Statistics</h5>
                                        <small className="text-muted">Updated 1 month ago</small>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row gy-3">
                                        
                                        <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-info me-3 p-2"><i className="ti ti-chart-pie-2 ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">{countData?.brands}</h5>
                                                    <small>Brands</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-info me-3 p-2"><i className="ti ti-currency-dollar ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">{countData?.categories}</h5>
                                                    <small>Categories</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-info me-3 p-2"><i className="ti ti-users ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">{countData?.users}</h5>
                                                    <small>Customers</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-danger me-3 p-2"><i className="ti ti-shopping-cart ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">{countData?.products}</h5>
                                                    <small>Products</small>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-success me-3 p-2"><i className="ti ti-currency-dollar ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">$9745</h5>
                                                    <small>Revenue</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="d-flex align-items-center">
                                                <div className="badge rounded-pill bg-label-primary me-3 p-2"><i className="ti ti-chart-pie-2 ti-sm" /></div>
                                                <div className="card-info">
                                                    <h5 className="mb-0">230k</h5>
                                                    <small>Sales</small>
                                                </div>
                                            </div>
                                        </div> */}
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
    )
}
