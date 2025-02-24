import React from 'react'
import { Link } from 'react-router-dom'
import pagenotfound from "../assets/img/pagenotfound.png"
import Header from '../front/include/Header'
import Footer from '../front/include/Footer'
const PageNotFound = () => {
    return (
        <>
            <Header />
            <section className="pageNotFound ">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <img src={pagenotfound} alt="" style={{ height: "250px", width: "250px", margin: "auto" }} />
                        <h1 className="m-0">404</h1>
                        <h2 className="mb-0">Oops! Page not found</h2>
                        <p className="text-gray-500 ">The page you are looking for doesn't exist or has been moved.</p>
                        <Link to="/shop/all" className="btn-2 w-100">
                            Go Shop <i class="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default PageNotFound