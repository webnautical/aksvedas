import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { defaultUserIMG, toastifyError } from '../../../utility/Utility'

const Header = () => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        // await axiosInstance.post('/logout')
        sessionStorage.clear()
        navigate('/')
    }
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
 
    const toggleSearch = () => {
        setIsSearchVisible(prevState => !prevState);
        setSearchTerm('')
    };
    const toggleMenu = () => {
        const event = new CustomEvent('toggleMenu');
        window.dispatchEvent(event);
      };


    const arrDataToFilter = [
        { name: 'all orders', url: 'orders' },
        { name: 'all products', url: 'products' },
        { name: 'all category', url: 'category' },
        { name: 'all brand', url: 'brand' },
        { name: 'all attributes', url: 'attributes' },
        { name: 'all reviews', url: 'reviews/all' },
        { name: 'all customer', url: 'customer' },
        { name: 'offers coupon', url: 'offers' },
        { name: 'utils utility', url: 'utils' },
        { name: 'queries', url: 'queries' },
        { name: 'help reasons', url: 'reasons' },
        { name: 'blog', url: 'blog/all' },
        { name: 'comments', url: 'blog/comments' },
        { name: 'about us', url: 'page/about-us' },
        { name: 'contact us', url: 'page/contact-us' },
        { name: 'term and condition', url: 'page/term-and-condition' },
        { name: 'privacy policy', url: 'page/privacy-policy' },
        { name: 'shipping policy', url: 'page/shipping-policy' },
        { name: 'cancellation returns refunds policy', url: 'page/cancellation-returns-refunds-policy' },
        { name: 'homepage Shop By Concern Ayurved Experience Knowledge Base', url: 'ayurved-experience' },
        { name: 'images videos', url: 'images-videos' },
        { name: 'transaction', url: 'transaction' },
        { name: 'dashboard', url: 'dashboard' },
        { name: 'order report', url: 'reports/order-products' },
        { name: 'customer report', url: 'reports/customer' },
    ];

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const matchedItem = arrDataToFilter.find(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (matchedItem) {
            navigate(`/admin/${matchedItem.url}`);
            setSearchTerm('')
        }else{
            toastifyError("Oops! No Matching Result")
        }
    };
   
    return (
        <nav className="layout-navbar  navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0   d-xl-none ">
                <button className="nav-item nav-link px-0 me-xl-4"  onClick={toggleMenu} id="togglemen">
                    <i className="ti ti-menu-2 ti-sm" />
                </button>
            </div>
            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                {/* Search */}
                <div className="navbar-nav align-items-center">
                    <div className="nav-item navbar-search-wrapper mb-0">
                        <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" href="javascript:void(0);" onClick={toggleSearch}>
                            <i className="ti ti-search ti-md me-2" />
                            <span className="d-none d-md-inline-block">Search
                            </span>
                        </a>
                    </div>
                </div>
                {/* /Search */}
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                    {/* Language */}
                    <li className="nav-item  me-2 me-xl-0">
                        <a className="nav-link  hide-arrow" href="/">
                            <i className="ti ti-world-www rounded-circle ti-md" />
                            Visit Store
                        </a>
                       
                    </li>
                   
                    <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            <i className="ti ti-bell ti-md" />
                            <span className="badge bg-danger rounded-pill badge-notifications">5</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end py-0">
                            <li className="dropdown-menu-header border-bottom">
                                <div className="dropdown-header d-flex align-items-center py-3">
                                    <h5 className="text-body mb-0 me-auto">Notification</h5>
                                    <a href="javascript:void(0)" className="dropdown-notifications-all text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark all as read"><i className="ti ti-mail-opened fs-4" /></a>
                                </div>
                            </li>
                            <li className="dropdown-notifications-list scrollable-container">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img src="assets/admin/img/avatars/1.png" alt className="h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Congratulation Lettie 🎉</h6>
                                                <p className="mb-0">Won the monthly best seller gold
                                                    badge</p>
                                                <small>1h ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <span className="avatar-initial rounded-circle bg-label-danger">CF</span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Charles Franklin</h6>
                                                <p className="mb-0">Accepted your connection</p>
                                                <small>12hr ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img src="assets/admin/img/avatars/2.png" alt className="h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">New Message ✉️</h6>
                                                <p className="mb-0">You have new message from
                                                    Natalie</p>
                                                <small>1h ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <span className="avatar-initial rounded-circle bg-label-success"><i className="ti ti-shopping-cart" /></span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Whoo! You have new order 🛒 </h6>
                                                <p className="mb-0">ACME Inc. made new order
                                                    $1,154</p>
                                                <small>1 day ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img src="assets/admin/img/avatars/9.png" alt className="h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Application has been approved 🚀
                                                </h6>
                                                <p className="mb-0">Your ABC project application has
                                                    been approved.</p>
                                                <small>2 days ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <span className="avatar-initial rounded-circle bg-label-success"><i className="ti ti-chart-pie" /></span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Monthly report is generated</h6>
                                                <p className="mb-0">July monthly financial report is
                                                    generated </p>
                                                <small>3 days ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img src="assets/admin/img/avatars/5.png" alt className="h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">Send connection request</h6>
                                                <p className="mb-0">Peter sent you connection
                                                    request</p>
                                                <small>4 days ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <img src="assets/admin/img/avatars/6.png" alt className="h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">New message from Jane</h6>
                                                <p className="mb-0">Your have new message from
                                                    Jane</p>
                                                <small>5 days ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <span className="avatar-initial rounded-circle bg-label-warning"><i className="ti ti-alert-triangle" /></span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">CPU is running high</h6>
                                                <p className="mb-0">CPU Utilization Percent is
                                                    currently at 88.63%,</p>
                                                <small>5 days ago</small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                                                <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="ti ti-x" /></a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li className="dropdown-menu-footer border-top">
                                <a href="javascript:void(0);" className="dropdown-item d-flex justify-content-center text-primary p-2 h-px-40 mb-1 align-items-center">
                                    View all notifications
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/*/ Notification */}
                    {/* User */}
                    <li className="nav-item navbar-dropdown dropdown-user dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                            <div className="avatar avatar-online">
                                <img src={defaultUserIMG} alt className="h-auto rounded-circle" />
                            </div>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end drowp-menu">
                            <li>
                                <a className="dropdown-item" href="javascript:void(0)">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar avatar-online">
                                                <img src={defaultUserIMG} alt className="h-auto rounded-circle" />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <span className="fw-medium d-block">Aksvedas</span>
                                            <small>Admin</small>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item" to={'/admin/my-profile'}>
                                    <i className="ti ti-user-check me-2 ti-sm" />
                                    <span className="align-middle">My Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to={'/admin'} onClick={() => handleLogout()}>
                                    <i className="ti ti-logout me-2 ti-sm" />
                                    <span className="align-middle">Log Out</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {/*/ User */}
                </ul>
            </div>
            {/* Search Small Screens */}
            <div className={`navbar-search-wrapper search-input-wrapper ${isSearchVisible ? 'd-lg-block' : 'd-none'}`}>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="twitter-typeahead">
                            <input
                                type="text"
                                className="form-control search-input border-0"
                                placeholder="Search..."
                                aria-label="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <i className="ti ti-x ti-sm search-toggler cursor-pointer" onClick={toggleSearch} />
                        </div>
                    </form>
            </div>
        </nav>
    )
}
 
export default Header