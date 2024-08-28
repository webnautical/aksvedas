import React, { useEffect, useState } from "react";
import siderbg from "../../../assets/img/sliderbg.png";
import blogsimg from "../../../assets/img/blogs (1).png";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Review from "../../../components/front/Review";
import { Breadcrumbs, Typography } from "@mui/material";
import { APICALL } from "../../../utility/api/api";
import { useFrontDataContext } from "../../../context/FrontContextProvider";
import FrontLoader from "../../../components/front/FrontLoader";
import { imgBaseURL } from "../../../utility/Utility";
const Blog = () => {
  const { categories } = useFrontDataContext()

  useEffect(() => {
    AOS.init();
    getListFun()
  }, []);

  const [loading, setLoading] = useState([])
  const [listData, setListData] = useState([])

  const getListFun = async () => {
    setLoading(true)
    const param = { page: 'front' }
    const res = await APICALL('/get-blog', 'post', param)
    if (res?.status) {
      setListData(res?.data)
      setLoading(false)
    } else {
      setListData([])
      setLoading(false)
    }
  }
  const getCategoryName = (id) => {
    const res = categories.filter((item) => item.id == id)
    return res[0]?.name
  }
  console.log("listData", listData)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  };

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
            <Typography>Blog</Typography>
          </Breadcrumbs>
          <h1>Blog</h1>
        </div>
      </div>
      <section className="our_blogs">
        <div className="container">
          <div className="row">
            {
              listData?.length > 0 ?
                listData?.map((item, i) => (
                  <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-lg-5 mb-4">
                    <div className="Blogs_box">
                      <div className="blogs_img w-100">
                        <Link to={`/blog-details/${item?.slug}`}>
                          <img src={item?.cover ? imgBaseURL() + item?.cover : blogsimg} alt="blog_img" className="img-fluid" />
                        </Link>
                      </div>
                      <div className="poster_details">
                        <p>
                          {getCategoryName(item?.category_id)} <span className="mx-1"> | </span> Post by{" "}
                          <span className="highlight_txt">Admin</span>
                        </p>
                      </div>
                      <Link to={`/blog-details/${item?.slug}`}>
                        <h2>{item?.title}</h2>
                      </Link>

                      <Link to={`/blog-details/${item?.slug}`} className="global_no_bg_btn">
                        Read More <i className="fa-solid fa-chevron-right"></i>
                      </Link>

                      <div className="date_tag">
                        <div className="date">{formatDate(item?.created_at)?.day}</div>
                        <div>{formatDate(item?.created_at)?.month}</div>
                      </div>
                    </div>
                  </div>
                ))
                :
                <>
                  <div className="col-12">
                    <h5>There are no blog to display !</h5>
                  </div>
                </>
            }
          </div>

          {/* <nav className="page-padingtion navigation mt-md-5 mt-4">
            <ul className="pagination justify-content-center">
              <li className="page-item left">
                <Link className="page-link" href="#" aria-label="Previous">
                  <i className="fa fa-arrow-left"></i>
                </Link>
              </li>
              <li className="page-item acitve">
                <Link className="page-link" href="#">01</Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="#">02</Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="#">03</Link>
              </li>
              <li className="page-item next">
                <Link className="page-link" href="#" aria-label="Next">
                  <i className="fa fa-arrow-right"></i>
                </Link>
              </li>
            </ul>
          </nav> */}


        </div>
      </section>
    </>
  );
};

export default Blog;
