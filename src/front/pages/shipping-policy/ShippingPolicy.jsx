import React from "react";
import HTMLContent from "../../../components/HTMLContent";

const ShippingPolicy = ({pageData}) => {
  return (
    <div className="privacy-policy">
      <section className="term-condition">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="text-center">
                <h1>{pageData?.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="innercontent-pages pt-4 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card term-card mb-0">
                <div className="card-body">
                  <div className="row">
                    <HTMLContent data={pageData?.content}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
