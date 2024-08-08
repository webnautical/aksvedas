import React, { useEffect, useState } from 'react'
import { APICALL, getDataAPI, postDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { toastifyError, toastifySuccess } from '../../../utility/Utility'
import { timeAgo } from '../../../utility/Date'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { useFrontDataContext } from '../../../context/FrontContextProvider'

export const OfferList = () => {
    const [loading, setLoading] = useState()
    const { categories } = useFrontDataContext()
    const [dashboardOffer, setDashboardOffer] = useState(null)
    const [page, setPage] = useState('')
    const [couponList, setCouponList] = useState([])
    const [updData, setUpdData] = useState(null)
    useEffect(() => {
        getOffersList()
        getCouponsFun()
    }, [])

    const [value, setValue] = useState({
        'dashboardOfferVal': '',
        'coupon_code': '',
        'customer_use_limit': '',
        'expire_in': '',
        'use_limit': '',
        'allow': 'all',
        'coupon_type': '',
        'offer': '',
    })

    const getOffersList = async () => {
        try {
            setLoading(true)
            const res = await getDataAPI('get-offers')
            if (res?.status) {
                setDashboardOffer(res?.data[0])
                setValue({
                    ...value, dashboardOfferVal: res?.data[0]?.offer
                })
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getCouponsFun = async () => {
        try {
            setLoading(true)
            const res = await getDataAPI('get-coupons')
            if (res?.status) {
                setCouponList(res?.data)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        setValue({
            ...value, [e.target.name]: e.target.value
        })
    }

    const updateDashboardOffer = async () => {
        setLoading(true)
        const param = {
            'type': dashboardOffer?.type,
            'offer': value?.dashboardOfferVal,
        }
        const res = await postDataAPI('update-dashboard-offer', param)
        if (res.status) {
            toastifySuccess(`Offer chnaged successfully`)
            setLoading(false)
            setPage(null)
            setValue({ ...value, dashboardOfferVal: res?.data?.offer })
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const columns = [
        {
            name: <span className='text-uppercase'>ID</span>,
            selector: row => <span className='text-uppercase fw-bold'>#{row.id} </span>,
        },
        {
            name: <span className='text-uppercase'>coupon </span>,
            selector: row => <span className='text-uppercase fw-bold'>{row.coupon_code} </span>,
        },
        {
            name: <span className='text-uppercase'>coupon type </span>,
            selector: row => <span className='text-uppercase fw-bold'>{row.coupon_type} </span>,
        },
        {
            name: <span className='text-uppercase'>offer </span>,
            selector: row => <span className='text-uppercase fw-bold'>{row.coupon_type === 'fixed' && "₹"}{row.offer}{row.coupon_type !== 'fixed' && "%"}</span>,
        },
        {
            name: <span className='text-uppercase'>Allow </span>,
            selector: row => <span className='text-uppercase fw-bold'>{ getCategoryName(row.allow)}</span>,
        },
        {
            name: <span className='text-uppercase'>Coupon (Uses/Total) </span>,
            selector: row => <span className='text-uppercase fw-bold'>{parseInt(row.total) - parseInt(row.use_limit)}/{row.total} </span>,
        },
        {
            name: <span className='text-uppercase'>Per Customer Use </span>,
            selector: row => <span className='text-uppercase fw-bold'>{row.customer_use_limit}</span>,
        },
        {
            name: <span className='text-uppercase'>Expire In</span>,
            selector: row => row.expire_in,
        },
        {
            name: <span className='text-uppercase'>Created at</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-uppercase'>Actions</span>,
            cell: row => (
                <>
                    <label className="switch switch-primary switch-sm me-4 pe-2">
                        <input
                            type="checkbox"
                            className="switch-input"
                            defaultChecked={row.status}
                            onClick={() => handleAction('status', row)}
                        />
                        <span className="switch-toggle-slider">
                            <span className="switch-on">
                                <span className="switch-off" />
                            </span>
                        </span>
                    </label>
                    <button className='icon_btn __danger mx-2 text-uppercase' onClick={() => handleAction('delete', row)} type="button"><i className='fa fa-trash' /></button>
                    <button className='icon_btn __warning text-uppercase' type="button" onClick={() => { setUpdData(row); setPage('coupon') }}><i className='fa fa-pencil' /></button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    useEffect(() => {
        handleCoupon()
        if (updData?.id) {
            setValue({
                ...value,
                id: updData.id,
                coupon_code: updData.coupon_code,
                expire_in: updData.expire_in,
                use_limit: updData.use_limit,
                allow: updData.allow,
                coupon_type: updData.coupon_type,
                customer_use_limit: updData.customer_use_limit,
                offer: updData.offer,
            });
        } else {
            setValue({
                ...value,
                dashboardOfferVal: "",
                coupon_code: "",
                coupon_type: "percentage",
                allow: "all",
                desc: "",
                use_limit: "",
                offer: "",
            });
        }
    }, [updData]);



    const createCoupon = async () => {
        
        const isUpdating = value.id !== undefined;
        const skuExists = couponList.some(item => {
            if (isUpdating) {
                return item.coupon_code == value.coupon_code && item.id !== value.id;
            } else {
                return item.coupon_code == value.coupon_code;
            }
        });

        if (skuExists) {
            toastifyError("Coupon already exists!");
            return false;
        }
        setLoading(true)
        const res = await postDataAPI('create-coupon', value)
        if (res.status) {
            toastifySuccess(`Coupon ${value?.id ? "Updated" : "Created"} Successfully`)
            setLoading(false)
            getCouponsFun()
            handleCancel()
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleAction = async (type, data) => {
        setLoading(true)
        if (type == 'delete') {
            var param = { id: data?.id, type: 'delete' };
        } else {
            var param = { id: data?.id, status: data.status === 1 ? 0 : 1 };
        }
        const res = await postDataAPI('create-coupon', param)
        if (res.status) {
            toastifySuccess(res.msg)
            setLoading(false)
            getCouponsFun()
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setPage('')
        setValue({ ...value, 'coupon_code': '', 'expire_in': '', 'use_limit': '', 'id': '' })
    }

    const generateCoupon = () => {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const currentMonth = new Date().getMonth();
        const month = monthNames[currentMonth];
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        const generatedCode = `${month}${randomFourDigitNumber}`;
        setValue({ ...value, 'coupon_code': generatedCode })
    }

    const [shippingVal, setShippingVal] = useState({
        'shipping_charge': '',
        'total_amnt': '',
        'loyalty_discounts': '',
    })

    const handleCoupon = async (type) => {
        try {
            const res = await APICALL('/shipping-charge', 'POST', shippingVal)
            if (res?.status) {
                if (type == 'submit') {
                    toastifySuccess('Success')
                }
                setShippingVal({ ...shippingVal, 'shipping_charge': res?.data?.shipping_charge, 'total_amnt': res?.data?.total_amnt,'loyalty_discounts': res?.data?.loyalty_discounts })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const shippingCancel = async (type) => {
        try {
            const res = await APICALL('/shipping-charge', 'POST', {})
            if (res?.status) {
                setShippingVal({ ...shippingVal, 'shipping_charge': res?.data?.shipping_charge, 'total_amnt': res?.data?.total_amnt })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCategoryName = (id) =>{
        if(id === 'all'){
            return id
        }else{
            const res = categories.filter((item) => item.id == id)
            return res[0]?.name
        }
    }


    return (
        <div className="content-wrapper">
            <div className="flex-grow-1 container-p-y">
                <h4 class="py-3 mb-2">
                    <span class="fw-light">Aksvedas /</span>Set Offer
                </h4>

                {/* Offer title for dashboard */}
                <div className="card mb-4">
                    <div className="card-widget-separator-wrapper">
                        <div className="card-body card-widget-separator">
                            <div className="row gy-4 gy-sm-1 p-2">
                                <div className="col-sm-6 col-lg-6">
                                    <h5><i class="fa-solid fa-trophy"></i> Offer</h5>
                                    <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">
                                        {
                                            page == 'updateDashboard' ?
                                                <div className='upd-box'>
                                                    <textarea
                                                        type="text"
                                                        name='dashboardOfferVal'
                                                        className='form-control w-100'
                                                        value={value.dashboardOfferVal}
                                                        onChange={handleChange}
                                                    />


                                                    <div className="btn-box mt-2 text-end">
                                                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={() => { setPage(null); setValue({ ...value, dashboardOfferVal: dashboardOffer?.offer }) }}>Cancel</button>
                                                        <button type="button" className="btn btn-primary" onClick={updateDashboardOffer}>Update</button>
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <h5>
                                                        {value.dashboardOfferVal}
                                                        <button className='icon_btn __warning mx-2' type="button" onClick={() => setPage('updateDashboard')}><i className='fa fa-pencil' /></button>
                                                    </h5>
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Charge */}
                <div className="card mb-4">
                    <div className="card-widget-separator-wrapper">
                        <div className="card-body card-widget-separator">
                            <div className="row gy-4 gy-sm-1 p-2">
                                <div className="col-sm-6 col-lg-6">
                                    <h5><i class="fa-solid fa-truck"></i> Shiping Charge</h5>
                                    <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">

                                        <div className="row g-2 align-items-bottom">
                                            <div className="col-12">
                                                <span className='text-danger'><strong>Note:</strong> A shipping charge of ₹{shippingVal?.shipping_charge} applies for orders with an amount less than ₹{shippingVal?.total_amnt}.</span>
                                            </div>
                                            <div className="col-3">
                                                <input type="number" maxLength={3} value={shippingVal?.shipping_charge} onChange={(e) => setShippingVal({ ...shippingVal, 'shipping_charge': e.target.value })} className='form-control' />
                                            </div>
                                            <div className="col-3">
                                                <input type="number" maxLength={4} value={shippingVal?.total_amnt} onChange={(e) => setShippingVal({ ...shippingVal, 'total_amnt': e.target.value })} className='form-control' />
                                            </div>
                                            <div className="col-4">
                                                <div className="btn-box">
                                                    <button type="button" className="btn btn-primary me-sm-2 me-1" onClick={() => shippingCancel()}>Cancel</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => handleCoupon('submit')}>Save Change</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-6">
                                    <h5><i class="fa-solid fa-trophy"></i> AksCoins</h5>
                                    <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">

                                        <div className="row g-2 align-items-bottom">
                                            <div className="col-12">
                                                <span className='text-danger'><strong>Note:</strong>Whenever a customer places an order, they will receive a {shippingVal?.loyalty_discounts}% AksCoins.</span>
                                            </div>
                                            <div className="col-3">
                                                <input type="number" maxLength={3} value={shippingVal?.loyalty_discounts} onChange={(e) => setShippingVal({ ...shippingVal, 'loyalty_discounts': e.target.value })} className='form-control' />
                                            </div>
                                            <div className="col-4">
                                                <div className="btn-box">
                                                    <button type="button" className="btn btn-primary" onClick={() => handleCoupon('submit')}>Save Change</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon */}
                <div className="card mb-4">
                    <div className="card-widget-separator-wrapper">
                        <div className="card-body card-widget-separator">
                            <div className="row gy-4 gy-sm-1 p-2">
                                <div className="col-sm-12 col-lg-12 d-flex justify-content-between align-items-center">
                                    <h5><i class="fa-solid fa-ticket"></i> Coupon  </h5>
                                    <button className='btn btn-primary' type="button" onClick={() => setPage('coupon')}><i className='fa fa-plus' /> Add Coupon</button>
                                </div>
                                {
                                    page === 'coupon' &&
                                    <div className="col-sm-12 col-lg-12">
                                        <div className="row g-2">
                                            <div className="col-sm-2">
                                                <input type="text" name='coupon_code' value={value.coupon_code} onChange={handleChange} placeholder='Coupon Code' className='form-control' />
                                                <button onClick={() => generateCoupon()} className='icon_btn __warning my-2'>Generate Coupon</button>
                                            </div>
                                            <div className="col-sm-2">
                                                <select name='coupon_type' value={value.coupon_type} onChange={handleChange} className='form-control'>
                                                    <option value="">Select Type</option>
                                                    <option value="percentage">Percentage</option>
                                                    <option value="fixed">Fixed</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-2">
                                                <input type="text" name='offer' value={value.offer} onChange={handleChange} placeholder='Offer' className='form-control' />
                                            </div>
                                            <div className="col-sm-2">
                                                <input type="date" name='expire_in' value={value.expire_in} onChange={handleChange} placeholder='Expire In' className='form-control' />
                                            </div>
                                            <div className="col-sm-2">
                                                <input type="number" name='use_limit' value={value.use_limit} onChange={handleChange} placeholder='Use Limit' className='form-control' />
                                            </div>
                                            <div className="col-sm-2">
                                                <input type="number" name='customer_use_limit' value={value.customer_use_limit} onChange={handleChange} placeholder='Customer Use Limit' className='form-control' />
                                            </div>
                                            <div className="col-6">
                                                <div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" onChange={handleChange} name="allow" id="inlineRadio1" defaultValue="all" />
                                                        <label className="form-check-label" htmlFor="inlineRadio1">All Product</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <div className=' d-flex align-items-center'>
                                                            <input className="form-check-input" type="radio" name="allow" id="inlineRadio2" />
                                                            <label className="form-check-label" htmlFor="inlineRadio2">
                                                                <select name="allow" value={value.allow} onChange={handleChange} className='form-control form-control-sm'>
                                                                    <option value="">Select Category</option>
                                                                    {
                                                                        categories?.map((item, i) => (
                                                                            <option value={item.id} key={i}>{item?.name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-1">
                                                <button className='btn btn-primary w-100' onClick={() => handleCancel()}>Cancel</button>
                                            </div>
                                            <div className="col-sm-1">
                                                <button className='btn btn-primary w-100' onClick={() => createCoupon()}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-sm-12 col-lg-12">
                                    <DataTable
                                        columns={columns}
                                        data={couponList}
                                        highlightOnHover
                                        selectableRowsHighlight
                                        pagination
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="content-backdrop fade" />
            <Spinner sppiner={loading} />

        </div>

    )
}
