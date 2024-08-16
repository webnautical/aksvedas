import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getDataAPI } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { handleDownloadExcel } from '../../../utility/Utility';

const OrderProducts = () => {
    const columns = [
        {
            name: <span className='text-capitalize'>#ORDER ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.order_id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Customer Name</span>,
            selector: row => <span className='text-capitalize'><>{row.order?.customer?.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>State</span>,
            selector: row => <>{row.order?.address?.state || '---'}</>,
        },
        {
            name: <span className='text-capitalize'>Product Name</span>,
            selector: row => <>{row.product_name || '---'}</>,
        },
        {
            name: <span className='text-capitalize'>HSN</span>,
            selector: row => <>{row?.product?.hsn || "---"}</>,
        },
        {
            name: <span className='text-capitalize'>QNT</span>,
            selector: row => <>{row.qnt}</>,
        },
        {
            name: <span className='text-capitalize'>GST RATE (% OF GST)</span>,
            selector: row => <>{row.product?.gst_rate || "---"}</>,
        },
        {
            name: <span className='text-capitalize'>TAXABLE VALUE</span>,
            selector: row => <>{taxablePrice(parseInt(row?.product_price) * parseInt(row.qnt), row.product?.gst_rate)}</>,
        },
        {
            name: <span className='text-capitalize'>IGST</span>,
            selector: row => <>{row.order?.address?.state?.toLowerCase() === 'rajasthan' ? 0 : igst(parseInt(row?.product_price) * parseInt(row.qnt), taxablePrice(parseInt(row?.product_price) * parseInt(row.qnt), row.product?.gst_rate))}</>,
        },
        {
            name: <span className='text-capitalize'>SGST</span>,
            selector: row => <>{row.order?.address?.state?.toLowerCase() === 'rajasthan' ? sgst(parseInt(row?.product_price) * parseInt(row.qnt), row.product?.gst_rate) : 0}</>,
        },
        {
            name: <span className='text-capitalize'>CGST</span>,
            selector: row => <>{row.order?.address?.state?.toLowerCase() === 'rajasthan' ? sgst(parseInt(row?.product_price) * parseInt(row.qnt), row.product?.gst_rate) : 0}</>,
        },
        {
            name: <span className='text-capitalize'>TOTAL VALUE</span>,
            selector: row => <>{row?.product_price}</>,
        },
    ];
    const [listData, setListData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const yearsArr = [
        { value: '2024', },
        { value: '2025',},
        { value: '2026',},
        { value: '2027', },
        { value: '2028',},
        { value: '2029', },
        { value: '2030', },
    ];
    const months = [
        { value: '', label: 'Month' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const years = Array.from(new Array(10), (val, index) => new Date().getFullYear() - index);

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await getDataAPI('/order-product-reports')
        if (res?.status) {
            setListData(res?.data)
            setFilterData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const filterDataByMonthYear = () => {
        return listData.filter(item => {
            const orderDate = new Date(item.order?.created_at);
            const monthMatch = selectedMonth ? orderDate.getMonth() + 1 === parseInt(selectedMonth, 10) : true;
            const yearMatch = selectedYear ? orderDate.getFullYear() === parseInt(selectedYear, 10) : true;
            return monthMatch && yearMatch;
        });
    };
    useEffect(() => {
        setFilterData(filterDataByMonthYear());
    }, [selectedMonth, selectedYear, listData]);

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
        ({
            "Order ID": sponsor.order_id,
            "Customer Name": sponsor.order?.customer?.name,
            "Product Name": sponsor.product_name,
            "State": sponsor.order?.address?.state,
            "HSN": sponsor.product?.hsn,
            "QNT": sponsor.qnt,
            "GST RATE (% OF GST)": sponsor.product?.gst_rate,
            "TAXABLE VALUE": taxablePrice(parseInt(sponsor?.product_price) * parseInt(sponsor?.qnt), sponsor.product?.gst_rate),
            "IGST": sponsor.order?.address?.state?.toLowerCase() === 'rajasthan' ? 0 : igst(parseInt(sponsor?.product_price) * parseInt(sponsor?.qnt), taxablePrice(parseInt(sponsor?.product_price) * parseInt(sponsor?.qnt), sponsor.product?.gst_rate)),
            "SGST": sponsor.order?.address?.state?.toLowerCase() === 'rajasthan' ? sgst(parseInt(sponsor?.product_price) * parseInt(sponsor?.qnt), sponsor.product?.gst_rate) : 0,
            "CGST": sponsor.order?.address?.state?.toLowerCase() === 'rajasthan' ? sgst(parseInt(sponsor?.product_price) * parseInt(sponsor?.qnt), sponsor.product?.gst_rate) : 0,
            "TOTAL VALUE": sponsor.product_price,
        })
        )
        return result
    }
    const downloadExcel = (type) => {
        handleDownloadExcel(changeArrFilterData(filterData), "Order Products Report", "order-products-report")
    };

    const taxablePrice = (product_price, gst_rate) => {
        const gstAmount = product_price * (gst_rate / 100);
        return product_price - gstAmount.toFixed(2);
    };

    const sgst = (product_price, gst_rate) => {
        const val = (product_price * (gst_rate / 100)) / 2
        return val.toFixed(2);
    };

    const igst = (product_price, taxablePrice) => {
        const val = (product_price - taxablePrice)
        return val.toFixed(2);
    };

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 class="py-3 mb-2">
                        <span class=" fw-light">Aksvedas /</span> Order Products Report
                    </h4>
                    <div className="card mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <ul class="nav nav-pills slide_cat">
                                <li>
                                    <select className="form-select" value={selectedYear}  onChange={handleYearChange} >
                                        <option>Year</option>
                                        {yearsArr.map(month => (
                                            <option key={month.value} value={month.value}>
                                                {month.value}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                                <li className='ms-2'>
                                    <select  className="form-select" value={selectedMonth} onChange={handleMonthChange}>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                </li>
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
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default OrderProducts