import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { formatdedDate, getStatusColor, handleDownloadExcel, toastifySuccess } from '../../../utility/Utility';

const Transaction = () => {
    const [obj, setObj] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const columns = [
        {
            name: <span className='text-uppercase'>ID</span>,
            selector: row => <span className='text-uppercase fw-bold'>#{row.order_id} </span>,
        },
        {
            name: <span className='text-uppercase'>ORDER ID</span>,
            selector: row => <span className='text-uppercase fw-bold'>{row.main_order_id} </span>,
        },
        {
            name: <span className='text-uppercase'>tracking id</span>,
            selector: row => <span className='text-uppercase fw-bold'>#{row.tracking_id} </span>,
        },
        {
            name: <span className='text-uppercase'>billing name</span>,
            selector: row => <><span className='text-center'>  {row.billing_name}</span></>,
        },

        {
            name: <span className='text-uppercase'>amount</span>,
            selector: row => <><span className='text-center'>  {row.amount ? row.amount : "---"}</span></>,
        },
        {
            name: <span className='text-uppercase'>status</span>,
            selector: row => <>
                {
                    row?.order_status == "Success" ?
                        <span style={{ color: '#fff' }} className={`btn btn-sm text-uppercase bg-success`}> {row?.order_status}</span>
                        :
                        <span style={{ color: '#fff' }} className={`btn btn-sm text-uppercase bg-danger`}> {row?.order_status} </span>
                }
            </>,
        },
        {
            name: <span className='text-uppercase'>order date</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-uppercase'>Actions</span>,
            cell: row => (
                <div className="dropdown">
                    <button className="dropdown-toggle btn btn-sm btn-icon hide-arrow shadow-none" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="true">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${row.id}`}>
                        <li className='m-0'><Link to={`#`} onClick={() => setObj(row)} className='dropdown-item d-block p-3 w-100'> View Details </Link></li>
                    </ul>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const [listData, setListData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await APICALL('/get-transaction', 'post', { type: "all" })
        if (res?.status) {
            setFilterData(res?.data)
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }
    const responseData = obj && JSON.parse(obj?.response_data);

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="div d-flex justify-content-between align-items-center">
                        <h4 class="py-3 mb-2"><span class=" fw-light">Aksvedas /</span> {obj ? "Transaction Details" : "Transaction List"} </h4>
                        {obj && <button className='btn btn-sm btn-primary' onClick={() => setObj(null)}>Back</button>}
                    </div>
                    <div className="card">
                        {
                            obj ?

                                <div className="row p-3 transaction_details">
                                    <div className="col-12 col-md-12">
                                        <div className="d-flex justify-content-between">
                                            <p>Order id</p>
                                            <p className=" fw-bold">#{obj?.order_id}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>tracking id</p>
                                            <p className=" fw-bold">#{obj?.tracking_id}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Amount</p>
                                            <p className=" text-uppercase">
                                                ₹{obj?.amount}
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Billing Name</p>
                                            <p className=" text-uppercase">
                                                {obj?.billing_name}
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between ">
                                            <p>Date</p>
                                            <p className="">{formatdedDate(obj?.created_at)}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Order Status</p>
                                            <p className={`text-uppercase ${obj?.order_status == "Success" ? "text-success" : "text-danger"}`}>{obj?.order_status}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Amount</p>
                                            <p className=" text-uppercase">
                                                ₹{obj?.amount}
                                            </p>
                                        </div>
                                    </div>
                                    <hr
                                        className="mt-2 mb-4"
                                        style={{
                                            height: 0,
                                            backgroundColor: "transparent",
                                            opacity: ".75",
                                            borderTop: "2px dashed #9e9e9e",
                                        }}
                                    />
                                    <div className="col-12 col-md-12 transaction_res_box">
                                        <h5>Response Data</h5>
                                        <pre>{JSON.stringify(responseData, null, 2)}</pre>
                                    </div>
                                </div>
                                :
                                <div className="card-datatable table-responsive">
                                    <DataTable
                                        className='cs_table_inerr'
                                        columns={columns}
                                        data={filterData}
                                        highlightOnHover
                                        selectableRowsHighlight
                                        pagination
                                    />
                                </div>
                        }
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default Transaction