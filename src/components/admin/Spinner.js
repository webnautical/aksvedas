import React from 'react'

const Spinner = ({sppiner}) => {
    return (
        <div className={`loadingBox ${!sppiner ? 'd-none' : ''}`}>
            <div className="content">
                <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Spinner