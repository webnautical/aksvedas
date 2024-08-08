import React from 'react'
import { imgBaseURL } from '../../../../utility/Utility'

const MultiPageData = (props) => {
    const { contentData, page, setUpdData } = props
    const handleAction = (item, action) => {
        const data = {...item, action}
        setUpdData(data)
    }

    return (
        <>
            <div className="row my-3" style={{ borderTop: '1px solid rgb(236, 236, 236)' }}>
                {
                    contentData.length > 0 ?
                        contentData.map((item, i) => (
                            <div className="col-12">
                                <div className='main_box_product_conent'>
                                    <div className="row justify-content-between ">
                                    <div className='col-md-1'>
                                    <div style={{ backgroundColor:'#ececec'}}>
                                    <img src={imgBaseURL() + item.img} alt="" />
                                    </div>
                                        </div>
                                        <div className='col-md-11'>
                                            <h4>
                                                {i + 1}. {item?.title}

                                            </h4>
                                            <div style={{textAlign: 'justify'}} dangerouslySetInnerHTML={{ __html: item?.desc }} />
                                            <div className='text-end'>
                                                <button
                                                    onClick={() => handleAction(item, 'edit')} 
                                                    className='icon_btn __warning me-2' type="button" data-bs-toggle="offcanvas" data-bs-target="#productContents" aria-controls="productContents">Edit <i className='fa fa-pencil' /></button>

                                                <button className='icon_btn __danger' type="button"
                                                onClick={() => handleAction(item, 'delete')}
                                                >Remove <i className='fa fa-trash' /></button>
                                            </div>
                                        </div>
                                   
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <div className='col-12 mt-5 text-center'>
                            <h5>There are no {page.replace(/-/g, ' ')} added on this product</h5>
                        </div>
                }
            </div>
        </>
    )
}

export default MultiPageData