import React from 'react'
import { Link } from 'react-router-dom'
const PageHeaderCom = (props) => {
    const { pageTitle, modalBtn, modalBtnName, link, linkBtnName } = props
    return (
        <>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <div className="d-flex flex-column justify-content-center">
                    <h4 className="mb-1 mt-3">{pageTitle}</h4>
                    <p className="text-muted">{pageTitle}</p>
                </div>
                <div className="d-flex align-content-center flex-wrap gap-3">
                    {
                        modalBtn &&
                        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" className="btn btn-primary text-capitalize">{modalBtnName}</button>
                    }
                    {
                        link &&
                        <Link to={link} className="btn btn-primary text-capitalize">{linkBtnName}</Link>
                    }
                </div>
            </div>
        </>
    )
}

export default PageHeaderCom