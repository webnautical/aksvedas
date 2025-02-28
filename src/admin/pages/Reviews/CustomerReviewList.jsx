import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { textSlice, toastifyError, toastifySuccess } from '../../../utility/Utility';
import { Rating } from '@mui/material';
import ItemImg from '../../../components/admin/ItemImg';
const styleForP = {
    display: '-webkit-box',
    WebkitLineClamp: 1,
    limitWebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};
const CustomerReviewList = () => {
    const [isform, setIsForm] = useState(false)
    const [rowObj, setRowObj] = useState(null)
    const [reply, setReply] = useState('')

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
            selector: row => <><span className='text-wrap'>{textSlice(row.review, 60)} </span></>,
        },
        {
            name: <span className='text-capitalize'>Reply</span>,
            selector: row => <><span className='text-wrap'>{textSlice(row.reply, 60)}</span></>,
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
        {
            name: <span className='text-capitalize'>Actions</span>,
            cell: row => (
                <button type='button' onClick={() => handleClick('reply', row)} class="text-body border-0 p-0">Reply</button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const handleClick = (type, row) => {
        if (type === "reply") {
            setRowObj(row)
            setReply(row?.reply)
            setIsForm(true)
        } else if (type === "back") {
            setRowObj(null)
            setIsForm(false)
            setReply("")
        }
    }
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


    const handleReply = async () => {
        const params = { id: rowObj?.id, reply: reply }
        const res = await APICALL('/v1/reply', "post", params)
        if (res?.status) {
            getListFun()
            toastifySuccess(res?.message)
            handleClick("back")
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
                        <span class=" fw-light">Aksvedas /</span> Customer Reviews
                    </h4>
                    <div className="card">
                        {
                            isform ?
                                <>
                                    <div className="row g-3 p-3 pb-4">
                                        <div className="col-sm-12">
                                            <strong>Customer Review/Question</strong>
                                            <hr />
                                            <p><strong></strong>{rowObj?.review}</p>
                                        </div>
                                        <div className="col-sm-12">
                                            <label htmlFor="">Reply</label>
                                            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={10} className='form-control mt-2'></textarea>
                                        </div>
                                        <div className="col-12 text-end">
                                            <button type='button' onClick={() => handleClick('back')} className="btn btn-primary mx-2">Cancel</button>
                                            <button type='button' onClick={() => handleReply()} className="btn btn-primary">Reply</button>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="card-datatable table-responsive">
                                    <DataTable className='cs_table_inerr'
                                        columns={columns}
                                        data={filterData}
                                        highlightOnHover
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

export default CustomerReviewList