import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { getDataAPI, postDataAPI } from '../../../utility/api/api';
import ItemImg from '../../../components/admin/ItemImg';
import { validateRequired } from '../../../utility/Validate';
import { timeAgo } from '../../../utility/Date';
import { Link } from 'react-router-dom';
import DeleteModal, { closeModal } from '../../../components/admin/DeleteModal';
import { filterListByValue, toastifyError, toastifySuccess } from '../../../utility/Utility';
import Spinner from '../../../components/admin/Spinner';
import { LoadingBTN } from '../../../components/admin/LoadingBTN';
const Brand = () => {
    const [listData, setListData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitLoading, setsubmitLoading] = useState(false)
    const [updData, setUpdData] = useState(null)
    const [selectedID, setSelectedID] = useState([])

    const columns = [
        {
            name: 'Cover',
            selector: row => <> <ItemImg img={row.cover} /></>,
            sortable: true
        },
        {
            name: 'Brand Name',
            selector: row => row.name,
        },
        {
            name: 'Created Date',
            selector: row => timeAgo(row.created_at),
        },
        {
            name: 'Status',
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={row.status} onClick={() => changeStatus(row)} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: 'Action',
            selector: row => <>
                <Link to={'#'} className='icon_btn __danger mx-1' data-bs-target="#deleteCategory" data-bs-toggle="modal" onClick={() => { setSelectedID([row.id])  }}><i className='fa fa-trash' /></Link>
                <button type="button" onClick={() => setUpdData(row)} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" className="icon_btn __warning"><i className='fa fa-pencil' /></button>
            </>,
        },
    ];

    const [value, setValue] = useState({
        'name': '',
        'cover': '',
        'status': 0,
    });

    const [searchValues, setSearchValues] = useState({
        name: [],
        description: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (updData?.name) {
            setValue({
                ...value,
                'name': updData.name,
                'status': updData.status,
                'cover': updData.cover,
            })
        } else {
            setValue({
                ...value,
                'name': '',
                'status': 0,
                'cover': '',
            })
        }
    }, [updData])

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(prevState => ({
            ...prevState,
            [name]: [value]
        }));
    };

    useEffect(() => {
        const filteredData = filterListByValue(listData, searchValues);
        setFilterData(filteredData);
    }, [listData, searchValues]);

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await getDataAPI('/get-brand')
        if (res?.status) {
            setFilterData(res?.data)
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setValue({ ...value, 'cover': e.target.files[0] })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const requiredVal = { name: value.name, cover: value.cover }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', value.name);
            formData.append('status', value.status);
            formData.append('cover', value.cover);
            const res = await postDataAPI('brand', formData)
            if (res.status) {
                handleCancel()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
                getListFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }
    
    const handleUpdate = async (e) => {
        e.preventDefault()
        setsubmitLoading(true)
        const requiredVal = { name: value.name, cover: value.cover }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', updData.id);
            formData.append('name', value.name);
            formData.append('status', value.status);
            formData.append('cover', value.cover);
            const res = await postDataAPI('update-brand', formData)
            if (res.status) {
                handleCancel()
                setsubmitLoading(false)
                toastifySuccess(res.msg)
                getListFun()
            } else if (res?.error?.slug?.length > 0) {
                toastifyError(res?.error?.slug[0])
                setsubmitLoading(false)
            } else {
                toastifyError('Something Went Wrong')
                setsubmitLoading(false)
            }
        } else {
            setsubmitLoading(false)
        }
    }

    const changeStatus = async (data) => {
        setLoading(true)
        const param = {
            'id': data?.id,
            'status': data.status === 1 ? 0 : 1
        }
        const res = await postDataAPI('update-brand', param)
        if (res.status) {
            handleCancel()
            getListFun()
            toastifySuccess(`Brand set as ${data.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else if (res?.error?.slug?.length > 0) {
            toastifyError(res?.error?.slug[0])
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setErrors({})
        setValue({ ...value, 'cover': '', 'name': '', 'status': 0 })
        setUpdData(null)
    }

    const handleDelete = async () => {
        setLoading(true)
        const param = {
            ids: selectedID
        }
        const res = await postDataAPI(`delete-brand`, param)
        if (res.status) {
            setLoading(false)
            getListFun()
            toastifySuccess('Category deleted succesfully')
            closeModal('deleteCategory');
            setSelectedID([])
        } else {
            toastifySuccess('Category can not be deleted')
            setLoading(false)
        }
    }

    const handleRowSelected = (state) => {
        const selectedIDs = state.selectedRows.map(row => row.id);
        setSelectedID(selectedIDs);
    };

    return (
        <>
            <div className="content-wrapper">
                {/* Content */}
                <div className="container-xxl flex-grow-1 container-p-y">
                    <PageHeaderCom pageTitle={"Brand"} modalBtn='Brand' modalBtnName='Add Brand' />
                    <div className="app-ecommerce-category">
                        {/* Category List Table */}
                        <div className="card">
                            <div className='p-3'>
                                <div className='row justify-content-between'>
                                    <div className='col-md-6'>{
                                        selectedID?.length > 1 &&
                                        <button type="button" className="btn btn-label-danger delete-customer" onClick={() => handleDelete()}>Delete Selected Brand</button>
                                    }
                                    </div>
                                    <div className='col-md-2 text-end'>
                                        <div className="ecommerce-select2-dropdown d-flex">
                                            <input type="text" name="name" placeholder="Search" onChange={handleFilterChange} className='form-control' />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="card-datatable table-responsive">
                                <DataTable
                                    columns={columns}
                                    data={filterData}
                                    // dense
                                    highlightOnHover
                                    selectableRowsHighlight
                                    pagination
                                    selectableRows
                                    onSelectedRowsChange={handleRowSelected}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">{updData ? 'Update' : 'Add'} Brand</h5>
                    <button type="button" onClick={handleCancel} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <form className="pt-0" id="eCommerceCategoryListForm" onSubmit={updData ? handleUpdate : handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Brand title</label>
                            <input type="text" className="form-control" onChange={handleChange} name="name" value={value.name} placeholder="Enter Brand title" />
                            <span className='errMsg'>{errors.name}</span>
                        </div>

                        {/* Image */}
                        <div className="mb-3">
                            <label className="form-label">Attachment</label>
                            <input className="form-control" type="file" onChange={handleChange} name='file' />
                            <span className='errMsg'>{errors.cover}</span>
                            {
                                updData?.cover &&
                                <div className='mt-1'><ItemImg img={value?.cover} /></div>
                            }
                        </div>

                        {/* Status */}
                        <div className="mb-4 ecommerce-select2-dropdown">
                            <label className="form-label">Select category status</label>
                            <select id="ecommerce-category-status" className="select2 form-select" onChange={handleChange} value={value.status} name='status'>
                                <option value>Select category status</option>
                                <option value="1">Publish</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        {/* Submit and reset */}
                        <div className="mb-3">
                            {
                                submitLoading ? <><LoadingBTN /></> :
                                    updData ?
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Update</button>
                                        :
                                        <button type="submit" className="btn btn-primary me-sm-3 me-1 data-submit">Save</button>
                            }
                            <button type="reset" onClick={handleCancel} className="btn bg-label-danger" data-bs-dismiss="offcanvas">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <DeleteModal id={'deleteCategory'} handleFunc={handleDelete} loading={loading} />

            <Spinner sppiner={loading} />

        </>
    )
}

export default Brand