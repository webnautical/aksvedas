import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authCustomer } from "../../../utility/Utility";
import { APICALL } from "../../../utility/api/api";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import styled from "styled-components";
import upi from '../../../assets/img/upi.png'
import creditCard from '../../../assets/img/payemnt-option.png'
import netBanking from '../../../assets/img/netbanking.png'
import cod from '../../../assets/img/cod.png'

const logos = {
  OPTUPI: upi,
  OPTCRDC: creditCard,
  OPTDBCRD: creditCard,
  OPTNBK: netBanking,
  COD: cod,
};

const paymentOptions = [
  { value: "OPTUPI", label: "UPI" },
  { value: "OPTCRDC", label: "Credit Card" },
  { value: "OPTDBCRD", label: "Debit Card" },
  { value: "OPTNBK", label: "Net Banking" },
  { value: "COD", label: "Cash on Delivery" },
];

const Card = styled.div`
  max-width: 350px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
`;


const BoxLabel = styled.label`
  background: #fff;
  margin-top: 15px;
  padding: 10px 15px;
  display: flex;
  border-radius: 8px;
  border: 2px solid #e5e5e5;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    background: #fae8cd;
  border: 2px solid #B46B00;
 
  }
  ${(props) => props.checked && `
    border-color: #B46B00;
    background: #fae8cd;
  `}
`;

const Circle = styled.span`
  height: 22px;
  width: 22px;
  background: #fff;
  border: 1px solid #e5e5e5;
  display: inline-block;
  margin-right: 15px;
  border-radius: 50%;
  transition: all 0.25s ease;
  ${(props) => props.checked && `
    border: 5px solid #B46B00;
    background: #fff;
  `}
`;

const Plan = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const RadioInput = styled.input`
  display: none;
`;

const Payment = ({ paymentMethod,setPaymentMethod }) => {

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };



  return (
    <>
      <h5 className="mb-0 flex-grow-1">Payment Selection</h5>
      <div className="checkout-pay-card d-block border-0">
        {paymentOptions.map((option) => (
          <React.Fragment key={option.value}>
            <RadioInput
              type="radio"
              id={option.value}
              name="payment"
              value={option.value}
              checked={paymentMethod === option.value}
              onChange={handleChange}
            />
            <BoxLabel htmlFor={option.value} checked={paymentMethod === option.value}>
              <Plan className="plan-itemss-flex">
                <div className="d-flex">
                  <Circle checked={paymentMethod === option.value} />
                  <span>{option.label}</span>
                </div>
                <div className="payment-logogs">
                  <img src={logos[option.value]} alt={`${option.label} logo`} width="30" />
                </div>
              </Plan>
            </BoxLabel>
          </React.Fragment>
        ))}

        {/* <ul
          className="nav nav-pills arrow-navtabs  bg-grays  nav-justified custom-nav"
          role="tablist"
        >
          <li className="nav-item " role="presentation">
            <Link
              className="nav-link active py-3 "
              data-bs-toggle="tab"
              to="#paypal"
              role="tab"
              aria-selected="false"
              tabIndex="-1"
              onClick={() => setPaymentMethod("OPTMOBP")}
            >
              <span><i className="fa fa-credit-card pe-2"></i>UPI</span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3 "
              data-bs-toggle="tab"
              to="#paypal"
              role="tab"
              aria-selected="false"
              tabIndex="-1"
              onClick={() => setPaymentMethod("OPTCRDC")}
            >
              <span><i className="fa fa-credit-card pe-2"></i>Credit Card</span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3 "
              data-bs-toggle="tab"
              to="#credit"
              role="tab"
              aria-selected="false"
              onClick={() => setPaymentMethod("OPTDBCRD")}
            >
              <span ><i className="fa fa-credit-card pe-2"></i> Debit Card </span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3 "
              data-bs-toggle="tab"
              to="#credit"
              role="tab"
              aria-selected="false"
              onClick={() => setPaymentMethod("OPTNBK")}
            >
              <span ><i className="fa fa-credit-card pe-2"></i> Net Working </span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link py-3 "
              data-bs-toggle="tab"
              to="#cash"
              role="tab"
              aria-selected="true"
              tabIndex="-1"
              onClick={() => setPaymentMethod("COD")}
            >
              <span><i className="fa-solid fa-money-bill-1 pe-2"></i> Cash on Delivery</span>
            </Link>
          </li>
        </ul>
        <div className="tab-content p-0">
          <div className="tab-pane" id="paypal" role="tabpanel">
            <div className="card">
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-md-12">
                    <label htmlFor="buyers-name" className="form-label">
                      Buyers First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-name"
                      placeholder="Enter Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="buyers-last" className="form-label">
                      Buyers Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-last"
                      placeholder="Enter Last Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="buyers-address"
                      className="form-label"
                    >
                      Email Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="buyers-address"
                      placeholder="Enter Email Address"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">
                      Select your paypal account type
                    </label>
                    <div className="d-flex gap-4 mt-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="formRadios"
                          id="formRadios1"
                          checked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="formRadios1"
                        >
                          Domestic
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="formRadios"
                          id="formRadios2"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="formRadios2"
                        >
                          International
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="tab-pane "
            id="credit"
            role="tabpanel"
          >
            <div className="card">
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-md-12">
                    <label htmlFor="cc-name" className="form-label">
                      Name on card
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-name"
                      placeholder="Enter name"
                    />
                    <small>
                      Full name as displayed on card
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="cc-number" className="form-label">
                      Credit card number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-number"
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="cc-expiration" className="form-label">
                      Expiration
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-expiration"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="cc-cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-cvv"
                      placeholder="xxx"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane active show" id="cash" role="tabpanel">
            <div className="card">

              <div className="card-body">
                <div className="text-center py-3">
                  <div className="avatar-md mx-auto mb-2">
                    <div className="avatar-title bg-grays rounded-circle">
                      <i className="fa-solid fa-money-bill-1 text-dark"></i>
                    </div>
                  </div>
                  <h5 className="fs-16 mb-3">Cash on Delivery</h5>
                  <p className=" w-md-75 mx-auto">
                    Pay with ease and peace of mind using Cash on Delivery. Simply receive your order and pay cash upon delivery, making shopping convenient and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Payment;
