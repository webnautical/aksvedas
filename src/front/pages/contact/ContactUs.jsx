import React, { useState } from "react";
import HTMLContent from "../../../components/HTMLContent";
import { APICALL } from "../../../utility/api/api";
import { useFrontDataContext } from "../../../context/FrontContextProvider";

function ContactUs({ pageData }) {
  const { webAttr } = useFrontDataContext();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [msg, setMsg] = useState()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await APICALL('submit-query', 'post', formData)
      if (res?.status) {
        setMsg(<><span className="text-success"> <strong className="text-uppercase">{formData.f_name}</strong> Your Query Submited Succesfully.</span></>)
        setFormData({
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          message: "",
        });
        setLoading(false)
      } else {
        setMsg(<span className="text-danger"> <strong className="text-dark text-uppercase">{formData.f_name}</strong> Try Again.</span>)
        setLoading(false)
      }
    } catch (error) {
      setMsg(<span className="text-danger"> <strong className="text-dark text-uppercase">{formData.f_name}</strong> Something Wen't Wrong.</span>)
      setLoading(false)
    }

  };

  return (
    <>
      <div className="contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="content-inner">
                <h1>Get in Touch</h1>
                <HTMLContent data={pageData?.content} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-us-inner">
                <h2>For product related & other queries</h2>
                <p>
                  Please submit your question below and we will respond within 48
                  hours.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="firstName" className="form-label">
                        First Name*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="f_name"
                        maxLength={20}
                        value={formData.f_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="lastName" className="form-label">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="l_name"
                        value={formData.l_name}
                        onChange={handleChange}
                        maxLength={20}
                        required
                      />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="email" className="form-label">
                        Your Email*
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        maxLength={30}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="phone" className="form-label">
                        Phone*
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        maxLength={10}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-sm-12">
                      <label htmlFor="message" className="form-label">
                        Your Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        value={formData.message}
                        required
                        maxLength={1000}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      {msg}
                    </div>
                    <div className="mb-3 col-sm-5">
                      {
                        loading ? <>
                          <button className="apllynow" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                          </button>
                        </>
                          :
                          <button className="apllynow">Submit <i className="fa-solid fa-arrow-right"></i></button>
                      }
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="map-section">
        <iframe
          title="Map"
          src={webAttr?.map_url}
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
}

export default ContactUs;
