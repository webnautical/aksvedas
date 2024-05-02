import React from 'react'

const OrderSummary = (props) => {
    const {subTotal} = props
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="text-center">
                        <h6 className="mb-3 fs-14">
                            Have a <span className="fw-semibold">promo</span> code ?
                        </h6>
                    </div>
                    <div className="hstack gap-3 px-3 mx-n3">
                        <input
                            className="form-control me-auto"
                            type="text"
                            placeholder="Enter coupon code"
                            value="Toner15"
                            aria-label="Add Promo Code here..."
                        />
                        <button type="button" className="btn-normals w-xs">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
            <div className="card overflow-hidden mt-4">
                <div className="card-header border-bottom-dashed">
                    <h5 className="card-title mb-0 fs-15">Order Summary</h5>
                </div>
                <div className="card-body pt-4">
                    <div className="table-responsive table-card">
                        <table className="table table-borderless mb-0 fs-15">
                            <tbody>
                                <tr>
                                    <td>Sub Total :</td>
                                    <td className="text-end cart-subtotal">₹{subTotal}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Discount{" "}
                                        <span className="text-muted">(Toner15)</span>:
                                    </td>
                                    <td className="text-end cart-discount">₹0</td>
                                </tr>
                                <tr>
                                    <td>Shipping Charge :</td>
                                    <td className="text-end cart-shipping">₹0</td>
                                </tr>
                                <tr>
                                    <td>Estimated Tax (12.5%) : </td>
                                    <td className="text-end cart-tax">₹0</td>
                                </tr>
                                <tr className=" bg-grays">
                                    <th><strong>Total :</strong></th>
                                    <td className="text-end">
                                        <span className="fw-semibold cart-total">
                                            ₹{subTotal}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSummary