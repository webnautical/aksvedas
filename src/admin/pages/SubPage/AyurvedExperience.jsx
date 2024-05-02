import React, { useEffect, useState } from 'react'
import { getDataAPI, postDataAPI } from '../../../utility/api/api'
import Spinner from '../../../components/admin/Spinner'
import { imgBaseURL, toastifyError, toastifySuccess } from '../../../utility/Utility'
import ItemImg from '../../../components/admin/ItemImg'
import CKEditorCom from '../../../components/CKEditorCom'
import { validateRequired } from '../../../utility/Validate'
import HTMLContent from '../../../components/HTMLContent'
export const AyurvedExperience = () => {
    const [loading, setLoading] = useState()
    const [updData, setUpdData] = useState(null)
    const [page, setPage] = useState('')
    useEffect(() => {
        getDataFun()
    }, [])

    const [value, setValue] = useState({
        'title': '',
        'desc': '',
        'img1': '',
        'img2': ''
    })

    useEffect(() => {
        if (updData?.id) {
            setValue({
                ...value,
                'id': updData.id,
                'title': updData.title,
                'desc': updData.desc,
                'img1': updData.img1,
                'img2': updData.img2,
            })
        } else {
            setValue({
                ...value,
                'title': '',
                'desc': '',
                'img1': '',
                'img2': ''
            })
        }
    }, [updData])
    const [errors, setErrors] = useState({});

    const getDataFun = async () => {
        try {
            setLoading(true)
            const res = await getDataAPI('get-ayurved-experience')
            if (res?.status) {
                setUpdData(res?.data)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'img1') {
            setValue({ ...value, 'img1': e.target.files[0] })
        } else if (e.target.name === 'img2') {
            setValue({ ...value, 'img2': e.target.files[0] })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }
    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ['desc']: value };
        });
    }
    const updateDashboardOffer = async (e) => {
        e.preventDefault()
        setLoading(true)
        const requiredVal = { title: value.title, img1: value.img1, desc: value.desc }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', value.id);
            formData.append('title', value.title);
            formData.append('desc', value.desc);
            formData.append('img1', value.img1);
            formData.append('img2', value.img2);
            const res = await postDataAPI('ayurved-experience', formData)
            if (res.status) {
                getDataFun()
                toastifySuccess(res.msg)
                setLoading(false)
                setPage('')
            } else {
                toastifyError('Something Went Wrong')
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }


    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card mb-4">
                    <div className="card-widget-separator-wrapper">
                        <div className="card-body card-widget-separator">
                            <div className="row gy-4 gy-sm-1">
                                <div className="col-sm-12 col-lg-12">
                                    <h5><i class="fa-solid fa-trophy"></i> Ayurved Experience <button className='icon_btn __warning mx-2' type="button" onClick={() => setPage('updateDashboard')}><i className='fa fa-pencil' /></button></h5>
                                    <div className="justify-content-between align-items-start border-end pe-3 pb-3 pb-sm-0 card-widget-3">
                                        {
                                            page == 'updateDashboard' ?
                                                <div className='upd-box'>
                                                    <div className="row">
                                                        <div className="col-12 col-md-6">
                                                            <label className="form-label">Title</label>
                                                            <input type="text" className="form-control" onChange={handleChange} name="title" value={value.title} placeholder="Title" />
                                                            <span className='errMsg'>{errors.title}</span>
                                                        </div>

                                                        <div className="col-12 col-md-12 my-4">
                                                            <CKEditorCom ckValue={value?.desc} handleEditorChange={handleEditorChange} />
                                                        </div>

                                                        <div className="col-12 col-md-6">
                                                            <label className="form-label">IMG 1</label>
                                                            <input className="form-control" type="file" onChange={handleChange} name='img1' />
                                                            <span className='errMsg'>{errors.img1}</span>
                                                            {
                                                                updData?.img1 &&
                                                                <div className='mt-1'><ItemImg img={value?.img1} /></div>
                                                            }
                                                        </div>

                                                        <div className="col-12 col-md-6">
                                                            <label className="form-label">IMG 2</label>
                                                            <input className="form-control" type="file" onChange={handleChange} name='img2' />
                                                            <span className='errMsg'>{errors.img2}</span>
                                                            {
                                                                updData?.img2 &&
                                                                <div className='mt-1'><ItemImg img={value?.img2} /></div>
                                                            }
                                                        </div>
                                                    </div>



                                                    <div className="btn-box mt-2 text-end">
                                                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={() => { setPage(null); setValue({ ...value, updData: updData?.offer }) }}>Cancel</button>
                                                        <button type="button" className="btn btn-primary" onClick={updateDashboardOffer}>Update</button>
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <div>
                                                    <h4>{updData?.title}</h4>
                                                        <HTMLContent data={updData?.desc} />
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <img src={imgBaseURL() + updData?.img1} alt="" className='w-100' />
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <img src={imgBaseURL() + updData?.img2} alt="" className='w-100' />
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </>
                                        }
                                    </div>
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
