import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { deleteDataAPI, getDataAPI, postDataAPI } from '../../../utility/api/api';
import { Link } from 'react-router-dom';
import DeleteModal, { closeModal } from '../../../components/admin/DeleteModal';
import Spinner from '../../../components/admin/Spinner';
import { filterListByValue, toastifyError, toastifySuccess } from '../../../utility/Utility';
import { validateRequired } from '../../../utility/Validate';
import { LoadingBTN } from '../../../components/admin/LoadingBTN';

const Attributes = () => {
  const [attrList, setAttrList] = useState([])
  const [filterAttrData, setFilterAttrData] = useState([])

  const [attrValList, setAttrValList] = useState([])
  const [filterAttrValData, setFilterAttrValData] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [updData, setUpdData] = useState(null)
  const [selectedID, setSelectedID] = useState()
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(null)

  const attrColumns = [
    {
      name: `S.No`,
      selector: (row, i) => <>{i + 1}</>,
    },
    {
      name: `Attributes`,
      selector: row => row.name,
    },
    {
      name: 'Action',
      selector: row => <>
        <Link to={'#'} className='icon_btn __danger mx-1' data-bs-target="#delete" data-bs-toggle="modal" onClick={() => { setPage('attr'); setSelectedID(row.id) }}><i className='fa fa-trash' /></Link>
        <button type="button" onClick={() => { setPage('attr'); setUpdData(row) }} data-bs-target="#attr_modal" data-bs-toggle="modal" className="icon_btn __warning"><i className='fa fa-pencil' /></button>
      </>,
    },
  ];

  const attrValColumns = [
    {
      name: `S.No`,
      selector: (row, i) => <>{i + 1}</>,
    },
    {
      name: `Attributes`,
      selector: row => row.value,
    },
    {
      name: 'Action',
      selector: row => <>
        <Link to={'#'} className='icon_btn __danger mx-1' data-bs-target="#delete" data-bs-toggle="modal" onClick={() => { setPage('attrVal'); setSelectedID(row.id) }}><i className='fa fa-trash' /></Link>
        <button type="button" onClick={() => { setPage('attrVal'); setUpdData(row) }} data-bs-target="#attr_modal" data-bs-toggle="modal" className="icon_btn __warning"><i className='fa fa-pencil' /></button>
      </>,
    },
  ];

  const [value, setValue] = useState({
    'name': '',
    'attribute_id': '',
  })

  useEffect(() => {
    if (updData?.name || updData?.value) {
      setValue({
        ...value,
        'name': updData.name || updData.value,
        'attribute_id': updData.attribute_id,
        'id': updData.id,
      })
    } else {
      setValue({
        ...value,
        'name': '',
        'attribute_id': '',
      })
    }
  }, [updData])

  useEffect(() => {
    getAttributeFun()
    getAttrValFun()
  }, [])

  const [searchValues, setSearchValues] = useState({
    name: [],
    attribute_id: [],
  });
  
  const handleFilterChange = (e, page) => {
    setPage(page)
    const { name, value } = e.target;
    if (value === 'Select' || value === '') {
      setSearchValues({ ...searchValues, 'attribute_id': [], 'name': [] });
    } else {
      setSearchValues(prevState => ({
        ...prevState,
        [name]: [value]
      }));
    }
  };

  useEffect(() => {
    const filterAttrData = filterListByValue(attrList, { name: searchValues.name });
    setFilterAttrData(filterAttrData)
  }, [attrList, searchValues]);

  useEffect(() => {
      const filterAttrValData = filterListByValue(attrValList, { attribute_id: searchValues.attribute_id }, ['attribute_id']);
      setFilterAttrValData(filterAttrValData);
  }, [attrValList, searchValues]);

  const getAttributeFun = async () => {
    setLoading(true)
    const res = await getDataAPI('/get-attribute')
    if (res?.status) {
      setAttrList(res?.data)
      setFilterAttrData(res?.data)
      setLoading(false)
    } else {
      setAttrList([])
      setLoading(false)
    }
  }

  const getAttrValFun = async () => {
    setLoading(true)
    const res = await getDataAPI('/get-attribute-value')
    if (res?.status) {
      setAttrValList(res?.data)
      setFilterAttrValData(res?.data)
      setLoading(false)
    } else {
      setAttrValList([])
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setsubmitLoading(true)
    const apiEndPoint = page === 'attr' ? 'create-attribute' : 'create-attribute-value'
    const attrReq = { name: value.name }
    const attrValReq = { name: value.name, attribute_id: value.attribute_id }
    const validationErrors = validateRequired(page === 'attr' ? attrReq : attrValReq);
    const attrValParam = { value: value.name, attribute_id: value.attribute_id }
    const params = page === 'attr' ? value : attrValParam
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const res = await postDataAPI(apiEndPoint, params)
      if (res.status) {
        toastifySuccess(res.msg)
        getAttributeFun()
        getAttrValFun()
        closeModal('attr_modal')
        handleCancel()
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
    const apiEndPoint = page === 'attr' ? 'update-attribute' : 'update-attribute-value'
    const attrReq = { name: value.name }
    const attrValReq = { name: value.name, attribute_id: value.attribute_id }
    const validationErrors = validateRequired(page === 'attr' ? attrReq : attrValReq);
    setErrors(validationErrors);
    const attrValParam = { id: value.id, value: value.name, attribute_id: value.attribute_id }
    const params = page === 'attr' ? value : attrValParam
    if (Object.keys(validationErrors).length === 0) {
      const res = await postDataAPI(apiEndPoint, params)
      if (res.status) {
        getAttributeFun()
        getAttrValFun()
        closeModal('attr_modal')
        setsubmitLoading(false)
        toastifySuccess(res.msg)
        handleCancel()
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

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  const handleDelete = async () => {
    setLoading(true)
    const apiEndPoint = page === 'attr' ? 'delete-attribute' : 'delete-attribute-value'
    const res = await deleteDataAPI(`${apiEndPoint}/${selectedID}`)
    if (res.status) {
      setLoading(false)
      toastifySuccess('Item Deleted succesfully')
      closeModal('delete');
      getAttributeFun()
      getAttrValFun()
      setSelectedID([])
    } else {
      toastifySuccess('Category can not be deleted')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setErrors({})
    setPage(null)
    setValue({ ...value, 'name': '', 'id': '', 'attribute_id': '', })
    setUpdData(null)
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="flex-grow-1 container-p-y">
          <div className="row">
            {/* Attributes */}
            <div className="col-xl-6 col-lg-5 col-md-5 order-1 order-md-0">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row g-2">
                    <div className='col-md-5'>
                      <h4>Attributes</h4>
                    </div>
                    <div className='col-md-4 text-end'>
                      <input type="text" className='form-control' name='name' onChange={(e) => handleFilterChange(e, 'attr')} placeholder='Search' />
                    </div>
                    <div className='col-md-3 text-end'>
                      <button type="button" onClick={() => setPage('attr')} className="btn btn-primary w-100" data-bs-target="#attr_modal" data-bs-toggle="modal">Add New</button>
                    </div>
                  </div>
                  <DataTable
                    columns={attrColumns}
                    data={filterAttrData}
                    dense
                    highlightOnHover
                    pagination
                  />
                </div>
              </div>
            </div>

            {/* Attributes Value*/}
            <div className="col-xl-6 col-lg-7 col-md-7 order-0 order-md-1">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row g-2">
                    <div className='col-md-5'>
                      <h4>Attributes Value</h4>
                    </div>
                    <div className="col-4">
                      <select id="attribute_id" name='attribute_id' onChange={(e) => handleFilterChange(e, 'attrVal')} className="select2 form-select text-capitalize">
                        <option value={'Select'}>Select</option>
                        {attrList?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className='col-md-3 text-end'>
                      <button type="button" onClick={() => setPage('attrVal')} className="btn btn-primary w-100 px-0" data-bs-target="#attr_modal" data-bs-toggle="modal">Add New</button>
                    </div>
                  </div>
                  <DataTable
                    columns={attrValColumns}
                    data={filterAttrValData}
                    dense
                    highlightOnHover
                    pagination
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="attr_modal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-lg modal-simple modal-edit-user">
              <div className="modal-content p-3 p-md-5">
                <div className="modal-body">
                  <button type="button" onClick={() => handleCancel()} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  <div className="text-center mb-4">
                    <h3 className="mb-2">Add  {page === "attr" ? 'Attributes' : 'Attributes value'}</h3>
                  </div>
                  <form id="editUserForm" className="row g-3" onsubmit="return false">
                    {
                      page === "attrVal" &&
                      <div className="col-12 col-md-12">
                        <div className="ecommerce-select2-dropdown">
                          <label className="form-label" htmlFor="attribute_id">Select Attribute</label>
                          <select id="attribute_id" name='attribute_id' value={value.attribute_id} onChange={handleChange} className="select2 form-select text-capitalize" data-placeholder="Select parent category">
                            <option value>Select</option>
                            {attrList?.map((item) => (
                              <option value={item.id}>{item.name}</option>
                            ))}
                          </select>
                          <span className='errMsg'>{errors.attribute_id}</span>
                        </div>
                      </div>
                    }
                    <div className="col-12 col-md-12 mb-3 ">
                      <label className="form-label" htmlFor="name">Attribute {page === "attr" ? 'name' : 'value'}</label>
                      <input type="text" id="name" name="name" value={value.name} onChange={handleChange} className="form-control" placeholder={`Attributes ${page === "attr" ? 'name' : 'value'}`} />
                      <span className='errMsg'>{errors.name}</span>
                    </div>

                    <div className="col-12 text-center">
                      {
                        submitLoading ? <><LoadingBTN /></> :
                          <>
                            {
                              updData?.id ?
                                <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={handleUpdate}>Update</button>
                                :
                                <>
                                  <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={handleSubmit}>Save</button>
                                </>
                            }
                          </>
                      }
                      <button type="reset" onClick={() => handleCancel()} className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Spinner sppiner={loading} />
      <DeleteModal id={'delete'} handleFunc={handleDelete} loading={loading} />
    </>
  )
}

export default Attributes