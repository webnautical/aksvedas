import React, { useEffect, useState } from "react";
import { getDataAPI, postDataAPI } from "../../../utility/api/api";
import Spinner from "../../../components/admin/Spinner";
import {
  imgBaseURL,
  toastifyError,
  toastifySuccess,
} from "../../../utility/Utility";
import ItemImg from "../../../components/admin/ItemImg";
import CKEditorCom from "../../../components/CKEditorCom";
import { validateRequired } from "../../../utility/Validate";
import HTMLContent from "../../../components/HTMLContent";
import ProductKnowledgeBase from "./ProductKnowledgeBase";
import ShopByConcern from "./ShopByConcern";
import ProductKBMobile from "./ProductKBMobile";
export const AyurvedExperience = () => {
  const [loading, setLoading] = useState();
  const [updData, setUpdData] = useState(null);
  const [page, setPage] = useState("");
  useEffect(() => {
    getDataFun();
    getPopupContentFun()
  }, []);
 
  const [value, setValue] = useState({
    title: "",
    desc: "",
    img1: "",
    img2: "",
  });
 
  useEffect(() => {
    if (updData?.id) {
      setValue({
        ...value,
        id: updData.id,
        title: updData.title,
        desc: updData.desc,
        img1: updData.img1,
        img2: updData.img2,
      });
    } else {
      setValue({
        ...value,
        title: "",
        desc: "",
        img1: "",
        img2: "",
      });
    }
  }, [updData]);
  const [errors, setErrors] = useState({});
 
  const getDataFun = async () => {
    try {
      setLoading(true);
      const res = await getDataAPI("get-ayurved-experience/ayurved-experience");
      if (res?.status) {
        setUpdData(res?.data[0]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [popupImg, setPopupImg] = useState({
    id: "",
    img1: "",
    imgPreview1: "",
  });
  const getPopupContentFun = async () => {
    try {
      setLoading(true);
      const res = await getDataAPI("get-ayurved-experience/home_popup");
      if (res?.status) {
        setPopupImg({...popupImg, 'id': res?.data[0]?.id, 'img1': res?.data[0]?.img1})
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  const [imgPreview, setImgPreview] = useState({
    img2: "",
  });
 
  const handleChange = (e) => {
 
    if (e.target.name === "img1") {
      setValue({ ...value, img1: e.target.files[0] });
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImgPreview({ ...imgPreview, img1: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === "img2") {
      setValue({ ...value, img2: e.target.files[0] });
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImgPreview({ ...imgPreview, img2: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }  else if (e.target.name === "popup_banner") {
      setPopupImg((prevValues) => {
        return { ...prevValues, ["img1"]: e.target.files[0] };
      });
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPopupImg((prevValues) => {
            return { ...prevValues, ["imgPreview1"]: e.target.result };
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };
 
  const handleEditorChange = (value) => {
    setValue((prevValues) => {
      return { ...prevValues, ["desc"]: value };
    });
  };
 
  const updateDashboardOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requiredVal = {
      title: value.title,
      img1: value.img1,
      desc: value.desc,
    };
    const validationErrors = validateRequired(requiredVal);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("id", value.id);
      formData.append("title", value.title);
      formData.append("desc", value.desc);
      formData.append("img1", value.img1);
      formData.append("img2", value.img2);
      const res = await postDataAPI("ayurved-experience", formData);
      if (res.status) {
        getDataFun();
        toastifySuccess(res.msg);
        setLoading(false);
        setPage("");
      } else {
        toastifyError("Something Went Wrong");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
 
  const updateHomePopup = async () => {
    setLoading(true);
    const requiredVal = {
      img1: popupImg.img1,
    };
    const validationErrors = validateRequired(requiredVal);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("id", popupImg.id);
      formData.append("img1", popupImg.img1);
      const res = await postDataAPI("ayurved-experience", formData);
      if (res.status) {
        getDataFun();
        toastifySuccess(res.msg);
        setLoading(false);
        setPage("");
      } else {
        toastifyError("Something Went Wrong");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
 
  return (
    <div className="content-wrapper">
      <div className="flex-grow-1 container-p-y">
        <h4 class="py-3 mb-2">
          <span class=" fw-light">Aksvedas /</span>Homepage Content
        </h4>
        <ShopByConcern />
 
        <div className="card mb-4">
          <div className="card-widget-separator-wrapper">
            <div className="card-body card-widget-separator">
              <div className="row gy-4 gy-sm-1">
                <div className="col-sm-12 col-lg-12">
                  <h5 className="d-flex justify-content-between">Popup Banner{" "}</h5>
                  <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">
 
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div class="file-uploader">
                          <label className="global_file_upload_deisgn"
                            for="popup_banner">
 
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              style={{ enableBackground: 'new 0 0 512 512' }}
                              xmlSpace="preserve"
                            >
                              <g>
                                <path
                                  d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                  fill="#a5a3ae"
                                ></path>
                              </g>
                            </svg>
 
                            <p className="m-0">Upload file Here</p>
                            <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                            <span class="image_class">Image Resolution: 1920 ×  1080 </span>
                            <input
                              className="form-control"
                              type="file"
                              onChange={handleChange}
                              name="popup_banner"
                              id="popup_banner"
                            />
                          </label>
                          <span className="errMsg">{errors.img1}</span>
                          <div className="d-flex justify-content-between align-items-center">
                          {popupImg?.imgPreview1 ? (
                            <div className="mt-1"><img style={{ width: '40px' }} src={popupImg?.imgPreview1} alt="" /></div>
                          ) : <ItemImg img={popupImg?.img1} />}
 
                        <button className="btn btn-primary btn-sm" onClick={()=>updateHomePopup()}>Update</button>
                          </div>
                        </div>
 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="card mb-4">
          <div className="card-widget-separator-wrapper">
            <div className="card-body card-widget-separator">
              <div className="row gy-4 gy-sm-1">
                <div className="col-sm-12 col-lg-12">
                  <h5 className="d-flex justify-content-between">
                    {" "}
                    Ayurved Experience{" "}
                    <button
                      className="icon_btn __warning mx-2"
                      type="button"
                      onClick={() => setPage("updateDashboard")}
                    >
                      <i className="fa fa-pencil" />
                    </button>
                  </h5>
                  <div className="justify-content-between align-items-start pe-3 pb-3 pb-sm-0 card-widget-3">
                    {page == "updateDashboard" ? (
                      <div className="upd-box">
                        <div className="row">
                          <div className="col-12 col-md-12">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              onChange={handleChange}
                              name="title"
                              value={value.title}
                              placeholder="Title"
                            />
                            <span className="errMsg">{errors.title}</span>
                          </div>
 
                          <div className="col-12 col-md-12 my-4">
                            <CKEditorCom
                              ckValue={value?.desc}
                              handleEditorChange={handleEditorChange}
                            />
                          </div>
 
                          <div className="col-12 col-md-6">
                            <div class="file-uploader">
                              <label className="global_file_upload_deisgn"
                                for="imagefirst">
 
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 32 32"
                                  style={{ enableBackground: 'new 0 0 512 512' }}
                                  xmlSpace="preserve"
                                >
                                  <g>
                                    <path
                                      d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                      fill="#a5a3ae"
                                    ></path>
                                  </g>
                                </svg>
 
                                <p className="m-0">Upload file Here</p>
                                <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                <span class="image_class">Image Resolution: 636PX ×  636PX </span>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={handleChange}
                                  name="img1"
                                  id="imagefirst"
                                />
                              </label>
                              <span className="errMsg">{errors.img1}</span>
                              {imgPreview?.img1 ? (
                                <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.img1} alt="" /></div>
                              ) : <ItemImg img={value?.img1} />}
                            </div>
                          </div>
 
                          <div className="col-12 col-md-6">
                            <div class="file-uploader">
                              <label
                                className="global_file_upload_deisgn"
                                for="imagesec"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 32 32"
                                  style={{ enableBackground: 'new 0 0 512 512' }}
                                  xmlSpace="preserve"
                                >
                                  <g>
                                    <path
                                      d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                      fill="#a5a3ae"
                                    ></path>
                                  </g>
                                </svg>
 
                                <p className="m-0">Upload file Here</p>
                                <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                                <span class="image_class">Image Resolution: 308PX ×  308PX </span>
 
                                <input
                                  className="form-control d-none"
                                  type="file"
                                  onChange={handleChange}
                                  name="img2"
                                  id="imagesec"
                                />
                              </label>
                              <span className="errMsg">{errors.img2}</span>
                              {imgPreview?.img2 ? (
                                <div className="mt-1"><img style={{ width: '40px' }} src={imgPreview?.img2} alt="" /></div>
                              ) : <ItemImg img={value?.img2} />}
                            </div>
                          </div>
                        </div>
 
                        <div className="btn-box mt-2 text-end">
                          <button
                            type="button"
                            className="btn btn-primary me-sm-3 me-1"
                            onClick={() => {
                              setPage(null);
                              setValue({ ...value, updData: updData?.offer });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={updateDashboardOffer}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="section_images">
                          <h4>{updData?.title}</h4>
                          <HTMLContent data={updData?.desc} />
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="images_list">
                                <img
                                  src={imgBaseURL() + updData?.img1}
                                  alt=""
                                  className="w-100"
                                />
                                <img
                                  src={imgBaseURL() + updData?.img2}
                                  alt=""
                                  className="w-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <ProductKnowledgeBase />

        <ProductKBMobile />
 
      </div>
      <div className="content-backdrop fade" />
      <Spinner sppiner={loading} />
    </div>
  );
};
 