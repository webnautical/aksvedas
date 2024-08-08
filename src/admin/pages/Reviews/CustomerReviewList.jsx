import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';
import { Rating } from '@mui/material';
import ItemImg from '../../../components/admin/ItemImg';

const CustomerReviewList = () => {
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Images</span>,
            selector: row => <span className='text-capitalize fw-bold d-flex'><>
                {
                    row?.images?.split(',')?.map((img, i) => (
                        <ItemImg img={img} />
                    ))
                }
            </> </span>,
        },
        {
            name: <span className='text-capitalize'>Customer Name</span>,
            selector: row => <span className='text-capitalize'><>{row.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>star</span>,
            selector: row => <><Rating name="read-only" value={row.star} readOnly /></>,
        },
        {
            name: <span className='text-capitalize'>Review</span>,
            selector: row => <><span className='text-wrap'>{row.review}</span></>,
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
            name: <span className='text-capitalize'>Created At</span>,
            selector: row => timeAgo(row.created_at),
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
        const res = await APICALL('/v1/get-reviews/admin')
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
        const res = await APICALL('/v1/submit-review', 'post', param);
        if (res.status) {
            getListFun()
            toastifySuccess(`Review set as ${data?.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 class="py-3 mb-2">
                        <span class=" fw-light">Aksvedas /</span> Customer Reviews
                    </h4>
                    <div className="card">
                        <div className="card-datatable table-responsive">
                            <DataTable className='cs_table_inerr'
                                columns={columns}
                                data={filterData}
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

export default CustomerReviewList