import React, { useState, useEffect } from "react";
import siderbg from "../../../assets/img/sliderbg.png";
import blogsimg from "../../../assets/img/blogs (1).png";
import users from "../../../assets/img/revie-user.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Typography } from "@mui/material";
import { APICALL } from "../../../utility/api/api";
import FrontLoader from "../../../components/front/FrontLoader";
import { imgBaseURL, toastifyError } from "../../../utility/Utility";
import { timeAgo } from "../../../utility/Date";
import HTMLContent from "../../../components/HTMLContent";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
const BlogDetails = () => {
  const { slug } = useParams()
  const { categories } = useFrontDataContext()

  const navigate = useNavigate()
  useEffect(() => {
    getBlogDetailsFun()
    AOS.init();
  }, [slug]);

  const [blogDetails, setBlogDetails] = useState(null)
  const [commentList, setCommentList] = useState([])
  const [recentBlogList, setRecentBlogList] = useState([])
  const [loading, setLoading] = useState(false)
  const getBlogDetailsFun = async () => {
    setLoading(true)
    try {
      const param = { slug: slug }
      const res = await APICALL('/get-blog', 'post', param)
      if (res?.status) {
        setBlogDetails(res?.data)
        setRecentBlogList(res?.recentBlog)
        setCommentList(res?.data?.comments)
        setLoading(false)
      } else {
        navigate('/blog')
        setLoading(false)
      }
    } catch (error) {
      navigate('/blog')
    }
  }

  const [value, setValue] = useState({
    'blog_id': blogDetails?.id,
    'name': '',
    'email': '',
    'message': '',
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "message") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: value ? "" : "Required",
      }));
    } else if (name === "email") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: value ? "" : "Required",
      }));
    } else if (name === "name") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: value ? "" : "Required",
      }));
    }
  }

  const submitComment = async () => {
    if (value.name == '' || value.email == '' || value.message == '') {
      toastifyError('All field are requireds !!')
      return false
    }

    try {
      const params = { ...value, blog_id: blogDetails?.id }
      const res = await APICALL('/submit-comment', 'post', params)
      if (res?.status) {
        const arr = [...commentList, res?.data]
        setCommentList(arr)
        setValue({ ...value, 'blog_id': blogDetails?.id, 'name': '', 'email': '', 'message': '', })
        setLoading(false)
      } else {
        toastifyError("Something Wen't Wrong !!")
        setLoading(false)
      }
    } catch (error) {
      toastifyError("Something Wen't Wrong !!")
      setLoading(false)
    }
  }

  console.log("blogDetails",blogDetails)

  return (
    <>
      {loading && <FrontLoader />}
      <div
        className="innabout-section"
        style={{ backgroundImage: `url(${siderbg})` }}
      >
        <div className="container">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="breacrumb-custom py-md-3 py-2"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Link underline="hover" href="/">
              Home
            </Link>
            <Typography>Blog Details</Typography>
          </Breadcrumbs>
          <h1>Blog Details</h1>
        </div>
      </div>
      {/* <!-- blog-details-area --> */}
      <section className="blog-details-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details-wrap">
                <div className="blog-details-thumb">
                  <img src={blogDetails?.cover ? imgBaseURL() + blogDetails?.cover : blogsimg} alt="" />
                </div>
                <div className="blog-details-content">
                  <div className="blog-meta">
                    <ul className="list-wrap">
                      <li className="blog-author">
                        <Link to="#"> <i className="far fa-user"></i> Admin</Link>
                      </li>
                      <li><i className="far fa-clock"></i>{timeAgo(blogDetails?.created_at)} </li>
                      <li>
                        <Link to='#'>
                          <i className="far fa-comment"></i>{commentList?.length}
                        </Link>
                      </li>
                      <li>
                        <i className="far fa-eye"></i>{blogDetails?.view} Viewers
                      </li>
                    </ul>
                  </div>
                  <h2 className="title">{blogDetails?.title}</h2>

                  <HTMLContent data={blogDetails?.desc} />
                  <div className="blog-details-bottom"></div>
                </div>
              </div>

              <div className="comments-wrap">
                <h3 className="comments-wrap-title">Comments {commentList?.length}</h3>
                <div className="latest-comments">
                  <ul className="list-wrap">

                    {
                      commentList?.length > 0 &&
                      commentList?.map((item, i) => (
                        <li>
                          <div className="comments-box">
                            <div className="comments-avatar">
                              <img src={users} alt="img" />
                            </div>
                            <div className="comments-text">
                              <div className="avatar-name">
                                <h6 className="name"> {item?.name}{" "}</h6>
                                <span className="date">{timeAgo(item?.created_at)}</span>
                              </div>
                              <p>{item?.message}</p>
                            </div>
                          </div>
                        </li>
                      ))
                      // :
                      // <li><span>0 Comments</span></li>
                    }

                  </ul>
                </div>
              </div>


              <div className="contact-us-inner">
                <h2>Leave a message</h2>
                <div className="row">
                  <div className="mb-3 col-sm-6">
                    <label htmlFor="name" className="form-label">Name* </label>
                    <input type="text" className="form-control" id="name" name="name" value={value.name} onChange={handleChange} required />
                    <span className="errMsg">{errors.name}</span>
                  </div>
                  <div className="mb-3 col-sm-6">
                    <label htmlFor="email" className="form-label">Your Email* </label>
                    <input type="email" className="form-control" id="email" name="email" value={value.email} onChange={handleChange} required />
                    <span className="errMsg">{errors.email}</span>
                  </div>

                  <div className="mb-3 col-sm-12">
                    <label htmlFor="message" className="form-label">Your Message </label>
                    <textarea className="form-control" id="message" name="message" value={value.message} onChange={handleChange}></textarea>
                    <span className="errMsg">{errors.message}</span>
                  </div>
                  <div className="mb-3 col-sm-5">
                    <button className="apllynow" type="button" onClick={() => submitComment()}>
                      Submit <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

            </div>


            <div className="col-lg-4 mt-lg-0 mt-4">
              <aside className="blog-sidebar">
                {/* <div className="blog-widget">
                  <h4 className="widget-title">Search</h4>
                  <div className="sidebar-search">
                    <form action="#">
                      <input type="text" placeholder="Search your keyword" />
                      <button type="submit">
                        <i className="fas fa-search"></i>
                      </button>
                    </form>
                  </div>
                </div> */}

                {/* <div className="blog-widget">
                  <h4 className="widget-title">Categories</h4>
                  <div className="sidebar-cat-list">
                    <ul className="list-wrap">
                      {
                        categories?.map((item, i) => (
                          <li>
                            <Link to={`#`}>
                              {item?.name}
                            </Link>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div> */}

                <div className="blog-widget">
                  <h4 className="widget-title">Recent Posts</h4>
                  <div className="rc-post-wrap">
                    {
                      recentBlogList?.map((item, i) => (
                        <div className="rc-post-item">
                          <div className="thumb">
                            <Link to={`/blog-details/${item?.slug}`}>
                              <img src={item?.cover ? imgBaseURL() + item?.cover : blogsimg} alt="" />
                            </Link>
                          </div>
                          <div className="content">
                            <span className="date">{timeAgo(item?.created_at)}</span>
                            <h6 className="title">
                              <Link to={`/blog-details/${item?.slug}`}>
                                {item?.title}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
