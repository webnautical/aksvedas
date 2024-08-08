import React, { useEffect, useState } from 'react'
import CKEditorCom from '../../../components/CKEditorCom'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { postDataAPI } from '../../../utility/api/api';
import ItemImg from '../../../components/admin/ItemImg';
import { validateRequired } from '../../../utility/Validate';
import { timeAgo } from '../../../utility/Date';
import { Link } from 'react-router-dom';
import DeleteModal, { closeModal } from '../../../components/admin/DeleteModal';
import { generateSlug, toastifyError, toastifySuccess } from '../../../utility/Utility';
import Spinner from '../../../components/admin/Spinner';
import { LoadingBTN } from '../../../components/admin/LoadingBTN';
const Category = () => {
    const [category, setCategory] = useState([])
    const [parentCategory, setParentCategory] = useState([])
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
            name: 'Category Name',
            selector: row => row.name,
        },
        {
            name: 'Slug',
            selector: row => row.slug,
        },
        {
            name: 'Description',
            selector: row => <div dangerouslySetInnerHTML={{ __html: row.description }} />,
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
                <Link to={'#'} className='icon_btn __danger mx-1' data-bs-target="#deleteCategory" data-bs-toggle="modal" onClick={() => { setSelectedID([row.id]) }}><i className='fa fa-trash' /></Link>
                <button type="button" onClick={() => setUpdData(row)} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" className="icon_btn __warning"><i className='fa fa-pencil' /></button>
            </>,
        },
    ];
 
    const [value, setValue] = useState({
        'name': '',
        'slug': '',
        'description': '',
        'parent_id': '',
        'cover': '',
        'status': 0,
    });
    const [errors, setErrors] = useState({});
 
    const [filterVal, setFilterVal] = useState({
        'parent_category_id': ''
    })
 
    useEffect(() => {
        if (updData?.name) {
            setValue({
                ...value,
                'name': updData.name,
                'slug': updData.slug,
                'description': updData.description,
                'status': updData.status,
                'cover': updData.cover,
                'parent_id': updData.parent_id,
            })
        } else {
            setValue({
                ...value,
                'name': '',
                'slug': '',
                'description': '',
                'status': '',
                'parent_id': '',
            })
        }
    }, [updData])
 
    const handleFilterChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFilterVal({ ...filterVal, [name]: value })
        if (name === "parent_category_id") {
            getCategory(value)
        } else {
            getCategory()
        }
    }
    useEffect(() => {
        getCategory()
        getParentCategory()
    }, [])
 
    const getCategory = async (parent_category_id) => {
        setLoading(true)
        const param = {
            type: 'categories',
            parent_id: parent_category_id
        }
        const res = await postDataAPI('/get-categories', param)
        if (res?.status) {
            setCategory(res?.data)
            setLoading(false)
        } else {
            setCategory([])
            setLoading(false)
        }
    }
 
   
    const getParentCategory = async () => {
        const param = { type: 'parent-categories' }
        const res = await postDataAPI('/get-categories', param)
        if (res?.status) {
            setParentCategory(res?.data)
        } else {
            setParentCategory([])
        }
    }
 
    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setValue({ ...value, 'cover': e.target.files[0] })
        } else if (e.target.name === 'name') {
            setValue({ ...value, 'name': e.target.value, 'slug': generateSlug(e.target.value) })
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
        const requiredVal = { name: value.name, cover: value.cover, description: value.description, slug: value.slug }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', value.name);
            formData.append('slug', value.slug);
            formData.append('description', value.description);
            formData.append('parent_id', value.parent_id);
            formData.append('status', value.status);
            formData.append('cover', value.cover);
            const res = await postDataAPI('category', formData)
            if (res.status) {
                handleCancel()
                getCategory()
                getParentCategory()
                toastifySuccess(res.msg)
                setsubmitLoading(false)
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
        const requiredVal = { name: value.name, cover: value.cover, description: value.description, slug: value.slug }
        const validationErrors = validateRequired(requiredVal);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append('id', updData.id);
            formData.append('name', value.name);
            formData.append('slug', value.slug);
            formData.append('description', value.description);
            formData.append('parent_id', value.parent_id);
            formData.append('status', value.status);
            formData.append('cover', value.cover);
            const res = await postDataAPI('update-categories', formData)
            if (res.status) {
                handleCancel()
                getCategory()
                getParentCategory()
                setsubmitLoading(false)
                toastifySuccess(res.msg)
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
        const res = await postDataAPI('update-categories', param)
        if (res.status) {
            handleCancel()
            getCategory()
            getParentCategory()
            toastifySuccess(`Category set as ${data.status === 0 ? "Publish" : "Inactive"}`)
            setLoading(false)
        } else if (res?.error?.slug?.length > 0) {
            toastifyError(res?.error?.slug[0])
            setLoading(false)
        } else {
            toastifyError('Something Went Wrong')
            setLoading(false)
        }
    }
 
    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ['description']: value };
        });
    }
 
    const handleCancel = () => {
        setErrors({})
        setValue({ ...value, 'cover': '', 'description': '', 'name': '', 'parent_id': '', 'slug': '', 'status': 0 })
        setUpdData(null)
    }
 
    const handleDelete = async () => {
        setLoading(true)
        const param = {
            ids: selectedID
        }
        const res = await postDataAPI(`delete-categories`, param)
        if (res.status) {
            setLoading(false)
            getCategory()
            getParentCategory()
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
                <div className="flex-grow-1 container-p-y">
                    {/* <PageHeaderCom pageTitle={"Category"} modalBtn='Category' modalBtnName='Add Category' /> */}
                    <div className="app-ecommerce-category">
                        {/* Category List Table */}
                     <div className='d-flex justify-content-between align-items-center'>
                     <h4 class="py-3 mb-2"><span class="fw-light">Aksvedas /</span> Category List</h4>
                        <Link className="btn btn-primary text-capitalize" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><i class="fa-solid fa-plus"></i>Add Products </Link>
                     </div>
                        <div className="card">
                            <div className="p-3">
                                <div className='row justify-content-between'>
                                    <div className='col-md-6'>
                                    {/* <div className="d-flex justify-content-between align-items-center">
            <h6 style={{ fontSize:'20px' }} class=" border-0  mb-0">Category</h6></div> */}
                                    </div>
                                    <div className='col-md-4 text-end'>
                                   
                                        <div className="ecommerce-select2-dropdown d-flex">
                                            <select id="ecommerce-category-parent-category" name='parent_category_id' onChange={handleFilterChange} className="select2 form-select text-capitalize" data-placeholder="Select parent category">
                                                <option value>Filter</option>
                                                {parentCategory?.map((item, i) => (
                                                    <option value={item.id} key={i}>{item.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="btn btn-primary text-capitalize mx-2" onClick={() => getCategory()}>Reset</button>
 
                                            <span>
                                        {
                                            selectedID?.length > 1 &&
                                            <button type="button" className="btn btn-label-danger delete-customer" onClick={() => handleDelete()}><i class="fa-solid fa-trash-can"></i> </button>
                                        }
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                            <div className="card-datatable table-responsive">
                                <DataTable className='cs_table_inerr'
                                    columns={columns}
                                    data={category}
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
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">{updData ? 'Update' : 'Add'} Category</h5>
                    <button type="button" onClick={handleCancel} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <form className="pt-0" id="eCommerceCategoryListForm" onSubmit={updData ? handleUpdate : handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" onChange={handleChange} name="name" value={value.name} placeholder="Enter category title" />
                            <span className='errMsg'>{errors.name}</span>
                        </div>
                        {/* Slug */}
                        <div className="mb-3">
                            <label className="form-label">Slug</label>
                            <input type="text" onChange={handleChange} name="slug" value={value.slug} className="form-control" placeholder="Enter slug" aria-label="slug" />
                            <span className='errMsg'>{errors.slug}</span>
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
                        {/* Parent category */}
                        <div className="mb-3 ecommerce-select2-dropdown">
                            <label className="form-label" htmlFor="ecommerce-category-parent-category">Parent category</label>
                            <select id="ecommerce-category-parent-category" name='parent_id' value={value.parent_id} onChange={handleChange} className="select2 form-select text-capitalize" data-placeholder="Select parent category">
                                <option value>Select</option>
                                {parentCategory?.map((item) => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
 
                        {/* Description */}
                        <div className="col-12 mb-4">
                            <label className="form-label">Description</label>
                            <CKEditorCom ckValue={updData ? updData?.description : value?.description} handleEditorChange={handleEditorChange} />
                            <span className='errMsg'>{errors.description}</span>
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
 
export default Category