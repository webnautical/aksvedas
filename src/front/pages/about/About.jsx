import { Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import aboutimg from "../../../assets/img/img-about.png";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import Review from "../../../components/front/Review";
import HTMLContent from "../../../components/HTMLContent";
import { imgBaseURL } from "../../../utility/Utility";

const About = ({ pageData }) => {
  return (
    <>
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
            <Link underline="hover" to="/"> Home </Link>
            <Typography>{pageData?.title}</Typography>
          </Breadcrumbs>
          <h1>{pageData?.title}</h1>
        </div>
      </div>
      {/* <div className="about-us-content">
        <div className="container">
          <div className="row term-card align-items-center mb-4">
            <HTMLContent data={pageData?.content} />
          </div>
        </div>
      </div> */}
      <div className="about-us-content">
        <div className="container">
          <div className="row  mb-4 align-items-center">
            <div className="col-lg-6 mb-md-0 mb-4">
              <HTMLContent data={pageData?.content} />
            </div>
            <div className="col-lg-6">
              <img src={imgBaseURL()+pageData?.image} alt="" />
            </div>
          </div>
          <HTMLContent data={pageData?.content_2} />
        </div>
      </div>
      <Review />
    </>
  );
};

export default About;