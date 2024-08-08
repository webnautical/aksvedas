import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APICALL } from '../../../utility/api/api';

const Checkout = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [iframeHeight, setIframeHeight] = useState('450px');
    const [productionUrl, setProductionUrl] = useState('');

    useEffect(() => {
        const fetchPaymentUrl = async () => {
            try {
                setLoading(true);
                const response = await APICALL('/checkout', 'post', { amount });
                const { encryptedData, accessCode } = response.data;
                const url = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${accessCode}`;
                setProductionUrl(url);
            } catch (error) {
                console.error('Error fetching payment URL:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentUrl();
    }, [amount]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.newHeight) {
                setIframeHeight(`${e.data.newHeight}px`);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Additional payment processing logic if needed
    };

    return (
        <div className="App">
            <h1>Payment Checkout</h1>
            <form onSubmit={handlePaymentSubmit}>
                <label>
                    Amount:
                    <input type="text" value={amount} onChange={handleAmountChange} />
                </label>
                <button type="submit" disabled={loading}>Submit Payment</button>
            </form>

            {productionUrl && (
                <iframe
                    src={productionUrl}
                    id="paymentFrame"
                    width="482"
                    height={iframeHeight}
                    frameBorder="0"
                    scrolling="no"
                />
            )}
        </div>
    );
};

export default Checkout;
