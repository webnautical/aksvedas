import React from 'react'
import Header from '../front/include/Header';
import Footer from '../front/include/Footer';

const FrontWeb = ({ cmp }) => {
    const Component = cmp;
    return (
        <>
            <Header />
            <Component />
            <Footer />
        </>
    )
}

export default FrontWeb