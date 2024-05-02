import React from 'react'
import { defaultUserIMG } from '../../../utility/Utility'
import PasswordChange from './PasswordChange'
import { Link, useLocation } from 'react-router-dom'

const MyProfile = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let url = useQuery().get('p');
    console.log(url)
    return (
        <>
            <div className="content-wrapper">
                {/* Content */}
                <div className="container-xxl flex-grow-1 container-p-y">
                    <h4 className="py-2 mb-2">
                        <span className="text-muted fw-light">Account Settings /</span> Account
                    </h4>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="nav nav-pills flex-column flex-md-row mb-4">
                                <li className="nav-item"><Link to='/admin/my-profile' className={`nav-link ${url == null ? 'active' : ''}`}><i className="ti-xs ti ti-users me-1" /> Account</Link></li>
                                <li className="nav-item"><Link to='/admin/my-profile?p=security' className={`nav-link ${url == 'security' ? 'active' : ''}`}><i className="ti-xs ti ti-lock me-1" /> Security</Link></li>
                            </ul>
                            {
                                url == 'security' ?
                                    <PasswordChange />
                                    :
                                    <>
                                        <div className="card mb-4">
                                            <h5 className="card-header">Profile Details</h5>
                                            {/* Account */}
                                            <div className="card-body">
                                                <div className="d-flex align-items-start align-items-sm-center gap-4">
                                                    <img src={defaultUserIMG} alt="user-avatar" className="d-block w-px-100 h-px-100 rounded" id="uploadedAvatar" />
                                                    <div className="button-wrapper">
                                                        <label htmlFor="upload" className="btn btn-primary me-2 mb-3" tabIndex={0}>
                                                            <span className="d-none d-sm-block">Upload new photo</span>
                                                            <i className="ti ti-upload d-block d-sm-none" />
                                                            <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" />
                                                        </label>
                                                        <button type="button" className="btn btn-label-secondary account-image-reset mb-3">
                                                            <i className="ti ti-refresh-dot d-block d-sm-none" />
                                                            <span className="d-none d-sm-block">Reset</span>
                                                        </button>
                                                        <div className="text-muted">Allowed JPG, GIF or PNG. Max size of 800K</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="my-0" />
                                            <div className="card-body">
                                                <form id="formAccountSettings" method="GET" onsubmit="return false">
                                                    <div className="row">
                                                        <div className="mb-3 col-md-6">
                                                            <label htmlFor="firstName" className="form-label">First Name</label>
                                                            <input className="form-control" type="text" id="firstName" name="firstName" defaultValue="John" autofocus />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label htmlFor="lastName" className="form-label">Last Name</label>
                                                            <input className="form-control" type="text" name="lastName" id="lastName" defaultValue="Doe" />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label htmlFor="email" className="form-label">E-mail</label>
                                                            <input className="form-control" type="text" id="email" name="email" defaultValue="john.doe@example.com" placeholder="john.doe@example.com" />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label htmlFor="organization" className="form-label">Organization</label>
                                                            <input type="text" className="form-control" id="organization" name="organization" defaultValue="Pixinvent" />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                                            <div className="input-group input-group-merge">
                                                                <span className="input-group-text">US (+1)</span>
                                                                <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="202 555 0111" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <button type="submit" className="btn btn-primary me-2">Save changes</button>
                                                        <button type="reset" className="btn btn-label-secondary">Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                            {/* /Account */}
                                        </div>
                                        <div className="card">
                                            <h5 className="card-header">Delete Account</h5>
                                            <div className="card-body">
                                                <div className="mb-3 col-12 mb-0">
                                                    <div className="alert alert-warning">
                                                        <h5 className="alert-heading mb-1">Are you sure you want to delete your account?</h5>
                                                        <p className="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                                                    </div>
                                                </div>
                                                <form id="formAccountDeactivation" onsubmit="return false">
                                                    <div className="form-check mb-4">
                                                        <input className="form-check-input" type="checkbox" name="accountActivation" id="accountActivation" />
                                                        <label className="form-check-label" htmlFor="accountActivation">I confirm my account deactivation</label>
                                                    </div>
                                                    <button type="submit" className="btn btn-danger deactivate-account">Deactivate Account</button>
                                                </form>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
                {/* / Content */}
                <div className="content-backdrop fade" />
            </div>

        </>
    )
}

export default MyProfile