import React, { useEffect, useState } from 'react'
import '../../assets/admin/page-auth.css'
import img1 from '../../assets/img/auth-login-illustration-light.png'
import img2 from '../../assets/img/bg-shape-image-light.png'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../utility/api/interceptor'
import { authUser, encryptSessionStorageData, logo } from '../../utility/Utility'
const Login = () => {
    const navigate = useNavigate()
    const [passToggle, setPassToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState({
        'username': '',
        'password': '',
    })
    const [error, setError] = useState({
        'username': '',
        'password': '',
    })
    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }
    const [validateCount, setValidateCount] = useState(0)
    const validate = (e) => {
        setValidateCount(validateCount + 1)
        e.preventDefault()
        if (value.username === '') {
            setMsg('')
            setError((prevValues) => {
                return { ...prevValues, ['username']: 'Please enter your username' };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ['username']: true };
            });
        }
        if (value.password === '') {
            setMsg('')
            setError((prevValues) => {
                return { ...prevValues, ['password']: 'Please enter your password' };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ['password']: true };
            });
        }

    }
    useEffect(() => {
        if (authUser()?.role == 1) {
            navigate('/admin/dashboard')
        }
        if (error.username === true && error.password === true) {
            handleLogin()
        }
    }, [validateCount, error.username, error.password])
    const [msg, setMsg] = useState(null)
    const handleLogin = async () => {
        setLoading(true)
        try {
            const params = { email: value.username, password: value.password }
            const res = await axiosInstance.post('/login', params)
            if (res.data.status) {
                setMsg('')
                const dataParam = {
                    login_id: res?.data.data.id,
                    name: res?.data.data.name,
                    email: res?.data?.data?.email,
                    role: res?.data.data.role,
                    token: res?.data.token,
                };
                encryptSessionStorageData('web-secret', dataParam, 'DoNotTryToAccess');
                setTimeout(() => {
                    navigate('/admin/dashboard')
                    setLoading(false)
                }, 2000);
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log("ADMINLOGIN",error)
            setMsg(error?.response?.data?.message)
        }
    }

    console.log("msg",msg)


    return (
        <>
            <div className="authentication-wrapper authentication-cover authentication-bg">
                <div className="authentication-inner row">
                    {/* /Left Text */}
                    <div className=" col-lg-4 mx-auto">
                        <div className="p-md-5 p-4 auth-cover-bg-color w-100 ">
                            <div className="w-100 mx-auto">
                                {/* Logo */}
                                <div className="app-logog mb-4 text-center">
                                    <Link to={'#'} className="app-brand-link gap-2">
                                        <img src={logo} alt="" />
                                    </Link>
                                </div>
                                {/* /Logo */}
                                <h3 className="mb-1 text-center">Welcome to Aksveda! 👋</h3>
                                <p className="mb-3 text-center">Please sign-in to your account.</p>
                                {   
                                msg &&
                                    <div class={`alert alert-danger alert-dismissible`} role="alert">
                                        <strong>Alert : </strong> {msg}
                                    </div>
                                }
                                <form className="mb-3" onSubmit={validate}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email or Username</label>
                                        <input type="text" className="form-control" id="email" name="username" onChange={handleChange} value={value.username} placeholder="Enter your email or username" autofocus />
                                        <span className='text-danger'>{error.username}</span>
                                    </div>
                                    <div className="mb-3 form-password-toggle">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label" htmlFor="password">Password</label>
                                            {/* <Link to={'/admin/forgot-password'}>
                                            <small>Forgot Password?</small>
                                        </Link> */}
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type={passToggle ? "text" : "password"} id="password" className="form-control" name="password" onChange={handleChange} value={value.password} placeholder="············" aria-describedby="password" />
                                            <span className="input-group-text cursor-pointer" onClick={() => setPassToggle(!passToggle)}><i className={`ti ${passToggle ? 'ti-eye' : 'ti-eye-off'}`} /></span>

                                        </div>
                                        <span className='text-danger'>{error.password}</span>
                                    </div>
                                    {/* <div className="mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="remember-me" />
                                        <label className="form-check-label" htmlFor="remember-me">
                                            Remember Me
                                        </label>
                                    </div>
                                </div> */}

                                    {
                                        loading ?
                                            <button className="btn btn-primary w-100 waves-effect waves-light" type="button">
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                                                Loading...
                                            </button>
                                            :
                                            <button className="btn btn-primary d-grid w-100 waves-effect waves-light">
                                                Sign in
                                            </button>
                                    }

                                </form>
                                {/* <div className="divider my-4">
                                <div className="divider-text">or</div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <Link to={'#'} className="btn btn-icon btn-label-facebook me-3">
                                    <i className="tf-icons fa-brands fa-facebook-f fs-5" />
                                </Link>
                                <Link to={'#'} className="btn btn-icon btn-label-google-plus me-3">
                                    <i className="tf-icons fa-brands fa-google fs-5" />
                                </Link>
                                <Link to={'#'} className="btn btn-icon btn-label-twitter">
                                    <i className="tf-icons fa-brands fa-twitter fs-5" />
                                </Link>
                            </div> */}
                            </div>
                        </div>
                    </div>
                    {/* /Left Text */}
                    {/* Login */}

                    {/* /Login */}
                </div>
            </div>
        </>

    )
}

export default Login