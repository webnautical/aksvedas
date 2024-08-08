import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { logo } from '../../../utility/Utility'

const Sidebar = () => {
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => {
        const handleToggleMenu = () => {
            setIsMenuOpen(prevState => !prevState);
        };
        window.addEventListener('toggleMenu', handleToggleMenu);
        return () => {
            window.removeEventListener('toggleMenu', handleToggleMenu);
        };
    }, []);
    return (
        <>
            <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme ${isMenuOpen ? 'layout-menu-open' : ''}`}>
                <div className="app-brand demo ">
                    <Link to={'/admin/dashboard'} className="app-brand-link">
                        <div className='text-center'>
                            <img src={logo} alt="" style={{ width: '150px' }} />
                        </div>
                    </Link>
                    <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto" id="layout-toggle" onClick={toggleMenu}>
                        <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle" />
                    </a>
                    <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto mobile_togg_btn" id="layout-toggle" onClick={toggleMenu}>
                        <i class="ti menu-toggle-icon ti-sm align-middle"></i>
                    </a>
                </div>
                <div className="menu-inner-shadow" />
                <ul className="menu-inner py-1">
                    <li className="menu-item active">
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
                                    <div data-i18n="Product List">All Product </div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/category'} className="menu-link">
                                    <div>All Category</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/brand'} className="menu-link">
                                    <div>All Brand</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/attributes'} className="menu-link">
                                    <div>All Attributes</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/orders'} className="menu-link">
                            <i class="fa-solid fa-truck-ramp-box me-2"></i>
                            <div data-i18n="Tables">All Orders</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/transaction'} className="menu-link">
                            <i class="fa-solid fa-truck-ramp-box me-2"></i>
                            <div data-i18n="Tables">Transaction</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/customer'} className="menu-link">
                            <i className="menu-icon tf-icons ti ti-users" />
                            <div data-i18n="Tables">Customers</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to={'/admin/customer-reviews'} className="menu-link">
                            <i className="menu-icon tf-icons ti ti-star" />
                            <div data-i18n="Tables">Customer Reviews</div>
                        </Link>
                    </li>

                    {/* Web Settings */}
                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#web_attributes" aria-controls="web_attributes" aria-expanded="false" aria-label="Toggle navigation">
                            <i class="fa-solid fa-gears me-2"></i>
                            <div data-i18n="Order">Web Settings</div>
                        </Link>
                        <ul className="collapse" id="web_attributes">
                            <li className="menu-item">
                                <Link to={'/admin/offers'} className="menu-link">
                                    <div>Coupon & Offers</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/images-videos'} className="menu-link">
                                    <div>Images & Videos</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/ayurved-experience'} className="menu-link">
                                    <div>Homepage Content</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Pages */}
                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#web_pages" aria-controls="web_pages" aria-expanded="false" aria-label="Toggle navigation">
                            <i class="fa-solid fa-pager  me-2"></i>
                            <div data-i18n="Order">Pages</div>
                        </Link>
                        <ul className="collapse" id="web_pages">
                            <li className="menu-item">
                                <Link to={'/admin/page/about-us'} className="menu-link">
                                    <div>About Us</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/page/contact-us'} className="menu-link">
                                    <div>Contact Us</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/page/term-and-condition'} className="menu-link">
                                    <div>Term & Condition</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/page/privacy-policy'} className="menu-link">
                                    <div>Privacy Policy</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/page/shipping-policy'} className="menu-link">
                                    <div>Shipping Policy</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/page/cancellation-returns-refunds-policy'} className="menu-link">
                                    <div>Cancellation Policy</div>
                                </Link>
                            </li>

                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#blogs" aria-controls="blogs" aria-expanded="false" aria-label="Toggle navigation">
                            <i class="fa-solid fa-square  me-2"></i>
                            <div data-i18n="Order">Blog</div>
                        </Link>
                        <ul className="collapse" id="blogs">
                            <li className="menu-item">
                                <Link to={'/admin/blog/all'} className="menu-link">
                                    <div data-i18n="Tables">Blogs</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to={'/admin/blog/comments'} className="menu-link">
                                    <div>Comments</div>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/reviews/all'} className="menu-link">
                            <i className="menu-icon tf-icons ti ti-star" />
                            <div data-i18n="Tables">Reviews</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/queries'} className="menu-link">
                            <i className="menu-icon fa-solid fa-clipboard-question" />
                            <div data-i18n="Tables">Queries</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'/admin/utils'} className="menu-link">
                            <i className="menu-icon fa-solid fa-magnet" />
                            <div data-i18n="Tables">Utility</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={'#'} className="navbar-toggler menu-link menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#reports" aria-controls="reports" aria-expanded="false" aria-label="Toggle navigation">
                            <i class="fa-solid fa-gears me-2"></i>
                            <div data-i18n="Order">Reports</div>
                        </Link>
                        <ul className="collapse" id="reports">
                            <li className="menu-item">
                                <Link to={'/admin/reports/customer'} className="menu-link">
                                    <div>Customer</div>
                                </Link>
                            </li>

                            <li className="menu-item">
                                <Link to={'/admin/reports/order-products'} className="menu-link">
                                    <div>GSTR</div>
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