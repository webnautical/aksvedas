import React from 'react'
import { Link } from 'react-router-dom'
import { logo } from '../../../utility/Utility'

const Sidebar = () => {
    return (
        <>
            <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
                <div className="app-brand demo ">
                    <Link to={'/admin/dashboard'} className="app-brand-link">
                        {/* <span className="app-brand-logo demo">
                            <svg width={32} height={22} viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z" fill="#7367F0" />
                                <path opacity="0.06" fillRule="evenodd" clipRule="evenodd" d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z" fill="#161616" />
                                <path opacity="0.06" fillRule="evenodd" clipRule="evenodd" d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z" fill="#161616" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z" fill="#7367F0" />
                            </svg>
                        </span>
                        <span className="app-brand-text demo menu-text fw-bold">Vuexy</span> */}
                        <div className='text-center'>
                        <img src={logo} alt="" style={{width: '80px'}}/>
                        </div>
                    </Link>
                    <Link to={'#'} className="layout-menu-toggle menu-link text-large ms-auto">
                        <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle" />
                        <i className="ti ti-x d-block d-xl-none ti-sm align-middle" />
                    </Link>
                </div>
                <div className="menu-inner-shadow" />
                <ul className="menu-inner py-1">


                    <li className="menu-item">
                        <Link to={'/admin/dashboard'} className="menu-link">
                            <i className="menu-icon tf-icons ti ti-table" />
                            <div data-i18n="Tables">Dashboard</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#products" aria-controls="products" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="menu-icon tf-icons ti ti-shopping-cart" />
                            <div data-i18n="Products">Products</div>
                        </Link>
                        <ul className="collapse" id="products">
                            <li className="menu-item">
                                <Link to={'/admin/products'} className="menu-link">
                                    <div data-i18n="Product List">Product List</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/add-products'} className="menu-link">
                                    <div data-i18n="Add Product">Add Product</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#orders" aria-controls="orders" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="menu-icon tf-icons ti ti-shopping-cart" />
                            <div data-i18n="Order">Order</div>
                        </Link>
                        <ul className="collapse" id="orders">
                            <li className="menu-item">
                                <Link to={'#'} className="menu-link">
                                    <div data-i18n="Order List">Order List</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'#'} className="menu-link">
                                    <div data-i18n="Order Details">Order Details</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#customers" aria-controls="customers" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="menu-icon tf-icons ti ti-users" />
                            <div data-i18n="Order">Customer</div>
                        </Link>
                        <ul className="collapse" id="customers">
                            <li className="menu-item">
                                <Link to={'/admin/customer'} className="menu-link">
                                    <div data-i18n="Order List">All Customer</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#utility" aria-controls="utility" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="menu-icon tf-icons ti ti-users" />
                            <div data-i18n="Order">Utility</div>
                        </Link>
                        <ul className="collapse" id="utility">
                            <li className="menu-item">
                                <Link to={'/admin/category'} className="menu-link">
                                    <div>Category</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/brand'} className="menu-link">
                                    <div>Brand</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/attributes'} className="menu-link">
                                    <div>Attributes</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#web_attributes" aria-controls="web_attributes" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="menu-icon tf-icons ti ti-users" />
                            <div data-i18n="Order">Web Attributes</div>
                        </Link>
                        <ul className="collapse" id="web_attributes">
                            <li className="menu-item">
                                <Link to={'/admin/offers'} className="menu-link">
                                    <div>Offers</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/images-videos'} className="menu-link">
                                    <div>Images & Videos</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/ayurved-experience'} className="menu-link">
                                    <div>Ayurved Experience</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                </ul>
            </aside>
        </>
    )
}

export default Sidebar