import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { APICALL } from '../../../utility/api/api';
import Spinner from '../../../components/admin/Spinner';
import { timeAgo } from './../../../utility/Date';
import { generateSlug, toastifyError, toastifySuccess } from '../../../utility/Utility';
import ItemImg from '../../../components/admin/ItemImg';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import CKEditorCom from '../../../components/CKEditorCom';
import { SERVER_ERR, SOMETHING_ERR } from '../../../utility/Constants';
import { useFrontDataContext } from '../../../context/FrontContextProvider';
import BlogDetails from './BlogDetails';

const BlogCommentList = () => {
    const { page } = useParams()
    const pageTitle = page.replace(/-/g, ' ');
    const { categories } = useFrontDataContext()
    const navigate = useNavigate()
    const columns = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>Images</span>,
            selector: row => <span className='text-capitalize fw-bold d-flex'><>
                {row?.images?.split(',')?.map((img, i) => (<ItemImg img={img} />))}
            </> </span>,
        },
        {
            name: <span className='text-capitalize'>title</span>,
            selector: row => <span className='text-capitalize'><>{row.title || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>View</span>,
            selector: row => <><span className='text-wrap'>{row.view}</span></>,
        },
        {
            name: <span className='text-capitalize'>Category</span>,
            selector: row => <><span className='text-wrap'>{getCategoryName(row.category_id)}</span></>,
        },
        {
            name: <span className='text-capitalize'>status</span>,
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={parseInt(row.status)} onClick={() => changeStatus(row, 'change')} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: <span className='text-capitalize'>Created At</span>,
            selector: row => timeAgo(row.created_at),
        },
        {
            name: <span className='text-uppercase'>Actions</span>,
            cell: row => (
                <div className="dropdown">
                    <button className="dropdown-toggle btn btn-sm btn-icon hide-arrow shadow-none" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="true">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${row.id}`}>
                        <li className='m-0'><Link to={`/admin/blog/${row.slug}`} className='dropdown-item d-block p-3 w-100'>View Details </Link></li>
                        <li className='m-0'><Link to={`#`} onClick={() => changeStatus(row, 'delete')} className='dropdown-item d-block p-3 w-100'>Delete </Link></li>
                    </ul>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const commentsCol = [
        {
            name: <span className='text-capitalize'>#ID</span>,
            selector: row => <span className='text-capitalize fw-bold'><>#{row.id || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>name</span>,
            selector: row => <span className='text-capitalize'><>{row.name || '---'}</> </span>,
        },
        {
            name: <span className='text-capitalize'>email</span>,
            selector: row => <><span className='text-wrap'>{row.email}</span></>,
        },
        {
            name: <span className='text-capitalize'>message</span>,
            selector: row => <><span className='text-wrap'>{row.message}</span></>,
        },
        {
            name: <span className='text-capitalize'>status</span>,
            selector: row => <> <label className="switch switch-primary switch-sm me-4 pe-2">
                <input type="checkbox" className="switch-input" defaultChecked={parseInt(row.status)} onClick={() => changeStatus(row, 'comment')} />
                <span className="switch-toggle-slider">
                    <span className="switch-on">
                        <span className="switch-off" />
                    </span>
                </span>
            </label></>,
        },
        {
            name: <span className='text-capitalize'>Created At</span>,
            selector: row => timeAgo(row.created_at),
        },
        // {
        //     name: <span className='text-uppercase'>Actions</span>,
        //     cell: row => (
        //         <div className="dropdown">
        //             <button className="dropdown-toggle btn btn-sm btn-icon hide-arrow shadow-none" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="true">
        //                 <i class="fa-solid fa-ellipsis-vertical"></i>
        //             </button>
        //             <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${row.id}`}>
        //                 <li className='m-0'><Link to={`/admin/blog/${row.slug}`} className='dropdown-item d-block p-3 w-100'>View Details </Link></li>
        //                 <li className='m-0'><Link to={`#`} onClick={() => changeStatus(row, 'delete')} className='dropdown-item d-block p-3 w-100'>Delete </Link></li>
        //             </ul>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },
    ];


    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (page === 'all' || page === 'comments') {
            getListFun()
        }
    }, [page])

    const getListFun = async () => {
        setLoading(true)
        const param = page === 'all' ? { page: 'blog' } : {page}
        const res = await APICALL('/get-blog', 'post', param)
        if (res?.status) {
            setListData(res?.data)
            setLoading(false)
        } else {
            setListData([])
            setLoading(false)
        }
    }

    const changeStatus = async (data, type) => {
        setLoading(true)
        const param = {
            'id': data?.id,
            'type' : type == 'delete' ? type : type == 'comment' ? type : '',
            'status': data.status === 1 ? 0 : 1
        }
        const res = await APICALL('blog-change', 'post', param);
        if (res.status) {
            getListFun()
            toastifySuccess(res?.message)
            setLoading(false)
        } else {
            toastifyError(SOMETHING_ERR)
            setLoading(false)
        }
    }

    const [imgPreview, setImgPreview] = useState({
        cover: null,
        hover_img: null,
        images: [],
    });
    const [value, setValue] = useState({
        'title': '',
        'category_id': '',
        'slug': '',
        'sort_desc': '',
        'desc': '',
        'cover': '',
        'images': ''
    })

    const getCategoryName = (id) => {
        const res = categories.filter((item) => item.id == id)
        return res[0]?.name
    }

    const handleChange = (e) => {
        if (e.target.name === "title") {
            setValue({
                ...value,
                title: e.target.value,
                slug: generateSlug(e.target.value),
            });
        } else if (e.target.name === "cover") {
            setValue({ ...value, cover: e.target.files[0] });
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImgPreview({ ...imgPreview, cover: imageUrl });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }
    const handleEditorChange = (value) => {
        setValue((prevValues) => {
            return { ...prevValues, ["desc"]: value };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const files1 = Array.from(e.target.files);
        setValue({ ...value, images: [...value.images, ...files1] });
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        const newImages = imageUrls.map((url) => ({ src: url }));
        setImgPreview({
            ...imgPreview,
            images: [...imgPreview.images, ...newImages],
        });
    };
    const handleRemoveImage = (type, index) => {
        if (type === "cover") {
            setValue({ ...value, cover: "" });
            setImgPreview({ ...imgPreview, cover: null });
        } else if (type === "hover_img") {
            setValue({ ...value, hover_img: "" });
            setImgPreview({ ...imgPreview, hover_img: null });
        } else if (type === "images") {
            const updatedImages = imgPreview.images.filter(
                (imageUrl, i) => i !== index
            );
            setImgPreview({ ...imgPreview, images: updatedImages });

            const ids = [];
            const removedImageUrl = imgPreview.images[index].id;
            ids.push(removedImageUrl);
        }
    };

    const handlePageForm = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("title", value.title);
            formData.append("slug", value.slug);
            formData.append("desc", value.desc);
            formData.append("category_id", value.category_id);
            formData.append("cover", value.cover);
            value?.images?.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });
            const res = await APICALL(`/create-blog`, 'post', value);
            if (res?.status) {
                setValue({
                    ...value, 'title': '',
                    'category_id': '',
                    'slug': '',
                    'sort_desc': '',
                    'desc': '',
                    'cover': '',
                    'images': ''
                })
                setImgPreview({
                    ...imgPreview,
                    cover: null,
                    hover_img: null,
                    images: [],
                })
                toastifySuccess('Blog Created Successfully')
                navigate('/admin/blog/all')
                setLoading(false)
            } else {
                setLoading(false)

                toastifyError(SOMETHING_ERR)
            }
        } catch (error) {
            setLoading(false)
            toastifyError(SERVER_ERR)
        }
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="flex-grow-1 container-p-y">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <h4 class="py-3 mb-2">
                            <span class=" fw-light">Aksvedas /</span> Blog / <span className='text-capitalize'>{pageTitle}</span>
                        </h4>
                        {
                            page === 'all' &&
                            <div className="d-flex align-content-center flex-wrap gap-2">
                                <Link to={`/admin/blog/add`} className="btn btn-primary">Add Blog</Link>
                            </div>
                        }
                    </div>

                    <div className="card">
                        {
                            page === 'add' ?
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0 text-capitalize">{page}</h5>
                                    </div>
                                    <div className="row g-3 px-3 pb-4">
                                        <div className="col-sm-4">
                                            <label htmlFor="">Title</label>
                                            <input type="text" name='title' value={value.title} onChange={handleChange} className='form-control' placeholder='Title' />
                                        </div>
                                        <div className="col-sm-4">
                                            <label htmlFor="">Category</label>
                                            <select name="category_id" value={value.category_id} onChange={handleChange} className='form-control'>
                                                <option value="">Select Category</option>
                                                {
                                                    categories?.map((item, i) => (
                                                        <option value={item.id} key={i}>{item?.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4">
                                            <label htmlFor="">Slug</label>
                                            <input type="text" name='slug' value={value.slug} onChange={handleChange} className='form-control' placeholder='Slug' />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" htmlFor="ecommerce-product-barcode" > Content</label>
                                            <CKEditorCom ckValue={value?.desc} handleEditorChange={handleEditorChange} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor="">Blog Cover</label>
                                            <div className="img-box">
                                                <div className="file-uploader">
                                                    <label className="global_file_upload_deisgn" for="mediaone">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"
                                                            style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve"
                                                        >
                                                            <g><path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae" ></path>
                                                            </g>
                                                        </svg>

                                                        <p className="m-0">Upload file Here</p>
                                                        <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                        <input type="file" name="cover" id="mediaone" onChange={handleChange} />
                                                    </label>
                                                    <div class="preview_upload">
                                                        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                                            {imgPreview.cover && (
                                                                <img src={imgPreview.cover} alt="Cover Preview" />
                                                            )}
                                                            {imgPreview.cover && (
                                                                <button className="icon_btn __danger" onClick={() => handleRemoveImage("cover")}>
                                                                    <i className="fa fa-trash" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="">Blog Images</label>
                                            <div className="img-box">
                                                <div class="file-uploader">
                                                    <label className="global_file_upload_deisgn" for="mediathree">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            width="32" height="32" viewBox="0 0 32 32"
                                                            style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve"
                                                        >
                                                            <g><path d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z" fill="#a5a3ae" ></path>
                                                            </g>
                                                        </svg>

                                                        <p className="m-0">Upload file Here</p>
                                                        <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                                        <input type="file" id="mediathree" multiple onChange={handleImageChange} />
                                                    </label>

                                                    <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                                                        {imgPreview?.images?.map((item, index) => (
                                                            <div key={index} className="d-flex align-items-center" style={{ gap: "10px", flexDirection: 'column', position: 'relative' }} >
                                                                <img style={{ width: '60px' }} src={item?.src} alt="img" />
                                                                <button className="icon_btn __danger" style={{ position: 'absolute', bottom: '0px', right: '0px', borderRadius: '100%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                    onClick={() =>
                                                                        handleRemoveImage("images", index, item.id)
                                                                    }
                                                                >  <i className="fa fa-trash" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-end">
                                            <button type='button' onClick={() => handlePageForm()} className="btn btn-primary">Save Changes</button>
                                        </div>
                                    </div>
                                </>
                                :
                                (page !== 'all' && page !== 'comments') ?
                                    <>
                                        <BlogDetails slug={page} />
                                    </>
                                    :
                                    <>
                                        <div className="card-datatable table-responsive">
                                            <DataTable className='cs_table_inerr'
                                                columns={page === 'all' ? columns : commentsCol}
                                                data={listData}
                                                // dense
                                                highlightOnHover
                                                pagination
                                            />
                                        </div>
                                    </>
                        }

                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default BlogCommentList