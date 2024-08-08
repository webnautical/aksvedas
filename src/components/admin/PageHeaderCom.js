import React from 'react'
import { Link } from 'react-router-dom'
const PageHeaderCom = (props) => {
    const { pageTitle, modalBtn, modalBtnName, link, linkBtnName } = props
    return (
            <div class="row mb-3">
                <div class="col-12">
                    <div class="card tt-page-header">
                        <div class="card-body d-lg-flex align-items-center justify-content-lg-between">
                            <div class="tt-page-title">
                                <h2 class="h5 mb-lg-0">{pageTitle}</h2>
                            </div>
                            <div class="tt-action">
                            {
                        modalBtn &&
                        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" className="btn btn-primary text-capitalize">{modalBtnName}</button>
                    }
                    {
                        link &&
                        <Link to={link} className="btn btn-primary text-capitalize"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> {linkBtnName}</Link>
                    }
                                 </div>
                        </div>
                    </div>
                </div>
            </div>

            
    )
}

export default PageHeaderCom