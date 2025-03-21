import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { formatdedDate, getStatusColor, handleDownloadExcel, toastifySuccess } from '../../../utility/Utility';
import SpinnerBTN from '../../../components/SpinnerBTN';
import PDFButton from '../../../components/PDFButton';

const OrderList = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const savedPage = sessionStorage.getItem("orderPage");
        if (savedPage) {
            setCurrentPage(Number(savedPage));
        }
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        sessionStorage.setItem("orderPage", page);
    };
    const [selectedID, setSelectedID] = useState([])
    const [submitLoading, setSubmitLoading] = useState({
        'bulk': false,
        'upd_order': false
    })

    const columns = [
        {
            name: <span className='text-uppercase'>ORDER ID</span>,
            selector: row => <span className='text-uppercase fw-bold'> <Link to={`/admin/order-details/${row.id}`} className='text-dark'>#{row.id}</Link>  </span>,
        },
        {
            name: <span className='text-uppercase'>order date</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-uppercase'>payment</span>,
            selector: row => <><span className='text-center'>  {row.payment ? row.payment : "---"}</span></>,
        },
        {
            name: <span className='text-uppercase'>status</span>,
            selector: row => <>
                <span style={{ color: getStatusColor(row?.order_status)?.color, background: getStatusColor(row?.order_status)?.bg }}
                    className={`btn btn-sm text-uppercase`}>
                    {row?.order_status}
                </span>
            </>,
        },
        {
            name: <span className='text-uppercase'>shipped</span>,
            selector: row => <>
                {
                    row?.shipment_id ?
                        <span style={{ color: '#fff' }} className={`btn btn-sm text-uppercase bg-success`}> yes</span>
                        :
                        <span style={{ color: '#fff' }} className={`btn btn-sm text-uppercase bg-danger`}> no </span>
                }
            </>,
        },
        {
            name: <span className='text-uppercase'>Invoice</span>,
            selector: row => <><PDFButton order_id={row?.id} btnName={"Download"} /></>,
        },
        {
            name: <span className='text-uppercase'>Earned AksCoins</span>,
            selector: row => <><span className='text-center'>  {row.earned_loyalty_discount ? row.earned_loyalty_discount : "---"}</span></>,
        },
        {
            name: <span className='text-uppercase'>payment Method</span>,
            selector: row => row.payment_method,
        },
        {
            name: <span className='text-uppercase'>Actions</span>,
            cell: row => (
                <div className="dropdown">
                    <button className="dropdown-toggle btn btn-sm btn-icon hide-arrow shadow-none" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="true">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${row.id}`}>
                        <li className='m-0'><Link to={`/admin/order-details/${row.id}`} className='dropdown-item d-block p-3 w-100'> View Details </Link></li>
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
        const res = await APICALL('/v1/get-orders', 'post', { type: "admin" })
        if (res?.status) {
            setFilterData(res?.data)
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const [searchVal, setSearchVal] = useState({
        'drpDownVal': '',
        'searchText': '',
        'fromDate': '',
        'toDate': '',
    })

    const handleFilter = () => {
        if (searchVal.searchText !== "") {
            const updatedProducts = listData.filter(item =>
                item?.id?.toLowerCase().includes(searchVal.searchText.toLowerCase()) || item?.payment_method?.toLowerCase().includes(searchVal.searchText.toLowerCase()) || item?.order_status?.toLowerCase().includes(searchVal.searchText.toLowerCase())
            );
            setFilterData(updatedProducts)
        }

        if (searchVal.drpDownVal !== "") {
            let updatedProducts = [];
            if (searchVal.drpDownVal == "COD") {
                updatedProducts = listData.filter(item =>
                    item?.payment_method == searchVal.drpDownVal
                );
                setFilterData(updatedProducts)
            } else if (searchVal.drpDownVal.toLowerCase() === "prepaid") {
                updatedProducts = listData.filter(item =>
                    item?.payment_method?.toLowerCase() !== "cod"
                );
                setFilterData(updatedProducts)
            } else {
                updatedProducts = listData.filter(item =>
                    item?.payment_method?.toLowerCase().includes(searchVal.drpDownVal.toLowerCase()) || item?.order_status?.toLowerCase().includes(searchVal.drpDownVal.toLowerCase())
                );
                setFilterData(updatedProducts)
            }
        }

        if (searchVal?.fromDate && searchVal?.toDate) {
            const from = new Date(searchVal.fromDate);
            const to = new Date(searchVal.toDate);
            const res = listData.filter(item => {
                const itemDate = new Date(item.created_at);
                return itemDate >= from && itemDate <= to;
            });
            setFilterData(res)
        }
    }

    const filterReset = () => {
        setFilterData(listData)
        setSearchVal({ ...searchVal, 'searchText': '', 'fromDate': '', 'toDate': '', 'drpDownVal': '' })
        setCurrentPage(1);
        sessionStorage.setItem("orderPage", 1);
    }

    const handleDrpDown = (val) => {
        setSearchVal({ ...searchVal, 'drpDownVal': val })
    }

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
        ({
            // "Order ID": sponsor.id,
            "NAME": sponsor.customer?.name,
            "STATE": sponsor.address?.state,
            "PRODUCT NAME": sponsor.order_products?.map((item) => item?.product_name).join(", "),
            "HSN": "",
            "QTY": "",
            "GST RATE (% OF GST)": "",
            "TAXABLE VALUE": "",
            "IGST": "",
            "SGST": "",
            "CGST": "",
            "TOTAL VALUE": "",
            // "Order Status": sponsor.order_status,
            // "Payment Method": sponsor.payment_method,
            // "Total Amount": sponsor.total_amount,
            // "Total Products": sponsor.total_products,
            // "Total Shipping": sponsor.total_shipping,
            // "Discounts": sponsor.discounts,
            // "Create Date": formatdedDate(sponsor.created_at),
        })
        )
        return result
    }

    const downloadExcel = (type) => {
        handleDownloadExcel(changeArrFilterData(filterData), "Order List", "order-list")
    };

    const disabledCheckboxes = row => row?.shipment_id !== null || row?.order_status.toLowerCase() !== "pending";

    const handleRowSelected = (state) => {
        const selectedIDs = state?.selectedRows.map(row => row.id);
        setSelectedID(selectedIDs);
    };

    const shippingInBulk = async () => {
        // toastifySuccess("Work in progress !!")
        // return false
        setSubmitLoading(true)

        try {
            const res = await APICALL('/v1/bulk-shipment', 'post', { orderIDS: selectedID })
            console.log("bulk-shipment", res)
            if (res?.status) {
                setSubmitLoading(false)
                getListFun()
            } else {
                setSubmitLoading(false)
            }
        } catch (error) {
            console.log(error)
            setSubmitLoading(false)
        }

    }

    const customFun = async (type) => {
        if (type === "refresh") {
            getListFun()
        } else if (type === "update_order_status") {
            setSubmitLoading({ ...submitLoading, 'upd_order': true })
            const res = await APICALL('/set-order-status')
            getListFun()
            if (res?.status) {
                setSubmitLoading({ ...submitLoading, 'upd_order': false })
            } else {
                setSubmitLoading({ ...submitLoading, 'upd_order': false })
            }
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">

                    <div className="div d-flex justify-content-between align-items-center">
                        <h4 class="py-3 mb-2"><span class=" fw-light">Aksvedas /</span> Order List</h4>
                        <div>

                            {
                                submitLoading?.upd_order ?
                                    <button type='button' class="btn btn-primary buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn me-2">
                                        <SpinnerBTN />
                                    </button>
                                    :
                                    <>
                                        <button class="btn btn-primary buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn me-2" onClick={() => customFun("update_order_status")}><span>Update Order Status</span></button>
                                    </>
                            }

                            {/* <button class="btn btn-success buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn" onClick={() => customFun("refresh")}><span><i class="ti ti-reload me-1"></i>Refresh</span></button> */}
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="row g-2 align-items-end mb-3">
                                <div className="col-md-2">
                                    <label htmlFor="">Search</label>
                                    <input type="text" value={searchVal.searchText} onChange={(e) => setSearchVal({ ...searchVal, 'searchText': e.target.value })} class="form-control" placeholder="Search Order" />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="">From Date</label>
                                    <input type="date" class="form-control" value={searchVal.fromDate} placeholder="Search Order" onChange={(e) => setSearchVal({ ...searchVal, 'fromDate': e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="">To Date</label>
                                    <input type="date" class="form-control" value={searchVal.toDate} placeholder="Search Order" onChange={(e) => setSearchVal({ ...searchVal, 'toDate': e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <div className='d-flex justify-content-between order_fliter'>
                                        <div>
                                            <div class="btn-group me-2">
                                                <button type="button" class="btn btn-danger dropdown-toggle text-capitalize" data-bs-toggle="dropdown" aria-expanded="false">{searchVal?.drpDownVal == "" ? "Sort By" : searchVal?.drpDownVal}</button>
                                                <ul class="dropdown-menu text-capitalize">
                                                    <li className='bg-primary text-white h-100'><p className='pb-0 mb-0 fw-bold ps-2'>Order Status</p></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Pending')}>Pending</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('shipped')}>shipped</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('out for delivery')}>out for delivery</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Picked Up')}>Picked Up</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('out for pickup')}>out for pickup</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('delivered')}>delivered</Link></li>
                                                    {/* <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Undelivered')}>Undelivered</Link></li> */}
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('cancelled')}>cancelled</Link></li>
                                                    {/* <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Delayed')}>Delayed</Link></li> */}
                                                    {/* <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Pickup Error')}>Pickup Error</Link></li> */}

                                                    <li className='bg-primary text-white h-100'><p className='pb-0 mb-0 fw-bold ps-2'>Payment Method</p></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('COD')}>COD</Link></li>
                                                    <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('Prepaid')}>Prepaid</Link></li>
                                                </ul>
                                            </div>
                                            <button class="btn btn-primary" onClick={() => filterReset()}><span>Reset</span></button>
                                            <button class="btn btn-primary ms-2" onClick={() => handleFilter()}><span>Search</span></button>
                                        </div>
                                        <div className='gap-2'>
                                            <button class="btn btn-success buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn me-2" onClick={() => downloadExcel()}><span><i class="ti ti-download me-1"></i>Export</span></button>

                                            {
                                                selectedID?.length > 0 &&
                                                <>
                                                    {
                                                        submitLoading?.bulk ?
                                                            <button type='button' class="btn btn-danger buttons-collection waves-effect waves-light export_btn">
                                                                <SpinnerBTN />
                                                            </button>
                                                            :
                                                            <>
                                                                <button class="btn btn-danger buttons-collection waves-effect waves-light export_btn" onClick={() => shippingInBulk()}><span>Shipping in Bulk - ({selectedID?.length})</span></button>
                                                            </>
                                                    }
                                                </>
                                            }



                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-datatable table-responsive">
                            <DataTable
                                className='cs_table_inerr'
                                columns={columns}
                                data={filterData}
                                highlightOnHover
                                selectableRowsHighlight
                                pagination
                                selectableRows
                                onSelectedRowsChange={handleRowSelected}
                                selectableRowDisabled={disabledCheckboxes}
                                paginationDefaultPage={currentPage}
                                onChangePage={handlePageChange}
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

export default OrderList