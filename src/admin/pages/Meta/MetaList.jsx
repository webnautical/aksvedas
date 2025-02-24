import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { SERVER_ERR, SOMETHING_ERR } from '../../../utility/Constants';

const MetaList = () => {
    const { page } = useParams()
    const pageTitle = page.replace(/-/g, ' ');

    const navigate = useNavigate()
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>meta title</span>,
            selector: row => <span className='text-capitalize'><>{row.meta_title || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>meta desc</span>,
            selector: row => <><span className='text-wrap'>{row.meta_desc}</span></>,
        },

        {
            name: <span className='text-capitalize'>Created At</span>,
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
                        <li className='m-0'><Link to={`/admin/meta-list/add`} onClick={() => setEditObj(row)} className='dropdown-item d-block p-3 w-100'>Edit </Link></li>
                    </ul>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const [editObj, setEditObj] = useState(null)
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await APICALL('/metas')
        if (res?.status) {
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const [value, setValue] = useState({
        'meta_title': '',
        'url': '',
        'meta_desc': '',
        'meta_keyword': '',
    })


    useEffect(() => {
        if (editObj?.id) {
            setValue({
                ...value, 'id': editObj?.id, 'meta_title': editObj?.meta_title, meta_desc: editObj?.meta_desc, url: editObj?.url,meta_keyword: editObj?.meta_keyword
            })
        }
    }, [editObj])

    const handleChange = (e) => {
        // if (e.target.name === "meta_title") {
        //     setValue({
        //         ...value,
        //         meta_title: e.target.value,
        //         url: generateSlug(e.target.value),
        //     });
        // } else {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
        // }
    }

    const handlePageForm = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("meta_title", value.meta_title);
            if (value?.id) {
                formData.append("id", value.id);
            }
            formData.append("url", value.url);
            formData.append("meta_desc", value.meta_desc);
            formData.append("meta_keyword", value.meta_keyword);
            const res = await APICALL(`/metas`, 'post', value);
            if (res?.status) {
                toastifySuccess('Meta Tags Added Successfully')
                handleCanel()
                getListFun()
                setLoading(false)
            } else {
                setLoading(false)
                toastifyError(SOMETHING_ERR)
            }
        } catch (error) {
            console.log("Catch Call", error)
            setLoading(false)
            toastifyError(SERVER_ERR)
        }
    }

    const handleCanel = () => {
        navigate('/admin/meta-list/all')
        setValue({
            ...value, 'id': '', 'meta_title': '', meta_desc: '', url: '', meta_keyword : ""
        })
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <h4 class="py-3 mb-2">
                            <span class=" fw-light">Aksvedas /</span> Meta / <span className='text-capitalize'>{pageTitle}</span>
                        </h4>
                        {
                            page === 'all' &&
                            <div className="d-flex align-content-center flex-wrap gap-2">
                                <Link to={`/admin/meta-list/add`} className="btn btn-primary">Add Meta</Link>
                            </div>
                        }
                    </div>

                    <div className="card">
                        {
                            page === 'add' ?
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0 text-capitalize">{page}</h5>
                                    </div>

                                    <div className="row g-3 px-3 pb-4">
                                        {
                                            !value?.id &&
                                            <div className="col-sm-12">
                                                <label htmlFor="">Slug ( <small className="form-text text-muted">
                                                    Enter the slug for the page. For example, for <strong>https://aksvedas.com/about</strong>, enter <strong>about</strong>.
                                                </small>)</label>
                                                <input type="text" name='url' value={value.url} onChange={handleChange} className='form-control' placeholder='Slug' />

                                               
                                            </div>
                                        }

                                        <div className="col-sm-12">
                                            <label htmlFor="">Meta Title</label>
                                            <input type="text" name='meta_title' value={value.meta_title} onChange={handleChange} className='form-control' placeholder='Meta Title' />
                                        </div>
                                        <div className="col-sm-12">
                                            <label htmlFor="">Meta Description</label>
                                            <textarea name="meta_desc" className='form-control' cols="30" rows="4" onChange={handleChange} value={value.meta_desc}>
                                            </textarea>
                                        </div>

                                        <div className="col-sm-12">
                                            <label htmlFor="">Meta Keyword</label>
                                            <textarea name="meta_keyword" className='form-control' cols="30" rows="4" onChange={handleChange} value={value.meta_keyword}>
                                            </textarea>
                                        </div>

                                        <div className="col-12 text-end">
                                            <button type='button' onClick={() => handleCanel()} className="btn btn-primary mx-2">Cancel</button>
                                            <button type='button' onClick={() => handlePageForm()} className="btn btn-primary">Save</button>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="card-datatable table-responsive">
                                        <DataTable className='cs_table_inerr'
                                            columns={columns}
                                            data={listData}
                                            // dense
                                            highlightOnHover
                                            pagination
                                        />
                                    </div>
                                </>
                        }

                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default MetaList