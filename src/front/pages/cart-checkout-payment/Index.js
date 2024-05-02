import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";

import OrderSummary from '../../../components/front/OrderSummary';
import Cart from '../cart/Cart';
import CheckOut from '../checkout/CheckOut';
import Payment from '../payment/Payment';
import { useFrontDataContext } from '../../../context/FrontContextProvider';

const Index = () => {
    const { cartData } = useFrontDataContext()

    const navigate = useNavigate()
    const path = useLocation().pathname
    const pathWithoutSlash = path.substring(1);

    const continuePayment = () => {
        navigate('/payment')
    }

    const getSubTotalFunc = () => {
      const subtotal = cartData.reduce((total, item) => total + parseFloat(item.product.sale_price) * parseInt(item.qnt), 0);
      return subtotal;
    }
    return (
        <>

            <div
                className="innabout-section"
                style={{ backgroundImage: `url(${siderbg})` }}
            >
                <div className="container">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="breacrumb-custom py-md-3 py-2"
                        separator={<NavigateNextIcon fontSize="small" />}
                    >
                        <Link underline="hover" href="/">
                            Home
                        </Link>
                        <Typography className='text-capitalize'>{pathWithoutSlash}</Typography>
                    </Breadcrumbs>
                    <h1 className='text-capitalize'>{pathWithoutSlash}</h1>
                </div>
            </div>

            <section className="cart-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="alert alert-danger alert-modern alert-dismissible fade show"
                                role="alert"
                            >
                                <i className="bi bi-box-arrow-in-right icons"></i>Returning
                                customer?
                                <a href="/customer/login" className="link-danger">
                                    <strong> Click here to login</strong>.
                                </a>
                                <button
                                    type="button"
                                    className="btn-close p-4"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                ></button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            pathWithoutSlash === 'cart' ?
                                <Cart />
                                :
                                pathWithoutSlash === 'checkout' ?
                                    <CheckOut />
                                    :
                                    pathWithoutSlash === 'payment' ?
                                        <Payment />
                                        :
                                        <></>
                        }

                        <div className="col-lg-4  rightdiv-tableorder mt-lg-0 mt-3">
                            <div className="sticky-side-div">
                                <OrderSummary subTotal={getSubTotalFunc()} />
                                <div className="product-button">
                                    <div className="doble_btn-pro">
                                        <Link to="/cart" className="btn-2 buy-btn">
                                            Back To Cart{" "}
                                        </Link>
                                        <button type="button" className="btn-2" onClick={() => continuePayment()}>
                                            Continue Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </section>

        </>
    )
}

export default Index