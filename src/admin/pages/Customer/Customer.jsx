import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { getDataAPI, postDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useNavigate } from 'react-router';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';

const Customer = () => {
    const navigate = useNavigate()
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Customer Name</span>,
            selector: row => <span className='text-capitalize'><>{row.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>email</span>,
            selector: row => <>{row.email || '---'}</>,
        },
        {
            name: <span className='text-capitalize'>phone</span>,
            selector: row => <>{row.phone || '---'}</>,
        },
        {
            name: <span className='text-capitalize'>Loyality</span>,
            selector: row => <>{row.loyalty}</>,
        },
        {
            name: <span className='text-capitalize'>status</span>,
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={parseInt(row.status)} onClick={() => changeStatus(row)} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: <span className='text-capitalize'>is verified</span>,
            selector: row => <> <div className="text-capitalize">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckChecked" checked={row.is_verified} readOnly />
                </div>
            </div></>,
        },
        {
            name: <span className='text-capitalize'>Created At</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-capitalize'>Actions</span>,
            cell: row => (
                <button type='button' onClick={() => redirectPage('view_details', row)} class="text-body border-0 p-0" data-bs-toggle="tooltip" aria-label="Preview" data-bs-original-title="Preview"><i class="ti ti-eye mx-2 ti-sm"></i></button>

            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const [listData, setListData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [loading, setLoading] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const savedPage = sessionStorage.getItem("customerPage");
        if (savedPage) {
            setCurrentPage(Number(savedPage));
        }
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        sessionStorage.setItem("customerPage", page);
    };

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await getDataAPI('/get-user')
        if (res?.status) {
            setFilterData(res?.data)
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }
    const changeStatus = async (data) => {
        setLoading(true)
        const param = {
            'id': data?.id,
            'status': data.status === 1 ? 0 : 1
        }
        const res = await postDataAPI('change-product-status', param)
        if (res.status) {
            getListFun()
            toastifySuccess(`Product set as ${data.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else if (res?.error?.slug?.length > 0) {
            toastifyError(res?.error?.slug[0])
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const redirectPage = (page, data) => {
        if (page === 'view_details') {
            navigate(`/admin/customer-details/${data.id}`, { state: { productDetails: data } });
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    {/* <PageHeaderCom pageTitle="Customers" /> */}
                    {/* <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                            <div>
                                                <h6 className="mb-2">In-store Sales</h6>
                                                <h4 className="mb-2">$5,345.43</h4>
                                                <p className="mb-0"><span className=" me-2">5k orders</span><span className="badge bg-label-success">+5.7%</span></p>
                                            </div>
                                            <span className="avatar me-sm-4">
                                                <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-smart-home text-body" /></span>
                                            </span>
                                        </div>
                                        <hr className="d-none d-sm-block d-lg-none me-4" />
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                                            <div>
                                                <h6 className="mb-2">Website Sales</h6>
                                                <h4 className="mb-2">$674,347.12</h4>
                                                <p className="mb-0"><span className=" me-2">21k orders</span><span className="badge bg-label-success">+12.4%</span></p>
                                            </div>
                                            <span className="avatar p-2 me-lg-4">
                                                <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-device-laptop text-body" /></span>
                                            </span>
                                        </div>
                                        <hr className="d-none d-sm-block d-lg-none" />
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                                            <div>
                                                <h6 className="mb-2">Discount</h6>
                                                <h4 className="mb-2">$14,235.12</h4>
                                                <p className="mb-0 ">6k orders</p>
                                            </div>
                                            <span className="avatar p-2 me-sm-4">
                                                <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-gift text-body" /></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 className="mb-2">Affiliate</h6>
                                                <h4 className="mb-2">$8,345.23</h4>
                                                <p className="mb-0"><span className=" me-2">150 orders</span><span className="badge bg-label-danger">-3.5%</span></p>
                                            </div>
                                            <span className="avatar p-2">
                                                <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-wallet text-body" /></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}


                    <h4 class="py-3 mb-2">
                        <span class=" fw-light">Aksvedas /</span> All User
                    </h4>
                    <div className="card">

                        <div className="card-datatable table-responsive">
                            <DataTable className='cs_table_inerr'
                                columns={columns}
                                data={filterData}
                                highlightOnHover
                                pagination
                                paginationDefaultPage={currentPage}
                                onChangePage={handlePageChange}
                            />

                        </div>
                    </div>
                </div>
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default Customer