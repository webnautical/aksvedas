import React from 'react'

export const LoadingBTN = () => {
    return (
        <>
            <button type="button" className="btn btn-primary me-sm-3 me-1" >
                <div class="spinner-border " role="status">
                    <span class="sr-only">Loading...</span>
                </div></button>
        </>
    )
}
