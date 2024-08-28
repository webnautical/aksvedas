import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL, getDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { Link } from 'react-router-dom';
import ReasonDetails from './ReasonDetails';

const ReasonList = () => {
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-uppercase'>orderid/customer</span>,
            selector: row => <span className='text-capitalize'><> {row?.order_id == null ? <Link to={`/admin/customer-details/${row.customer?.id}`}>{row?.customer?.name}</Link> :  <Link to={`/admin/order-details/${row.order_id}`}>#{row.order_id}</Link>}</> </span>,
        },
        {
            name: <span className='text-uppercase'>reason</span>,
            selector: row => <>{row.reason || '---'}</>,
        },
        {
            name: <span className='text-uppercase'>Message</span>,
            selector: row => <>{row.text || '---'}</>,
            style: {
                width: '100px',
            },
        },
        {
            name: <span className='text-uppercase'>Status</span>,
            selector: row => <> <span className={`text-capitalize ${row?.status == "processing" ? "text-warning" : "text-success"}`}>{row?.status}</span></>,
        },
        {
            name: <span className='text-capitalize'>Date</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-capitalize'>Resolved Date</span>,
            selector: row => timeAgo(row.updated_at),
        },
        {
            name: <span className='text-uppercase'>Action</span>,
            selector: row => <> <button className='btn btn-sm btn-primary' onClick={() => setDetails(row)}><i class="fa fa-eye" aria-hidden="true"></i></button></>,
        },

    ];
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState(null)

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await APICALL('/v1/reason', 'post', { type: 'get' })
        if (res?.status) {
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    return (
        <>
            {
                details ? <ReasonDetails reasonDetails={details}  setDetails={setDetails} getListFun={getListFun}/>
                    :
                    <div className="content-wrapper">
                        <div className="flex-grow-1 container-p-y">
                            <h4 class="py-3 mb-2">
                                <span class="fw-light">Aksvedas /</span> Help Queries
                            </h4>
                            <div className="card">
                                <div className="card-datatable table-responsive">
                                    <DataTable className='cs_table_inerr'
                                        columns={columns}
                                        data={listData}
                                        // dense
                                        highlightOnHover
                                        pagination
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="content-backdrop fade" />
                    </div>
            }
            <Spinner sppiner={loading} />
        </>
    )
}

export default ReasonList