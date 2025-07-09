import React, { useEffect, useState } from 'react'
import { toastifyError, toastifySuccess } from '../../../utility/Utility'
import { APICALL } from '../../../utility/api/api'
import SpinnerBTN from '../../../components/SpinnerBTN'
import { SOMETHING_ERR } from './../../../utility/Constants';

const SpinWheelSegment = ({ couponList }) => {
    const [loading, setLoading] = useState(false)
    const [segmentList, setGegmentList] = useState([])
    const [value, setValue] = useState({
        'coupon_code': '',
        'segment': '',
        'probability': '',
    })

    const handleChange = (e) => {
        setValue({
            ...value, [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        getSegmentsFunc()
    }, [])

    const getSegmentsFunc = async () => {
        const res = await APICALL('spin-wheel-segment')
        if (res.status) {
            setGegmentList(res?.data)
        } else {
            setGegmentList([])
        }
    }

    const handleSubmit = async (payload) => {
        if(!payload){
            setLoading(true)
        }
        try {
            const params = payload ? payload : value
            const res = await APICALL('spin-wheel-segment', "post", params)
            if (res.status) {
                toastifySuccess(res?.message)
                getSegmentsFunc()
                handleCancel()
                setLoading(false)
            } else {
                toastifyError(res?.message)
                setLoading(false)
            }
        } catch (error) {
            toastifyError(error?.response?.data?.message || SOMETHING_ERR)
        }
    }

    const handleAction = (type, row) => {
        if (type === "edit") {
            setValue({ ...value, 'coupon_code': row?.coupon_code, 'probability': row?.probability, 'segment': row?.segment, 'id': row?.id })
        } else if (type === "delete") {
            const param = {type : "delete", id: row?.id}
            handleSubmit(param)
        }
    }

    const handleCancel = () => {
        setValue({ 'coupon_code': "", 'probability': "", 'segment': "" })
    }

    return (
        <>
            <div className="card mb-4">
                <div className="card-widget-separator-wrapper">
                    <div className="card-body card-widget-separator">
                        <div className="row gy-4 gy-sm-1 p-2">
                            <div className="col-12">
                                <h5><i class="fa-solid fa-trophy"></i> Spin Wheel Segment</h5>
                            </div>
                            <div className="col-sm-12 col-lg-12">
                                <div className="row g-2">
                                    <div className="col-sm-2">
                                        <select name='coupon_code' value={value.coupon_code} onChange={handleChange} className='form-control'>
                                            <option value="">Select Coupon</option>
                                            {couponList?.map((item, i) => (
                                                <option value={item?.coupon_code}>{item?.coupon_code}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <input type="text" name='segment' value={value.segment} onChange={handleChange} placeholder='Segment' className='form-control' />
                                    </div>

                                    <div className="col-sm-2">
                                        <input type="number" name='probability' value={value.probability} onChange={handleChange} placeholder='Probability' className='form-control' />
                                    </div>

                                    <div className="col-sm-1">
                                        <button className='btn btn-primary w-100' onClick={() => handleCancel()}>Cancel</button>
                                    </div>
                                    <div className="col-sm-1">
                                        {loading ?
                                            <button type="button" className="btn btn-primary" ><SpinnerBTN /></button>
                                            :
                                            <button className='btn btn-primary w-100' onClick={() => handleSubmit()}>Save</button>
                                        }
                                    </div>
                                </div>
                            </div>

                            {segmentList?.length > 0 &&
                                <div className="col-12">
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Coupon Code</th>
                                                <th>Segment</th>
                                                <th>Probability</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {segmentList?.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{item?.coupon_code}</td>
                                                        <td>{item?.segment}</td>
                                                        <td>{item?.probability}</td>
                                                        <td>
                                                            <button className='icon_btn __danger mx-2 text-uppercase' type="button" onClick={() => handleAction("delete", item)}><i className='fa fa-trash' /></button>
                                                            <button className='icon_btn __warning text-uppercase' type="button" onClick={() => handleAction("edit", item)}><i className='fa fa-pencil' /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>}

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SpinWheelSegment