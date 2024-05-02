import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { defaultUserIMG } from '../../../utility/Utility'
import { axiosInstance } from '../../../utility/api/interceptor'

const Header = () => {
    const navigate = useNavigate()
    const handleLogout = async () =>{
        await axiosInstance.post('/logout')
        sessionStorage.clear()
        navigate('/')
    }
    return (
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0   d-xl-none ">
                <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                    <i className="ti ti-menu-2 ti-sm" />
                </a>
            </div>
            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                {/* Search */}
                <div className="navbar-nav align-items-center">
                    <div className="nav-item navbar-search-wrapper mb-0">
                        <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" href="javascript:void(0);">
                            <i className="ti ti-search ti-md me-2" />
                            <span className="d-none d-md-inline-block text-muted">Search
                                (Ctrl+/)</span>
                        </a>
                    </div>
                </div>
                {/* /Search */}
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                    {/* Language */}
                    <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                            <i className="ti ti-language rounded-circle ti-md" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-language="en" data-text-direction="ltr">
                                    <span className="align-middle">English</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-language="fr" data-text-direction="ltr">
                                    <span className="align-middle">French</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-language="ar" data-text-direction="rtl">
                                    <span className="align-middle">Arabic</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-language="de" data-text-direction="ltr">
                                    <span className="align-middle">German</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/*/ Language */}
                    {/* Style Switcher */}
                    <li className="nav-item dropdown-style-switcher dropdown me-2 me-xl-0">
                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                            <i className="ti ti-md" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-theme="light">
                                    <span className="align-middle"><i className="ti ti-sun me-2" />Light</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-theme="dark">
                                    <span className="align-middle"><i className="ti ti-moon me-2" />Dark</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="javascript:void(0);" data-theme="system">
                                    <span className="align-middle"><i className="ti ti-device-desktop me-2" />System</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    {/* / Style Switcher*/}
                    {/* Quick links  */}
                    <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown me-2 me-xl-0">
                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            <i className="ti ti-layout-grid-add ti-md" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end py-0">
                            <div className="dropdown-menu-header border-bottom">
                                <div className="dropdown-header d-flex align-items-center py-3">
                                    <h5 className="text-body mb-0 me-auto">Shortcuts</h5>
                                    <a href="javascript:void(0)" className="dropdown-shortcuts-add text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Add shortcuts"><i className="ti ti-sm ti-apps" /></a>
                                </div>
                            </div>
                            <div className="dropdown-shortcuts-list scrollable-container">
                                <div className="row row-bordered overflow-visible g-0">
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-calendar fs-4" />
                                        </span>
                                        <a href="app-calendar.html" className="stretched-link">Calendar</a>
                                        <small className="text-muted mb-0">Appointments</small>
                                    </div>
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-file-invoice fs-4" />
                                        </span>
                                        <a href="app-invoice-list.html" className="stretched-link">Invoice App</a>
                                        <small className="text-muted mb-0">Manage Accounts</small>
                                    </div>
                                </div>
                                <div className="row row-bordered overflow-visible g-0">
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-users fs-4" />
                                        </span>
                                        <a href="app-user-list.html" className="stretched-link">User App</a>
                                        <small className="text-muted mb-0">Manage Users</small>
                                    </div>
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-lock fs-4" />
                                        </span>
                                        <a href="app-access-roles.html" className="stretched-link">Role Management</a>
                                        <small className="text-muted mb-0">Permission</small>
                                    </div>
                                </div>
                                <div className="row row-bordered overflow-visible g-0">
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-chart-bar fs-4" />
                                        </span>
                                        <a href="index.html" className="stretched-link">Dashboard</a>
                                        <small className="text-muted mb-0">User Profile</small>
                                    </div>
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-settings fs-4" />
                                        </span>
                                        <a href="pages-account-settings-account.html" className="stretched-link">Setting</a>
                                        <small className="text-muted mb-0">Account
                                            Settings</small>
                                    </div>
                                </div>
                                <div className="row row-bordered overflow-visible g-0">
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-help fs-4" />
                                        </span>
                                        <a href="pages-faq.html" className="stretched-link">FAQs</a>
                                        <small className="text-muted mb-0">FAQs &amp; Articles</small>
                                    </div>
                                    <div className="dropdown-shortcuts-item col">
                                        <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                                            <i className="ti ti-square fs-4" />
                                        </span>
                                        <a href="modal-examples.html" className="stretched-link">Modals</a>
                                        <small className="text-muted mb-0">Useful Popups</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    {/* Quick links */}
                    {/* Notification */}
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
                                                <small className="text-muted">1h ago</small>
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
                                                <small className="text-muted">12hr ago</small>
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
                                                <small className="text-muted">1h ago</small>
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
                                                <small className="text-muted">1 day ago</small>
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
                                                <small className="text-muted">2 days ago</small>
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
                                                <small className="text-muted">3 days ago</small>
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
                                                <small className="text-muted">4 days ago</small>
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
                                                <small className="text-muted">5 days ago</small>
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
                                                <small className="text-muted">5 days ago</small>
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
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item" href="pages-account-settings-account.html">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar avatar-online">
                                                <img src={defaultUserIMG} alt className="h-auto rounded-circle" />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <span className="fw-medium d-block">John Doe</span>
                                            <small className="text-muted">Admin</small>
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
                                <a className="dropdown-item" href="pages-account-settings-account.html">
                                    <i className="ti ti-settings me-2 ti-sm" />
                                    <span className="align-middle">Settings</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="pages-account-settings-billing.html">
                                    <span className="d-flex align-items-center align-middle">
                                        <i className="flex-shrink-0 ti ti-credit-card me-2 ti-sm" />
                                        <span className="flex-grow-1 align-middle">Billing</span>
                                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-label-danger w-px-20 h-px-20">2</span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item" href="pages-faq.html">
                                    <i className="ti ti-help me-2 ti-sm" />
                                    <span className="align-middle">FAQ</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="pages-pricing.html">
                                    <i className="ti ti-currency-dollar me-2 ti-sm" />
                                    <span className="align-middle">Pricing</span>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item" to={'/'} onClick={()=>handleLogout()}>
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
            <div className="navbar-search-wrapper search-input-wrapper  d-none">
                <input type="text" className="form-control search-input container-xxl border-0" placeholder="Search..." aria-label="Search..." />
                <i className="ti ti-x ti-sm search-toggler cursor-pointer" />
            </div>
        </nav>
    )
}

export default Header