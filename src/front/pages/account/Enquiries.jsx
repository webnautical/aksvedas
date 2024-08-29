import React, { useEffect, useState } from 'react'
import { timeAgo } from '../../../utility/Date'
import { APICALL } from '../../../utility/api/api'
import DataTable from 'react-data-table-component'
import { authCustomer, imgBaseURL } from '../../../utility/Utility'

const Enquiries = ({ page }) => {
    const columns = [
        {
            name: <span className='text-uppercase'>reason</span>,
            selector: row => <>{row.reason || '---'}</>,
        },
        {
            name: <span className='text-uppercase'>Message</span>,
            selector: row => <>{row.text || '---'}</>,
            style: {
                width: '100px',
            },
        },
        {
            name: <span className='text-uppercase'>Status</span>,
            selector: row => <> <span className={`text-capitalize ${row?.status == "processing" ? "text-warning" : "text-success"}`}>{row?.status}</span></>,
        },
        {
            name: <span className='text-capitalize'>Date</span>,
            selector: row => timeAgo(row.created_at),
        },
        // {
        //     name: <span className='text-capitalize'>Resolved Date</span>,
        //     selector: row => timeAgo(row.updated_at),
        // },
        {
            name: <span className='text-uppercase text-end d-block'>Action</span>,
            selector: row => <> <button className='btn btn-sm btn-primary' onClick={() => setReasonDetails(row)}><i class="fa fa-eye" aria-hidden="true"></i></button></>,
        },

    ];
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState(null)
    const [reasonDetails, setReasonDetails] = useState(false)
    const imagesArray = reasonDetails?.images ? reasonDetails?.images.split(',') : []

    useEffect(() => {
        getListFun()
    }, [])

    const getListFun = async () => {
        setLoading(true)
        const res = await APICALL('/v1/reason', 'post', { type: 'customer', id: authCustomer()?.id })
        if (res?.status) {
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }
    return (
        <>

            <div
                className={`tab-pane fade ${page === "enquiries" && "active show"}`}
                id="custom-v-pills-enquiries"
                role="tabpanel"
            >
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive table-card">
                            {/* <table className="table fs-15 align-middle table-nowrap">
                                <thead>
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Earned AksCoins</th>
                                        <th scope="col">Review</th>
                                        <th scope="col" className="text-center">
                                            View
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderList?.length > 0 ? (
                                        <>
                                            {orderList?.map((item, i) => (
                                                <tr>
                                                    <td>
                                                        <Link to={`/order-details/${item?.id}`}>
                                                            {item?.id}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <span>{timeAgo(item?.created_at)}</span>
                                                    </td>
                                                    <td className="fw-medium">
                                                        ₹{item?.total_amount}
                                                    </td>
                                                    <td>
                                                       
                                                    </td>
                                                    <td className="fw-medium">
                                                        {item.earned_loyalty_discount
                                                            ? item.earned_loyalty_discount
                                                            : "---"}
                                                    </td>
                                                    <td>
                                                        {item?.order_status == "Delivered" ? (
                                                            <>
                                                                <Link
                                                                    to={`/product-detail/${item?.order_products[0]?.product?.slug}`}
                                                                >
                                                                    Add Review
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            "---"
                                                        )}
                                                    </td>
                                                    <td className="fw-medium text-center">
                                                        <Link to={`/order-details/${item?.id}`}>
                                                            <i className="fa fa-eye"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colspan="5">
                                                <div className="text-center py-3">
                                                    <div className="avatar-md avatrat-list mx-auto mb-2">
                                                        <div className="avatar-title rounded-circle">
                                                            <i className="fa fa-bag-shopping"></i>
                                                        </div>
                                                    </div>
                                                    <h4 className="fs-20 mb-3">
                                                        You don't have any order history yet
                                                    </h4>
                                                    <p className=" w-75 mx-auto">
                                                        <Link
                                                            className="text-decoration"
                                                            to="/shop/all"
                                                        >
                                                            Add Items{" "}
                                                            <i className="fa-solid fa-arrow-right  ms-2"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table> */}

                            <DataTable className='cs_table_inerr'
                                columns={columns}
                                data={listData}
                                // dense
                                highlightOnHover
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>

            {
                reasonDetails &&
                <div class="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block" }}>
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header p-0">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setReasonDetails(false)}></button>
                            </div>
                            <div class="modal-body">
                                {
                                    reasonDetails?.status == "processing" ? 
                                    <h6 className='text-center d-block mb-4'>
                                        Thank you for reaching out to us! Your query has been received and is currently under processing. Our team is working on it, and we'll get back to you as soon as possible.
                                    </h6>
                                    :
                                    <h6 className='text-center d-block mb-4'>
                                        Good news! Your query has been resolved. If you have any further questions or need additional assistance, please don't hesitate to reach out to us. We're here to help!
                                    </h6>
                                }
                                <div className="row">
                                    <div className="col-12">
                                        <p className=" mb-1"><b>Reason:</b> {reasonDetails?.reason}</p>
                                        <p className=" mb-1"><b>Message:</b> {reasonDetails?.text}</p>
                                    </div>

                                    <div className="col-12">
                                        <div className="outuploadimg">
                                            {imagesArray.map((file, index) => (
                                                <div className="lis-timg-upload" key={index}>
                                                    <img src={imgBaseURL() + file} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Enquiries