import React, { useState } from 'react'
import SpinnerBTN from './SpinnerBTN'
import { toastifyError } from '../utility/Utility'
import { axiosInstance } from '../utility/api/interceptor'

const PDFButton = ({order_id, btnName}) => {
    const [loading, setLoading] = useState(false)
    const downloadInvoice = async () => {
        setLoading(true)
        try {
            const params = { order_id: order_id }
            const res = await axiosInstance.post('download-invoice', params, { responseType: 'blob' })
            setLoading(false)
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'invoice.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toastifyError("Error downloading the invoice")
            setLoading(false)
            console.log(error)
        }
    }
    return (
        <>
            <button className="btn btn-sm btn-success text-uppercase" onClick={() => downloadInvoice()}>
                {loading ? <SpinnerBTN /> : btnName}
            </button>
        </>
    )
}

export default PDFButton