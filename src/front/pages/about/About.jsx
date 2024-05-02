import { Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import aboutimg from "../../../assets/img/img-about.png";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import siderbg from "../../../assets/img/bg-about.png";
import Review from "../../../components/front/Review";

const About = () => {
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
            <Link underline="hover" href="/">
              Home
            </Link>
            <Typography>About Us</Typography>
          </Breadcrumbs>
          <h1>About Us</h1>
        </div>
      </div>
      <div className="about-us-content">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col-lg-6 mb-md-4 mb-2">
              <h2>About us</h2>
              <p>
                Lorem ipsum dolor sit am et, consectetur adipiscing elit. Etiam
                consequat ut ex vel finibus. Nunc eget molestie purus. Fusce
                imperdiet pulvinar est, eget fermentum nisi. Vestibulum ante
                ipsum primis in faucibus orci luctus et ultrices posuere cubilia
                curae Maecenas congue metus id turpis iaculis mattis. Sed
                pellentesque id arcu id scelerisque. Ut ullamcorper rutrum
                justo, at blandit eros maximus ut. Integer non tincidunt justo,
                rhoncus Aenean venenatis sed purus ac sollicitudin. Nulla mauris
                risus, commodo et luctus rutrum, lobortis sed mauris. Integer
                congue, sem elementum varius tristique, erat nulla rutrum risus,
                a imperdiet nulla lorem fermentum erat. Pellentesque elementum
                justo at velit fringilla, eu feugiat erat fermentum. Vivamus
                libero dolor, porta eget vehicula eu, iaculis id lacus. Sed
                interdum convallis sapien, eget faucibus sapien. Proin hendrerit
                lacus turpis. dolor, porta eget vehicula eu, iaculis id lacus.
                Sed interdum convallis sapien, eget faucibus sapien. Proin
                hendrerit lacus turpis.
              </p>
            </div>
            <div className="col-lg-6">
              <img src={aboutimg} alt="" />
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit am et, consectetur adipiscing elit. Etiam
            consequat ut ex vel finibus. Nunc eget molestie purus. Fusce
            imperdiet pulvinar est, eget fermentum nisi. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia
            curaeLorem ipsum dolor sit am et, consectetur adipiscing elit. Etiam
            consequat ut ex vel finibus. Nunc eget molestie purus. Fusce
            imperdiet pulvinar est, eget fermentum nisi. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae
            suere cubilia curaeLorem ipsum dolor sit am et, consectetur
            adipiscing elit. Etiam consequat ut ex vel finibus. Nunc eget
            molestie purus. Fusce imperdiet pulvinar est, eget fermentum nisi.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae
          </p>
          <p>
            Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id
            arcu id scelerisque. Ut ullamcorper rutrum justo, at blandit eros
            maximus ut. Integer non tincidunt justo, rhoncus Aenean venenatis
            sed purus ac sollicitudin. Nulla mauris risus, commodo et luctus
            rutrum, lobortis sed mauris. Integer congue, sem elementum varius
            tristique, erat nulla rutrum risus, a imperdiet nulla lorem
            fermentum erat. Pellentesque elementum justo at velit fringilla, eu
            feugiat erat fermentum. Vivamus libero dolor, porta eget vehicula
            eu, iaculis id lacus. Sed interdum convallis sapien, eget faucibus
            sapien. Proin hendrerit lacus turpis.
          </p>
          <p>
            Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id
            arcu id scelerisque. Ut ullamcorper rutrum justo, at blandit eros
            maximus ut. Integer non tincidunt justo, rhoncus Aenean venenatis
            sed purus ac sollicitudin. Nulla mauris risus, commodo et luctus
            rutrum, lobortis sed mauris. Integer congue, sem elementum varius
            tristique, erat nulla rutrum risus, a imperdiet nulla lorem
            fermentum erat. Pellentesque elementum justo at velit fringilla, eu
            feugiat erat fermentum. Vivamus libero dolor, porta eget vehicula
            eu, iaculis id lacus. Sed interdum convallis sapien, eget faucibus
            sapien. Proin hendrerit lacus turpis.
          </p>
        </div>
      </div>
      <Review />
    </>
  );
};

export default About;
