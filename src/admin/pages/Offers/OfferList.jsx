import React, { useEffect, useState } from 'react'
import { getDataAPI, postDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { toastifyError, toastifySuccess } from '../../../utility/Utility'
export const OfferList = () => {
    const [loading, setLoading] = useState()
    const [dashboardOffer, setDashboardOffer] = useState(null)
    const [page, setPage] = useState('')
    useEffect(() => {
        getOffersList()
    }, [])

    const [value, setValue] = useState({
        'dashboardOfferVal': ''
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

    const handleChange = (e) => {
        setValue({
            ...value, [e.target.name]: e.target.value
        })
    }

    const updateDashboardOffer = async () =>{
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
            setValue({...value, dashboardOfferVal: res?.data?.offer})
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                {/* <PageHeaderCom pageTitle="Product" link='/admin/add-products' linkBtnName={'add product'} /> */}
                {/* Product List Widget */}

                <div className="card mb-4">
                    <div className="card-widget-separator-wrapper">
                        <div className="card-body card-widget-separator">
                            <div className="row gy-4 gy-sm-1">
                                <div className="col-sm-6 col-lg-6">
                                    <h5><i class="fa-solid fa-trophy"></i> Offer</h5>
                                    <div className="justify-content-between align-items-start border-end pe-3 pb-3 pb-sm-0 card-widget-3">
                                        {/* 25% SITEWIDE DISCOUNT | ON ORDERS ABOVE 500 | 25TH TO 28TH JANUARY 2024 */}

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
                                                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={() =>{ setPage(null);setValue({...value, dashboardOfferVal: dashboardOffer?.offer}) }}>Cancel</button>
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

                                {/* <div className="col-sm-6 col-lg-6">
                                    <h5><i class="fa-solid fa-trophy"></i> Offer on product.</h5>
                                    <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                                        <h5 className='text-uppercase'>10% OFF OF every product
                                            <button className='icon_btn __warning mx-2' type="button"><i className='fa fa-pencil' /></button>
                                        </h5>
                                    </div>
                                </div> */}

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
