import React, { useState } from 'react';

const PaymentForm = () => {
  const [formState, setFormState] = useState({
    tid: '',
    merchant_id: '',
    order_id: '123654789',
    amount: '10.00',
    currency: 'INR',
    redirect_url: 'http://localhost/ccavResponseHandler.php',
    cancel_url: 'http://localhost/ccavResponseHandler.php',
    language: 'EN',
    billing_name: 'Charli',
    billing_address: 'Room no 1101, near Railway station Ambad',
    billing_city: 'Indore',
    billing_state: 'MH',
    billing_zip: '425001',
    billing_country: 'India',
    billing_tel: '9999999999',
    billing_email: 'test@test.com',
    delivery_name: 'Chaplin',
    delivery_address: 'room no.701 near bus stand',
    delivery_city: 'Hyderabad',
    delivery_state: 'Andhra',
    delivery_zip: '425001',
    delivery_country: 'India',
    delivery_tel: '5555555555',
    merchant_param1: 'additional Info.',
    merchant_param2: 'additional Info.',
    merchant_param3: 'additional Info.',
    merchant_param4: 'additional Info.',
    merchant_param5: 'additional Info.',
    payment_option: '',
    card_type: '',
    card_name: '',
    data_accept: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv_number: '',
    issuing_bank: '',
    mobile_number: '',
    mm_id: '',
    otp: '',
    promo_code: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState); // Replace this with your form submission logic
  };

  return (
    <form method="POST" name="customerData" action="ccavRequestHandler.php" onSubmit={handleSubmit}>
      <table width="40%" height="100" border="1" align="center">
        <caption>
          <font size="4" color="blue"><b>Integration Kit</b></font>
        </caption>
      </table>
      <table width="50%" height="100" border="1" align="center">
        <tr>
          <td>Parameter Name:</td>
          <td>Parameter Value:</td>
        </tr>
        <tr>
          <td colSpan="2">Compulsory information</td>
        </tr>
        <tr>
          <td>TID :</td>
          <td><input type="text" name="tid" value={formState.tid} readOnly /></td>
        </tr>
        <tr>
          <td>Merchant Id :</td>
          <td><input type="text" name="merchant_id" value={formState.merchant_id} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Order Id :</td>
          <td><input type="text" name="order_id" value={formState.order_id} readOnly /></td>
        </tr>
        <tr>
          <td>Amount :</td>
          <td><input type="text" name="amount" value={formState.amount} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Currency :</td>
          <td><input type="text" name="currency" value={formState.currency} readOnly /></td>
        </tr>
        <tr>
          <td>Redirect URL :</td>
          <td><input type="text" name="redirect_url" value={formState.redirect_url} readOnly /></td>
        </tr>
        <tr>
          <td>Cancel URL :</td>
          <td><input type="text" name="cancel_url" value={formState.cancel_url} readOnly /></td>
        </tr>
        <tr>
          <td>Language :</td>
          <td><input type="text" name="language" value={formState.language} readOnly /></td>
        </tr>
        <tr>
          <td colSpan="2">Billing information (optional):</td>
        </tr>
        <tr>
          <td>Billing Name :</td>
          <td><input type="text" name="billing_name" value={formState.billing_name} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing Address :</td>
          <td><input type="text" name="billing_address" value={formState.billing_address} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing City :</td>
          <td><input type="text" name="billing_city" value={formState.billing_city} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing State :</td>
          <td><input type="text" name="billing_state" value={formState.billing_state} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing Zip :</td>
          <td><input type="text" name="billing_zip" value={formState.billing_zip} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing Country :</td>
          <td><input type="text" name="billing_country" value={formState.billing_country} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing Tel :</td>
          <td><input type="text" name="billing_tel" value={formState.billing_tel} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Billing Email :</td>
          <td><input type="text" name="billing_email" value={formState.billing_email} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td colSpan="2">Shipping information (optional):</td>
        </tr>
        <tr>
          <td>Shipping Name :</td>
          <td><input type="text" name="delivery_name" value={formState.delivery_name} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping Address :</td>
          <td><input type="text" name="delivery_address" value={formState.delivery_address} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping City :</td>
          <td><input type="text" name="delivery_city" value={formState.delivery_city} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping State :</td>
          <td><input type="text" name="delivery_state" value={formState.delivery_state} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping Zip :</td>
          <td><input type="text" name="delivery_zip" value={formState.delivery_zip} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping Country :</td>
          <td><input type="text" name="delivery_country" value={formState.delivery_country} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Shipping Tel :</td>
          <td><input type="text" name="delivery_tel" value={formState.delivery_tel} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Merchant Param1 :</td>
          <td><input type="text" name="merchant_param1" value={formState.merchant_param1} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Merchant Param2 :</td>
          <td><input type="text" name="merchant_param2" value={formState.merchant_param2} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Merchant Param3 :</td>
          <td><input type="text" name="merchant_param3" value={formState.merchant_param3} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Merchant Param4 :</td>
          <td><input type="text" name="merchant_param4" value={formState.merchant_param4} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td>Merchant Param5 :</td>
          <td><input type="text" name="merchant_param5" value={formState.merchant_param5} onChange={handleChange} /></td>
        </tr>
        <tr>
          <td colSpan="2">Payment information:</td>
        </tr>
        <tr>
          <td>Payment Option:</td>
          <td>
            <input type="radio" name="payment_option" value="OPTCRDC" onChange={handleChange} /> Credit Card
            <input type="radio" name="payment_option" value="OPTDBCRD" onChange={handleChange} /> Debit Card <br />
            <input type="radio" name="payment_option" value="OPTNBK" onChange={handleChange} /> Net Banking
            <input type="radio" name="payment_option" value="OPTCASHC" onChange={handleChange} /> Cash Card <br />
            <input type="radio" name="payment_option" value="OPTMOBP" onChange={handleChange} /> Mobile Payments
            <input type="radio" name="payment_option" value="OPTEMI" onChange={handleChange} /> EMI
            <input type="radio" name="payment_option" value="OPTWLT" onChange={handleChange} /> Wallet
          </td>
        </tr>
        {/* EMI Section */}
        {formState.payment_option === 'OPTEMI' && (
          <tr>
            <td colSpan="2">
              <div>
                <table border="1" width="100%">
                  <tr>
                    <td colSpan="2">EMI Section</td>
                  </tr>
                  <tr>
                    <td>Emi plan id:</td>
                    <td><input type="text" name="emi_plan_id" value={formState.emi_plan_id} readOnly /></td>
                  </tr>
                  <tr>
                    <td>Emi tenure id:</td>
                    <td><input type="text" name="emi_tenure_id" value={formState.emi_tenure_id} readOnly /></td>
                  </tr>
                  <tr>
                    <td>Pay Through</td>
                    <td>
                      <select name="emi_banks" value={formState.emi_banks} onChange={handleChange}>
                        {/* Add your bank options here */}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div>
                        <span>EMI Duration</span>
                        <table id="emi_tbl" border="1">
                          {/* Add your EMI details here */}
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td id="processing_fee" colSpan="2">
                      {/* Processing Fee */}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        )}
        <tr>
          <td>Card Type:</td>
          <td><input type="text" name="card_type" value={formState.card_type} readOnly /></td>
        </tr>
        <tr>
          <td>Card Name:</td>
          <td>
            <select name="card_name" value={formState.card_name} onChange={handleChange}>
              <option value="">Select Card Name</option>
              {/* Add your card name options here */}
            </select>
          </td>
        </tr>
        <tr>
          <td>Data Accepted At:</td>
          <td><input type="text" name="data_accept" value={formState.data_accept} readOnly /></td>
        </tr>
        <tr>
          <td>Card Number:</td>
          <td>
            <input type="text" name="card_number" value={formState.card_number} onChange={handleChange} /> e.g. 4111111111111111
          </td>
        </tr>
        <tr>
          <td>Expiry Month:</td>
          <td><input type="text" name="expiry_month" value={formState.expiry_month} onChange={handleChange} /> e.g. 07</td>
        </tr>
        <tr>
          <td>Expiry Year:</td>
          <td><input type="text" name="expiry_year" value={formState.expiry_year} onChange={handleChange} /> e.g. 2027</td>
        </tr>
        <tr>
          <td>CVV Number:</td>
          <td><input type="text" name="cvv_number" value={formState.cvv_number} onChange={handleChange} /> e.g. 328</td>
        </tr>
        <tr>
          <td>Issuing Bank:</td>
          <td><input type="text" name="issuing_bank" value={formState.issuing_bank} onChange={handleChange} /> e.g. State Bank Of India</td>
        </tr>
        <tr>
          <td>Mobile Number:</td>
          <td><input type="text" name="mobile_number" value={formState.mobile_number} onChange={handleChange} /> e.g. 9770707070</td>
        </tr>
        <tr>
          <td>MMID:</td>
          <td><input type="text" name="mm_id" value={formState.mm_id} onChange={handleChange} /> e.g. 1234567</td>
        </tr>
        <tr>
          <td>OTP:</td>
          <td><input type="text" name="otp" value={formState.otp} onChange={handleChange} /> e.g. 123456</td>
        </tr>
        <tr>
          <td>Promotions:</td>
          <td>
            <select name="promo_code" value={formState.promo_code} onChange={handleChange}>
              <option value="">All Promotions &amp; Offers</option>
            </select>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><input type="submit" value="CheckOut" /></td>
        </tr>
      </table>
    </form>
  );
};

export default PaymentForm;
