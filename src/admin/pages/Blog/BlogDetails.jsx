import React, { useEffect, useState } from 'react'
import { APICALL } from '../../../utility/api/api'
import HTMLContent from './../../../components/HTMLContent';
import ItemImg from '../../../components/admin/ItemImg';
import { timeAgo } from '../../../utility/Date';
import Spinner from '../../../components/admin/Spinner';
import { imgBaseURL } from '../../../utility/Utility';

const BlogDetails = ({ slug }) => {
    const [blogDetails, setBlogDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setLoading(true)
        const param = { slug: slug }
        const res = await APICALL('/get-blog', 'post', param)
        if (res?.status) {
            setBlogDetails(res?.data)
            setLoading(false)
        } else {
            setBlogDetails(null)
            setLoading(false)
        }
    }

    // console.log("blogDetails", blogDetails)
    return (
        <>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0 text-capitalize">{blogDetails?.title} </h3>
                <div>
                    <span>Created at : {timeAgo(blogDetails?.created_at)}</span> - <i className='fa fa-eye'></i> {blogDetails?.view}
                </div>
            </div>
            <div className="row row g-3 px-3 pb-4">
                <div className="col-12">
                    <>
                        <HTMLContent data={blogDetails?.desc} />
                    </>
                    <h6>Blog Cover</h6>
                    {
                        blogDetails?.cover ?
                            <img src={imgBaseURL() + blogDetails?.cover} alt='' style={{ height: '200px', width: '200px' }} />
                            :
                            <span>Blog cover not updated !</span>
                    }
                    <div className="box mt-3">
                        <h6>Blog Images</h6>
                        <div className="img-box d-flex gap-3">
                            {blogDetails?.images?.split(',')?.map((img, i) => (<img src={imgBaseURL() + img} alt='' style={{ height: '200px', width: '200px' }} />))}
                        </div>
                    </div>
                </div>
            </div>

            <Spinner sppiner={loading} />

        </>
    )
}

export default BlogDetails