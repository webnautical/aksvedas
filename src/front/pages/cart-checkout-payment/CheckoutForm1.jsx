import React, { useState } from 'react';
import axios from 'axios';
import { APICALL } from '../../../utility/api/api';

const CheckoutForm1 = ({paymentData}) => {
    const [loading, setLoading] = useState(false);
    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const response = await APICALL('/checkout', 'post', paymentData);
            const { encryptedData, accessCode } = response;
            const form = document.createElement('form');
            form.method = 'post';
            form.action = 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
            form.innerHTML = `
                <input type="hidden" name="encRequest" value="${encryptedData}" />
                <input type="hidden" name="access_code" value="${accessCode}" />
            `;
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Payment initiation failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='pb-5'>
            <h2>Checkout</h2>
            <form onSubmit={handlePayment}>
                <button type="submit" className='btn btn-primary' disabled={loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm1;
