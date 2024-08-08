import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { useNavigate } from 'react-router';
import { formatdedDate, handleDownloadExcel } from '../../../utility/Utility';

const CustomerReports = () => {
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
    const [page, setPage] = useState(1)

    useEffect(() => {
        getListFun()
    }, [])

    useEffect(() => {
        if (page === 1) {
            const res = listData.filter((item) => item.isPurchase === true)
            setFilterData(res)
        }
        if (page === 2) {
            const res = listData.filter((item) => item.isPurchase === false)
            setFilterData(res)
        }
    }, [page])

    const getListFun = async () => {
        setLoading(true)
        const res = await getDataAPI('/get-user')
        if (res?.status) {
            const filter = res?.data.filter((item) => item.isPurchase === true)
            setFilterData(filter)
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }


    const redirectPage = (page, data) => {
        if (page === 'view_details') {
            navigate(`/admin/customer-details/${data.id}`, { state: { productDetails: data } });
        }
    }

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
        ({
            "ID": sponsor.id,
            "Name": sponsor.name,
            "Email": sponsor.email,
            "phone": sponsor.phone,
            "Loyalty Points": sponsor.loyalty,
            "Create Date": formatdedDate(sponsor.created_at),
        })
        )
        return result
    }
    const downloadExcel = (type) => {
        handleDownloadExcel(changeArrFilterData(filterData), "Customer Reports", "customer-reports")
    };

    const handleTabChange = (tab) => {
        setPage(tab)
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 class="py-3 mb-2">
                        <span class=" fw-light">Aksvedas /</span> Reports
                    </h4>
                    <div className="card mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <ul class="nav nav-pills slide_cat">
                                <li class="nav-item"><button class={`nav-link ${page === 1 && 'active'}`} onClick={() => handleTabChange(1)}> Purchased Customer</button></li>
                                <li class="nav-item"><button class={`nav-link ${page === 2 && 'active'}`} onClick={() => handleTabChange(2)}>No Purchased Customer</button></li>
                            </ul>
                            <div className='d-flex justify-content-between order_fliter'>
                                <button class="btn btn-success buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn" onClick={() => downloadExcel()}><span><i class="ti ti-download me-1"></i>Export</span></button>
                            </div>
                        </div>
                    </div>
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
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default CustomerReports