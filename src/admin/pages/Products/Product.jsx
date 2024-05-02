import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { getDataAPI, postDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import ItemImg from '../../../components/admin/ItemImg';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../../utility/Utility';
import DeleteModal, { closeModal } from '../../../components/admin/DeleteModal';

const Product = () => {
    const navigate = useNavigate()
    const [selectedID, setSelectedID] = useState([])

    const columns = [
        {
            name: 'Cover',
            selector: row => <> <ItemImg img={row.cover} /></>,
        },
        {
            name: <span className='text-uppercase'>product</span>,
            selector: row => <span className='text-uppercase'>{row.name} </span>,
        },
        {
            name: <span className='text-uppercase'>sku</span>,
            selector: row => row.sku,
        },
        {
            name: <span className='text-uppercase'>qnt</span>,
            selector: row => row.quantity,
        },
        {
            name: <span className='text-uppercase'>price</span>,
            selector: row => row.price,
        },
        {
            name: <span className='text-uppercase'>status</span>,
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={row.status} onClick={() => changeStatus(row)}/>
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: <span className='text-uppercase'>Product Type</span>,
            selector: row => <> <div className="text-uppercase">
                {row.product_type === 1 ? <><p className='text-success'>Simple</p></> : <><p className='text-warning'>Variant</p></>}
            </div></>,
        },
        {
            name: <span className='text-uppercase'>Created At</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-uppercase'>Actions</span>,
            cell: row => (
                <div className="dropdown">
                    <button className="dropdown-toggle icon_btn __danger" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="true">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${row.id}`}>
                        <li><button className="dropdown-item" type='button' onClick={() => redirectPage('view_details', row)}>View Details</button></li>
                        <li><button className="dropdown-item" type='button' onClick={() => redirectPage('update', row)}>Edit</button></li>
                        <li><Link to={'#'} className='dropdown-item' data-bs-target="#deleteModal" data-bs-toggle="modal" onClick={() => { setSelectedID([row.id])  }}> Delete </Link></li>
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
        const res = await getDataAPI('/get-product')
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
            navigate(`/admin/products/${data.slug}`, { state: { productDetails: data } });
        }else if('update'){
            navigate(`/admin/add-products`, { state: { productDetails: data } });
        }
    }
    
    const handleDelete = async () => {
        setLoading(true)
        const param = {
            ids: selectedID
        }
        const res = await postDataAPI(`delete-product`, param)
        if (res.status) {
            setLoading(false)
            getListFun()
            toastifySuccess('Products deleted succesfully')
            closeModal('deleteModal');
            setSelectedID([])
        } else {
            toastifySuccess('Products can not be deleted')
            setLoading(false)
        }
    }

    return (
        <>
            <div className="content-wrapper">
                {/* Content */}
                <div className="container-xxl flex-grow-1 container-p-y">
                    <PageHeaderCom pageTitle="Product" link='/admin/add-products' linkBtnName={'add product'} />
                    {/* Product List Widget */}
                    <div className="card mb-4">
                        <div className="card-widget-separator-wrapper">
                            <div className="card-body card-widget-separator">
                                <div className="row gy-4 gy-sm-1">
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                            <div>
                                                <h6 className="mb-2">In-store Sales</h6>
                                                <h4 className="mb-2">$5,345.43</h4>
                                                <p className="mb-0"><span className="text-muted me-2">5k orders</span><span className="badge bg-label-success">+5.7%</span></p>
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
                                                <p className="mb-0"><span className="text-muted me-2">21k orders</span><span className="badge bg-label-success">+12.4%</span></p>
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
                                                <p className="mb-0 text-muted">6k orders</p>
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
                                                <p className="mb-0"><span className="text-muted me-2">150 orders</span><span className="badge bg-label-danger">-3.5%</span></p>
                                            </div>
                                            <span className="avatar p-2">
                                                <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-wallet text-body" /></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Product List Table */}
                    <div className="card">
                        <div className="card-datatable table-responsive">
                            <DataTable
                                columns={columns}
                                data={filterData}
                                // dense
                                highlightOnHover
                                selectableRowsHighlight
                                pagination
                                // selectableRows
                            />

                        </div>
                    </div>
                </div>
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>

            <DeleteModal id={'deleteModal'} handleFunc={handleDelete} loading={loading} />
            <Spinner sppiner={loading} />
        </>
    )
}

export default Product