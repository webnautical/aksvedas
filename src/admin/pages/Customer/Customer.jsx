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
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]} // Add "All"
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Rows per page:',
                                    rangeSeparatorText: 'of',
                                    selectAllRowsItem: true,
                                    selectAllRowsItemText: 'All',
                                }}
                            />

                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default Customer