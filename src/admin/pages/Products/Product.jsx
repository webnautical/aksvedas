import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import PageHeaderCom from "../../../components/admin/PageHeaderCom";
import { getDataAPI, postDataAPI } from "../../../utility/api/api";
import Spinner from "../../../components/admin/Spinner";
import { timeAgo } from "./../../../utility/Date";
import ItemImg from "../../../components/admin/ItemImg";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  formatdedDate,
  getProductType,
  handleDownloadExcel,
  toastifyError,
  toastifySuccess,
} from "../../../utility/Utility";
import DeleteModal, { closeModal } from "../../../components/admin/DeleteModal";

const Product = () => {
  const navigate = useNavigate();
  const [selectedID, setSelectedID] = useState([]);

  const columns = [
    {
      name: "Product Image",
      selector: (row) => (
        <>
          {" "}
          <ItemImg img={row.cover} />
        </>
      ),
    },
    {
      name: <span className="text-capitalize">product</span>,
      selector: (row) => <span className="text-capitalize">{row.name} </span>,
    },
    {
      name: <span className="text-capitalize">sku</span>,
      selector: (row) => row.sku,
    },
    {
      name: <span className="text-capitalize">qnt</span>,
      selector: (row) => (
        <>
          <span className="me-1 fw-bold">{row.quantity}</span>
          {/* {row.quantity > 0 ? (
            <span className="badge bg-label-success">In Stock</span>
          ) : (
            <span className="badge bg-label-danger">Out of Stock</span>
          )} */}
        </>
      ),
    },
    {
      name: <span className="text-capitalize">stock</span>,
      selector: (row) => (
        <>
          {/* <span className="me-1 fw-bold">{row.quantity}</span> */}
          {row.quantity > 0 ? (
            <span className=" p-1 d-block bg-label-success">In Stock</span>
          ) : (
            <span className="p-1 d-block bg-label-danger">Out of Stock</span>
          )}
        </>
      ),
    },
    {
      name: <span className="text-capitalize">price</span>,
      selector: (row) => (
        <>
          {
            row.sale_price ? <>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                ₹{row.sale_price}
              </span>
              -<span className="text-danger">(₹{row.price})</span>
            </>
              :
              <>---</>
          }
        </>
      ),
    },
    {
      name: <span className="text-capitalize">status</span>,
      selector: (row) => (
        <>
          {" "}
          <label className="switch switch-primary switch-sm me-4 pe-2">
            <input
              type="checkbox"
              className="switch-input"
              defaultChecked={row.status}
              onClick={() => changeStatus(row)}
            />
            <span className="switch-toggle-slider">
              <span className="switch-on">
                <span className="switch-off" />
              </span>
            </span>
          </label>
        </>
      ),
    },
    {
      name: <span className="text-capitalize">Product Type</span>,
      selector: (row) => <> {getProductType(row.product_type)}</>,
    },
    {
      name: <span className="text-capitalize">Created At</span>,
      selector: (row) => <>
        <span>{timeAgo(row.created_at)}</span><br />
        <span>{timeAgo(row.updated_at)}</span>
      </>,
    },
    {
      name: <span className="text-capitalize">Actions</span>,
      cell: (row) => (
        <div className="dropdown">
          <button
            className="btn p-0 dropdown-toggle hide-arrow "
            type="button"
            id={`dropdownMenuButton${row.id}`}
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <ul
            className="dropdown-menu"
            aria-labelledby={`dropdownMenuButton${row.id}`}
          >
            <li>
              <button
                className="dropdown-item d-block my-0 w-100"
                type="button"
                onClick={() => redirectPage("view_details", row)}
              >
                <i class="ti ti-eye me-2"></i> View Details
              </button>
            </li>
            <li>
              <button
                className="dropdown-item d-block my-0 w-100"
                type="button"
                onClick={() => redirectPage("update", row)}
              >
                <i class="ti ti-pencil me-2"></i> Edit
              </button>
            </li>
            <li>
              {" "}
              <Link
                to={"#"}
                className="dropdown-item d-block my-0 w-100"
                data-bs-target="#deleteModal"
                data-bs-toggle="modal"
                onClick={() => {
                  setSelectedID([row.id]);
                }}
              >
                <i class="ti ti-trash me-2"></i>
                Delete{" "}
              </Link>
            </li>
          </ul>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const [listData, setListData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getListFun();
  }, []);

  const getListFun = async () => {
    setLoading(true);
    const res = await getDataAPI("/get-product");
    if (res?.status) {
      setFilterData(res?.data);
      setListData(res?.data);
      setLoading(false);
    } else {
      setListData([]);
      setLoading(false);
    }
  };
  const changeStatus = async (data) => {
    setLoading(true);
    const param = {
      id: data?.id,
      status: data.status === 1 ? 0 : 1,
    };
    const res = await postDataAPI("change-product-status", param);
    if (res.status) {
      getListFun();
      toastifySuccess(
        `Product set as ${data.status === 0 ? "Publish" : "Inactive"}`
      );
      setLoading(false);
    } else if (res?.error?.slug?.length > 0) {
      toastifyError(res?.error?.slug[0]);
      setLoading(false);
    } else {
      toastifyError("Something Went Wrong");
      setLoading(false);
    }
  };

  const redirectPage = (page, data) => {
    if (page === "view_details") {
      navigate(`/admin/products/${data.slug}`, {
        state: { productDetails: data },
      });
    } else if ("update") {
      navigate(`/admin/add-products`, { state: { productDetails: data } });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const param = {
      ids: selectedID,
    };
    const res = await postDataAPI(`delete-product`, param);
    if (res.status) {
      setLoading(false);
      getListFun();
      toastifySuccess("Products deleted succesfully");
      closeModal("deleteModal");
      setSelectedID([]);
    } else {
      toastifySuccess("Products can not be deleted");
      setLoading(false);
    }
  };

  const [searchVal, setSearchVal] = useState({
    'drpType': '',
    'drpDownVal': '',
    'searchText': '',
  })

  const getType = (type) => {
    if (type === "Simple") {
      return 1
    } else if (type === "Variant") {
      return 2
    } else if (type === "Bundle") {
      return 3
    } else if (type === "publish") {
      return 1
    } else if (type === "Hold") {
      return 0
    } else if (type === "in stock") {
      return "inStock"
    } else if (type === "out of stock") {
      return "outOfStock"
    }
  }

  const handleFilter = () => {
    if (searchVal.searchText !== "") {
      const updatedProducts = listData.filter(item =>
        item?.name?.toLowerCase().includes(searchVal.searchText.toLowerCase()) || item?.slug?.toLowerCase().includes(searchVal.searchText.toLowerCase()) || item?.sku?.toLowerCase().includes(searchVal.searchText.toLowerCase())
      );
      setFilterData(updatedProducts)
    }

    if (searchVal.drpDownVal !== "") {
      if (searchVal.drpType === "type") {
        const updatedProducts = listData.filter(item =>
          item?.product_type === getType(searchVal.drpDownVal)
        );
        setFilterData(updatedProducts)
      } else if (searchVal.drpType === "status") {
        const updatedProducts = listData.filter(item =>
          item?.status === getType(searchVal.drpDownVal)
        );
        setFilterData(updatedProducts)
      } else if (searchVal.drpType === "stock") {
        if (getType(searchVal.drpDownVal) === 'inStock') {
          const updatedProducts = listData.filter(item =>
            item?.quantity > 0
          );
          setFilterData(updatedProducts)
        }
        if (getType(searchVal.drpDownVal) === 'outOfStock') {
          const updatedProducts = listData.filter(item =>
            item?.quantity === 0
          );
          setFilterData(updatedProducts)
        }
      }
    }
  }

  const filterReset = () => {
    setFilterData(listData)
    setSearchVal({ ...searchVal, 'searchText': '', 'drpDownVal': '' })
  }

  const handleDrpDown = (type, val) => {
    setSearchVal({ ...searchVal, 'drpType': type, 'drpDownVal': val })
  }

  const changeArrFilterData = (filteredData) => {
    const result = filteredData?.map((sponsor) =>
    ({
      "Product ID": sponsor.id,
      "SKU": sponsor.sku,
      "Product Name": sponsor.name,
      "QNT": sponsor.quantity,
      "Price": sponsor.price,
      "Sale Price": sponsor.sale_price,
      "Brand": sponsor.brand?.name,
      "Category": sponsor?.category?.name,
      "Product_type": sponsor.product_type === 1 ? "Simple" : sponsor.product_type === 2 ? "Variant" : "Bundle",
      "Status": sponsor.status === 1 ? "Publish" : "Hold",
      "Create Date": formatdedDate(sponsor.created_at),
      "Update Date": formatdedDate(sponsor.updated_at),
    })
    )
    return result
  }
  const downloadExcel = (type) => {
    handleDownloadExcel(changeArrFilterData(filterData), "Product List", "product-list")
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="flex-grow-1 container-p-y">
          <div className="d-flex justify-content-between align-items-center">
            <h4 class="py-3 mb-2"><span class="fw-light">Aksvedas /</span> All Product List</h4>
            <Link className="btn btn-primary text-capitalize" to="/admin/add-products"><i class="fa-solid fa-plus"></i>Add Products </Link>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2 align-items-end mb-3">
                <div className="col-md-2">
                  <label htmlFor="">Search</label>
                  <input type="text" value={searchVal.searchText} onChange={(e) => setSearchVal({ ...searchVal, 'searchText': e.target.value })} class="form-control" placeholder="Search" />
                </div>
                <div className="col-md-10">


                  <div className='d-flex justify-content-between order_fliter'>
                    <div>
                      <div class="btn-group me-2">
                        <button type="button" class="btn btn-danger dropdown-toggle text-capitalize" data-bs-toggle="dropdown" aria-expanded="false">{searchVal?.drpDownVal == "" ? "Sort By" : searchVal?.drpDownVal}</button>
                        <ul class="dropdown-menu text-capitalize">
                          <li className='bg-primary text-white h-100'><p className='pb-0 mb-0 fw-bold ps-2'>Product Status</p></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('status', 'publish')}>publish</Link></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('status', 'Hold')}>hold</Link></li>

                          <li className='bg-primary text-white h-100'><p className='pb-0 mb-0 fw-bold ps-2'>Product Type</p></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('type', 'Bundle')}>Bundle</Link></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('type', 'Variant')}>variant</Link></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('type', 'Simple')}>Simple</Link></li>

                          <li className='bg-primary text-white h-100'><p className='pb-0 mb-0 fw-bold ps-2'>stock</p></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('stock', 'in stock')}>in stock</Link></li>
                          <li><Link class="dropdown-item" to={'#'} onClick={() => handleDrpDown('stock', 'out of stock')}>out of stock</Link></li>
                        </ul>
                      </div>
                      <button class="btn btn-primary" onClick={() => filterReset()}><span>Reset</span></button>
                      <button class="btn btn-primary ms-2" onClick={() => handleFilter()}><span>Search</span></button>
                    </div>
                    <button class="btn btn-success buttons-collection dropdown-toggle btn-label-secondary waves-effect waves-light export_btn" onClick={() => downloadExcel()}><span><i class="ti ti-download me-1"></i>Export</span></button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="card-datatable table-responsive">
              <DataTable
                className="cs_table_inerr"
                columns={columns}
                data={filterData}
                // dense
                highlightOnHover
                selectableRowsHighlight
                pagination
              // selectableRows
              />
            </div>
          </div>
        </div>
        {/* / Content */}
        <div className="content-backdrop fade" />
      </div>

      <DeleteModal
        id={"deleteModal"}
        handleFunc={handleDelete}
        loading={loading}
      />
      <Spinner sppiner={loading} />
    </>
  );
};

export default Product;