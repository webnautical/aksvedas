import React, { useState } from 'react';
import { APICALL } from '../../../utility/api/api';
import { toastifySuccess } from '../../../utility/Utility';
import { useNavigate } from 'react-router';
import { LoadingBTN } from '../../../components/admin/LoadingBTN';
import SpinnerBTN from '../../../components/SpinnerBTN';

const MyProfile = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTogglePassword = (field) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (validateForm()) {
            try {
                const response = await APICALL('/change-password', 'post', formData);
                if(response?.status){
                    toastifySuccess(response?.message)
                    navigate('/admin/dashboard')
                    setLoading(false)
                }else{
                    setErrors(response.response.data.errors);
                    setLoading(false)

                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.data) {
                    setErrors(error.response.data.errors);
                    setLoading(false)

                }
            }
        }else{
            setLoading(false)

        }
    };

    const validateForm = () => {

        const { currentPassword, newPassword, confirmPassword } = formData;
        const newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = 'Current Password is required';
        }
        if (!newPassword) {
            newErrors.newPassword = 'New Password is required';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <h4 className="py-2 mb-2">
                        <span className="fw-light">Account Settings /</span> Account
                    </h4>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mb-4">
                                <h5 className="card-header">Change Password</h5>
                                <div className="card-body pb-4">
                                    <form id="formAccountSettings" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="mb-3 col-md-6 form-password-toggle">
                                                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        className="form-control"
                                                        type={passwordVisibility.currentPassword ? 'text' : 'password'}
                                                        name="currentPassword"
                                                        id="currentPassword"
                                                        placeholder="············"
                                                        value={formData.currentPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={() => handleTogglePassword('currentPassword')}
                                                    >
                                                        <i className={`ti ${passwordVisibility.currentPassword ? 'ti-eye' : 'ti-eye-off'}`} />
                                                    </span>
                                                </div>
                                                {errors.currentPassword && <div className="text-danger">{errors.currentPassword}</div>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6 form-password-toggle">
                                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        className="form-control"
                                                        type={passwordVisibility.newPassword ? 'text' : 'password'}
                                                        id="newPassword"
                                                        name="newPassword"
                                                        placeholder="············"
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={() => handleTogglePassword('newPassword')}
                                                    >
                                                        <i className={`ti ${passwordVisibility.newPassword ? 'ti-eye' : 'ti-eye-off'}`} />
                                                    </span>
                                                </div>
                                                {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                                            </div>
                                            <div className="mb-3 col-md-6 form-password-toggle">
                                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        className="form-control"
                                                        type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder="············"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={() => handleTogglePassword('confirmPassword')}
                                                    >
                                                        <i className={`ti ${passwordVisibility.confirmPassword ? 'ti-eye' : 'ti-eye-off'}`} />
                                                    </span>
                                                </div>
                                                {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                            </div>
                                            <div className='text-end'>
                                                {
                                                    loading ? 
                                                    <button type="button" className="btn btn-primary me-2">
                                                        <SpinnerBTN/>
                                                    </button>
                                                    :

                                                <button type="submit" className="btn btn-primary me-2">Save changes</button>
                                                }
                                                <button type="reset" className="btn btn-label-secondary">Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
        </>
    );
}

export default MyProfile;
