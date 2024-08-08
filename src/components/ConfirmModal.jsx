import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ConfirmModal = (props) => {
    const { modalOpen, setModalOpen, msg, btn1, btn2, funCall, submitLoading, icon, cancelOrderStatus, setCancelOrderStatus } = props
    return (
        <>

            <Dialog
                open={modalOpen}
                onClose={() => { setModalOpen(false); setCancelOrderStatus({ ...cancelOrderStatus, 'modal': false }) }}
            >
                <>
                    <div className="col-12 text-end mt-2">
                        <Link to={'#'}  onClick={() => setModalOpen(false)} className='pe-2'> <i className='fa fa-times fa-lg'></i> </Link>
                    </div>
                </>
                <DialogContent className="pt-0 mx-md-5 py-5">
                    <div className="row mt-2 g-3">
                        <div className="col-12">
                            <div className="content-box text-center mx-md-5 mt-4">
                                {
                                    icon ?
                                        <i class="fa fa-exclamation-triangle text-danger" style={{ fontSize: '60px' }} aria-hidden="true"></i>
                                        :
                                        <i class="fa fa-check-circle text-success" aria-hidden="true" style={{ fontSize: '60px' }}></i>
                                }
                                {msg}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="justify-content-center">
                    <div className="row w-100">
                        <div className="col-md-12">
                            <div className="d-flex gap-2 text-center w-100">

                                {
                                    btn2 &&
                                    <button type="button" className="btn-2 w-100 mb-3" onClick={() => setModalOpen(false)}>
                                        {btn2}
                                    </button>
                                }

                                {
                                    !submitLoading ?
                                        <>
                                            {
                                                btn1 &&
                                                <button type="button" className="btn-2 w-100 mb-3" onClick={() => funCall()}>
                                                    {btn1}
                                                </button>
                                            }
                                        </>
                                        :
                                        <button type="button" className="btn-2 w-100 mb-3" >
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmModal