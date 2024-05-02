import React from 'react'

const PasswordChange = () => {
    return (
        <>
            <div className="card mb-4">
                <h5 className="card-header">Change Password</h5>
                <div className="card-body">
                    <form id="formAccountSettings" method="GET" onsubmit="return false">
                        <div className="row">
                            <div className="mb-3 col-md-6 form-password-toggle">
                                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                                <div className="input-group input-group-merge">
                                    <input className="form-control" type="password" name="currentPassword" id="currentPassword" placeholder="············" />
                                    <span className="input-group-text cursor-pointer"><i className="ti ti-eye-off" /></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-6 form-password-toggle">
                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                <div className="input-group input-group-merge">
                                    <input className="form-control" type="password" id="newPassword" name="newPassword" placeholder="············" />
                                    <span className="input-group-text cursor-pointer"><i className="ti ti-eye-off" /></span>
                                </div>
                            </div>
                            <div className="mb-3 col-md-6 form-password-toggle">
                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="input-group input-group-merge">
                                    <input className="form-control" type="password" name="confirmPassword" id="confirmPassword" placeholder="············" />
                                    <span className="input-group-text cursor-pointer"><i className="ti ti-eye-off" /></span>
                                </div>
                            </div>
                            <div className="col-12 mb-4">
                                <h6>Password Requirements:</h6>
                                <ul className="ps-3 mb-0">
                                    <li className="mb-1">Minimum 8 characters long - the more, the better</li>
                                    <li className="mb-1">At least one lowercase character</li>
                                    <li>At least one number, symbol, or whitespace character</li>
                                </ul>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-2">Save changes</button>
                                <button type="reset" className="btn btn-label-secondary">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PasswordChange