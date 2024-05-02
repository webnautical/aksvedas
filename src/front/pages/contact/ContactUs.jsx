import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form after submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <>
    <div className="contact-us">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="content-inner">
              <h1>Get in Touch</h1>
              <p>
                Our customer support and account management teams provide the
                best service in the industry. We're passionate about our
                products as well as our customers and it shows in the level of
                service that we provide. Fill out the Contact Us form and we
                will respond within a couple hours if not sooner. If during
                working hours you can also click on Live Chat and start a
                conversation with one of our helpful team members. If you are a
                business or healthcare facility looking to speak to a sales
                representative about volume pricing, help with a quote or any
                other questions please send an email to{" "}
                <a href="mailto:info@aksveda.com">info@aksveda.com</a> and an
                account specialist will respond promptly.
              </p>
              <h2>Contact Information</h2>
              <ul>
                <li>
                  <i className="fa fa-phone-volume"></i>
                  <a href="tel:+919999999999">+91 999 999 9999</a>
                </li>
                <li>
                  <i className="fa fa-envelope"></i>

                  <a href="mailto:support@aksvedas.com">support@aksvedas.com</a>
                </li>
                <li>
                  <i className="fa fa-location-dot"></i>
                  C24-D, Patel Nagar, Near Stadium, Jaipur, Rajasthan 302001
                </li>
              </ul>
              <h2>Working Hours</h2>
              <ul>
                <li>Monday - Saturday: 8 AM - 7 PM</li>
                <li>Sunday: Closed</li>
              </ul>
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
                    name="firstName"
                    value={formData.firstName}
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
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-3 col-sm-5">
               <button className="apllynow">Submit <i className="fa-solid fa-arrow-right"></i></button>
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
       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.1497894314664!2d75.78520031438136!3d26.892785983149113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4a651bdfe6c9%3A0x12e85c7a6a95a47b!2sPatel%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302101!5e0!3m2!1sen!2sin!4v1647650131788!5m2!1sen!2sin"
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
