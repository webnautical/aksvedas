import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';

const QueryList = () => {
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>FullName</span>,
            selector: row => <span className='text-capitalize'><>{row.f_name + " " + row.l_name || '---'}</> </span>,
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
            name: <span className='text-capitalize'>Message</span>,
            selector: row => <><span className='text-wrap'>{row.message}</span></>,
        },
        {
            name: <span className='text-capitalize'>Query At</span>,
            selector: row => timeAgo(row.created_at),
        },
    ];
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await getDataAPI('/get-query')
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
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 class="py-3 mb-2">
                        <span class="fw-light">Aksvedas /</span> All User
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
            <Spinner sppiner={loading} />
        </>
    )
}

export default QueryList