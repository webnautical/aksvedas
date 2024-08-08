import React, { useEffect, useState } from "react";
import PageHeaderCom from "../../../components/admin/PageHeaderCom";
import CKEditorCom from "../../../components/CKEditorCom";
import {
  defaultUserIMG,
  generateSlug,
  toastifyError,
  toastifySuccess,
  imgBaseURL,
  stringToArray,
  textSlice,
} from "./../../../utility/Utility";
import { useDataContext } from "../../../context/ContextProvider";
import { getDataAPI, postDataAPI } from "../../../utility/api/api";
import { validateRequired } from "../../../utility/Validate";
import { useLocation, useNavigate } from "react-router";
import { LoadingBTN } from "./../../../components/admin/LoadingBTN";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const AddProduct = () => {
  const navigate = useNavigate();
  const { categories, brand, attrVal } = useDataContext();
  const [attrValList, setAttrValList] = useState([]);
  const [productDrpList, setProductDrpList] = useState([]);
  const info = useLocation();
  const productDetails = info?.state ? info?.state.productDetails : null;
  const [allProductList, setAllProductList] = useState([])
  useEffect(() => {
    getProductDrpFun();
    if (attrVal?.length > 0) {
      setAttrValList(attrVal);
    }
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);
  const handleSubmitTag = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    setTags([...tags, inputValue]);
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  const [subscriptionVal, setSubscriptionVal] = useState([
    { days: 30, price: 0, discount: 0, sale_price: 0 },
    { days: 60, price: 0, discount: 0, sale_price: 0 },
    { days: 90, price: 0, discount: 0, sale_price: 0 }
  ]);
  const [value, setValue] = useState({
    title: "",
    sku: "",
    slug: "",
    hsn: "",
    gst_rate: "",
    quantity: "",
    description: "",
    cover: "",
    hover_img: "",
    product_img: [],
    price: "",
    sale_price: "",
    product_type: "1",
    category_id: "",
    product_items_id: "",
    related_product_ids: "",
    brand_id: "",
    attr_id: "",
    attrVal_id: "",
  });
  const [selectedBundleProducts, setSelectedBundleProducts] = useState([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState([]);

  const [imgPreview, setImgPreview] = useState({
    cover: null,
    hover_img: null,
    images: [],
  });
  const [productIMGIDs, setProductIMGIDs] = useState([]);

  const [submitLoading, setsubmitLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productDetails?.id) {
      setValue({
        ...value,
        id: productDetails?.id,
        title: productDetails?.name,
        sku: productDetails?.sku,
        hsn: productDetails?.hsn,
        gst_rate: productDetails?.gst_rate,
        quantity: productDetails?.quantity,
        slug: productDetails?.slug,
        description: productDetails?.description,
        cover: productDetails?.cover,
        hover_img: productDetails?.hover_img,
        product_img: productDetails?.product_images,
        price: productDetails?.price,
        sale_price: productDetails?.sale_price,
        product_type: productDetails?.product_type,
        category_id: stringToArray(productDetails?.category_id),
        related_product_ids: stringToArray(productDetails?.related_product_ids),
        product_items_id: stringToArray(
          productDetails?.product_bundle?.product_items_id
        ),
        brand_id: productDetails?.brand_id,
      });
      const tagsArray = productDetails?.tags?.split?.(',')?.map(tag => tag?.trim()) || [];
      setTags(tagsArray);
      const img = [];
      productDetails.product_images.forEach((item) => {
        img.push({ src: imgBaseURL() + item.src, id: item?.id });
      });
      setImgPreview({
        ...imgPreview,
        cover: imgBaseURL() + productDetails.cover,
        hover_img: imgBaseURL() + productDetails.hover_img,
        images: img,
      });
      setSubscriptionVal(productDetails?.product_subscription)
    } else {
      setValue({
        ...value,
        title: "",
        sku: "",
        slug: "",
        hsn: "",
        gst_rate: "",
        quantity: "",
        description: "",
        cover: "",
        hover_img: "",
        product_img: [],
        price: "",
        sale_price: "",
        product_type: "1",
        category_id: "",
        brand_id: "",
      });
    }
  }, [productDetails]);


  const handleChange = (e) => {
    if (e.target.name === "cover") {
      setValue({ ...value, cover: e.target.files[0] });
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImgPreview({ ...imgPreview, cover: imageUrl });
    } else if (e.target.name === "hover_img") {
      setValue({ ...value, hover_img: e.target.files[0] });
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImgPreview({ ...imgPreview, hover_img: imageUrl });
    } else if (e.target.name === "title") {
      setValue({
        ...value,
        title: e.target.value,
        slug: generateSlug(e.target.value),
      });
    } else if (e.target.name === "attr_id") {
      setValue({ ...value, attr_id: e.target.value });
      const res = attrVal.filter((item) => item.attribute_id == e.target.value);
      setAttrValList(res);
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEditorChange = (value) => {
    setValue((prevValues) => {
      return { ...prevValues, ["description"]: value };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const files1 = Array.from(e.target.files);
    setValue({ ...value, product_img: [...value.product_img, ...files1] });
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
      setProductIMGIDs((prevIDs) => [...prevIDs, ...ids]);
    }
  };
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    const existingCategoryIds = Array.isArray(value.category_id)
      ? value.category_id
      : [];
    const newCategoryIds = typeof value === "string" ? value.split(",") : value;

    const mergedCategoryIds = [...existingCategoryIds, ...newCategoryIds];

    setValue((prevValue) => ({
      ...prevValue,
      category_id: mergedCategoryIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skuExists = allProductList.some(product => product.sku === value.sku);
    if (skuExists) {
      toastifyError("SKU already exists!")
      return false
    }

    setsubmitLoading(true);
    const simpleProductRequired = {
      title: value.title,
      price: value.price,
      sale_price: value.sale_price,
      cover: value.cover,
    };
    const variantProductRequired = { title: value.title, cover: value.cover };
    const validationErrors = validateRequired(
      value.product_type === "1"
        ? simpleProductRequired
        : variantProductRequired
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("product_type", value.product_type);
      formData.append("title", value.title);
      formData.append("slug", value.slug);
      formData.append("sku", value.sku);
      formData.append("hsn", value.hsn);
      formData.append("gst_rate", value.gst_rate);
      formData.append("quantity", value.quantity);
      formData.append("description", value.description);
      formData.append("price", value.price);
      formData.append("sale_price", value.sale_price);
      formData.append("category_id", value.category_id);
      formData.append("tags", tags);
      formData.append("brand_id", value.brand_id);
      formData.append("bundle_items", value.product_items_id);
      formData.append("related_product_ids", value.related_product_ids);
      formData.append("subscriptionVal", JSON.stringify(subscriptionVal));
      formData.append("cover", value.cover);
      formData.append("hover_img", value.hover_img);
      value?.product_img?.forEach((file, index) => {
        formData.append(`product_img[${index}]`, file);
      });
      const res = await postDataAPI("product", formData);
      if (res.status) {
        toastifySuccess(res.msg);
        setsubmitLoading(false);
        navigate("/admin/products");
      } else if (res?.error?.slug?.length > 0) {
        toastifyError(res?.error?.slug[0]);
        setsubmitLoading(false);
      } else {
        toastifyError("Something Went Wrong");
        setsubmitLoading(false);
      }
    } else {
      setsubmitLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const isUpdating = value.id !== undefined;
    const skuExists = allProductList.some(product => {
      if (isUpdating) {
        return product.sku === value.sku && product.id !== value.id;
      } else {
        return product.sku === value.sku;
      }
    });

    if (skuExists) {
      toastifyError("SKU already exists!");
      return false;
    }

    setsubmitLoading(true);
    const simpleProductRequired = {
      title: value.title,
      price: value.price,
      sale_price: value.sale_price,
      cover: value.cover,
    };
    const variantProductRequired = { title: value.title, cover: value.cover };
    const validationErrors = validateRequired(
      value.product_type === "1"
        ? simpleProductRequired
        : variantProductRequired
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("id", value.id);
      formData.append("product_type", value.product_type);
      formData.append("title", value.title);
      formData.append("slug", value.slug);
      formData.append("hsn", value.hsn);
      formData.append("gst_rate", value.gst_rate);
      formData.append("quantity", value.quantity);
      formData.append("sku", value.sku);
      formData.append("description", value.description);
      formData.append("price", value.price);
      formData.append("sale_price", value.sale_price);
      formData.append("category_id", value.category_id);
      formData.append("tags", tags);
      formData.append("bundle_items", value.product_items_id);
      formData.append("related_product_ids", value.related_product_ids);
      formData.append("brand_id", value.brand_id);
      formData.append("subscriptionVal", JSON.stringify(subscriptionVal));
      formData.append("cover", value.cover);
      formData.append("hover_img", value.hover_img);
      value?.product_img?.forEach((file, index) => {
        formData.append(`product_img[${index}]`, file);
      });
      productIMGIDs?.forEach((item, index) => {
        formData.append(`product_img_ids[${index}]`, item);
      });
      const res = await postDataAPI("update-product", formData);
      if (res.status) {
        toastifySuccess(res.msg);
        setsubmitLoading(false);
        navigate("/admin/products");
      } else if (res?.error?.slug?.length > 0) {
        toastifyError(res?.error?.slug[0]);
        setsubmitLoading(false);
      } else {
        toastifyError("Something Went Wrong");
        setsubmitLoading(false);
      }
    } else {
      setsubmitLoading(false);
    }
  };

  const getProductDrpFun = async () => {
    const res = await getDataAPI("/get-product");
    if (res?.status) {
      setAllProductList(res?.data)
      const pro = res?.data.filter(
        (item) => item.product_type === 1 && item.status === 1
      );
      setProductDrpList(pro);
      if (productDetails?.product_bundle) {
        const idsss = stringToArray(
          productDetails?.product_bundle?.product_items_id
        );
        const filteredProducts = res?.data.filter((product) =>
          idsss.includes(product.id)
        );
        const drp = filteredProducts?.map((item) => ({
          value: item.id,
          label: item.name,
          sku: item.sku,
          price: item.sale_price,
        }));
        setSelectedBundleProducts(drp);
      }
      if (productDetails?.related_product_ids) {
        const idsss = stringToArray(
          productDetails?.related_product_ids
        );
        const filteredProducts = res?.data.filter((product) =>
          idsss.includes(product.id)
        );
        const drp = filteredProducts?.map((item) => ({
          value: item.id,
          label: item.name,
          sku: item.sku,
          price: item.sale_price,
        }));
        setSelectedRelatedProducts(drp);
      }
    } else {
      setProductDrpList([]);
    }
  };

  const getProductOptions = () => {
    const drp = productDrpList?.map((item) => ({
      value: item.id,
      label: item.name,
      sku: item.sku,
      price: item.sale_price,
    }));
    return drp;
  };

  const handleProductDrpChange = (e) => {
    setSelectedBundleProducts((prevState) => [...prevState, e]);

    setValue((prevValue) => ({
      ...prevValue,
      product_items_id: [...prevValue.product_items_id, e.value],
    }));

    setValue((prevValue) => ({
      ...prevValue,
      price: (parseInt(prevValue?.price) || 0) + parseInt(e?.price),
    }));
  };

  const handleRemoveBundleProduct = (index, item, type) => {
    if (type === 'bundle') {
      setSelectedBundleProducts((prevState) => {
        const updatedProducts = [...prevState];
        updatedProducts.splice(index, 1);
        return updatedProducts;
      });
      setValue((prevValue) => ({
        ...prevValue,
        price: parseInt(prevValue.price) - parseInt(item.price),
      }));

      setValue((prevValue) => ({
        ...prevValue,
        product_items_id: prevValue.product_items_id.filter(
          (id) => id !== item.value
        ),
      }));
    } else {
      setSelectedRelatedProducts((prevState) => {
        const updatedProducts = [...prevState];
        updatedProducts.splice(index, 1);
        return updatedProducts;
      });
      setValue((prevValue) => ({
        ...prevValue,
        related_product_ids: prevValue.related_product_ids.filter(
          (id) => id !== item.value
        ),
      }));
    }
  };

  const handleRelatedProductDrpChange = (e) => {
    setSelectedRelatedProducts((prevState) => [...prevState, e]);
    setValue((prevValue) => ({
      ...prevValue,
      related_product_ids: [...prevValue.related_product_ids, e.value],
    }));
  };


  const handleSubscriptionChange = (e, index, field) => {
    const value = parseFloat(e.target.value) || 0;
    const newSubscriptions = [...subscriptionVal];
    newSubscriptions[index][field] = value;

    if (field === 'price' || field === 'discount') {
      const price = newSubscriptions[index].price;
      const discount = newSubscriptions[index].discount;
      newSubscriptions[index].sale_price = price - (price * discount / 100);
    }

    if (field === 'sale_price') {
      const price = newSubscriptions[index].price;
      const salePrice = newSubscriptions[index].sale_price;
      newSubscriptions[index].discount = price && ((price - salePrice) / price * 100).toFixed(2);
    }

    setSubscriptionVal(newSubscriptions);
  };


  return (
    <>
      <div className="content-wrapper">
        <div className="flex-grow-1 pt-3">
          <div className="app-ecommerce">
            {/* <PageHeaderCom pageTitle={value.id ? 'Update Product' : 'Add Product'} link={'/admin/products'} linkBtnName='Product List' /> */}
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-tile mb-0">Product information</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3 col ecommerce-select2-dropdown">
                      <label className="form-label mb-1" htmlFor="brand">
                        Product Type
                      </label>
                      <select
                        name="product_type"
                        value={value.product_type}
                        onChange={handleChange}
                        className="form-select text-uppercase"
                      >
                        <option value={1}>{"Simple"}</option>
                        <option value={2}>{"Variant"}</option>
                        <option value={3}>{"Bundle"}</option>
                        <option value={4}>{"Subscription"}</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="ecommerce-product-name"
                      >
                        Product Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product title"
                        name="title"
                        onChange={handleChange}
                        value={value.title}
                        aria-label="Product title"
                      />{" "}
                      <span className="errMsg">{errors.title}</span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="slug"
                        value={value.slug}
                        className="form-control"
                        placeholder="Enter slug"
                        aria-label="slug"
                      />
                      <span className="errMsg">{errors.slug}</span>
                    </div>
                    {value.product_type == "3" && (
                      <>
                        <div className="mb-3 col ecommerce-select2-dropdown">
                          <label
                            className="form-label mb-3 d-flex justify-content-between align-items-center"
                            htmlFor="category-org"
                          >
                            <span>Product</span>
                          </label>
                          <Autocomplete
                            className="mui_edit_select mt-2"
                            options={getProductOptions()}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, selectedOption) =>
                              handleProductDrpChange(selectedOption)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select"
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                        <div className="mb-3 col ecommerce-select2-dropdown">
                          {selectedBundleProducts?.map((item, i) => (
                            <div className="select-p-box d-flex justify-content-between mb-2">
                              <p className="m-0">
                                {" "}
                                {textSlice(item?.label, 70)}
                              </p>
                              <span>
                                ₹{item?.price}
                                <button
                                  className="icon_btn __danger ms-1"
                                  onClick={() =>
                                    handleRemoveBundleProduct(i, item, 'bundle')
                                  }
                                >
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <>
                      <div className="mb-3 col ecommerce-select2-dropdown">
                        <label
                          className="form-label mb-3 d-flex justify-content-between align-items-center"
                          htmlFor="category-org"
                        >
                          <span>Frequently Bought Together</span>
                        </label>
                        <Autocomplete
                          className="mui_edit_select mt-2"
                          options={getProductOptions()}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, selectedOption) =>
                            handleRelatedProductDrpChange(selectedOption)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="mb-3 col ecommerce-select2-dropdown">
                        {selectedRelatedProducts?.map((item, i) => (
                          <div className="select-p-box d-flex justify-content-between mb-2">
                            <p className="m-0">
                              {" "}
                              {textSlice(item?.label, 70)}
                            </p>
                            <span>
                              ₹{item?.price}
                              <button
                                className="icon_btn __danger ms-1"
                                onClick={() =>
                                  handleRemoveBundleProduct(i, item, 'related')
                                }
                              >
                                <i class="fa-solid fa-trash"></i>
                              </button>
                            </span>
                          </div>
                        ))}
                      </div>
                    </>

                    <div className="row mb-3">
                      <div className="col-12 col-md-6">
                        <label
                          className="form-label"
                          htmlFor="ecommerce-product-sku"
                        >
                          SKU
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="SKU"
                          name="sku"
                          onChange={handleChange}
                          value={value.sku}
                          aria-label="Product SKU"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label
                          className="form-label"
                          htmlFor="ecommerce-product-sku"
                        >
                          Quantity
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Quantity"
                          name="quantity"
                          onChange={handleChange}
                          value={value.quantity}
                          aria-label="Product SKU"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label
                        className="form-label"
                        htmlFor="ecommerce-product-barcode"
                      >
                        Description
                      </label>
                      <CKEditorCom
                        ckValue={value?.description}
                        handleEditorChange={handleEditorChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 card-title">Media</h5>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 mt-2">
                        <div className="img-box">
                          <div className="file-uploader">
                            <label
                              className="global_file_upload_deisgn"
                              for="mediaone"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.1"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                xmlSpace="preserve"
                              >
                                <g>
                                  <path
                                    d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                    fill="#a5a3ae"
                                  ></path>
                                </g>
                              </svg>

                              <p className="m-0">Upload Cover Image Here</p>
                              <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                              <span className="image_class" style={{ fontWeight: '400!important', fontSize: '14px!important' }}>Image Resolution: 1024 ×  1024 </span>
                              <input
                                type="file"
                                name="cover"
                                id="mediaone"
                                onChange={handleChange}
                              />
                            </label>
                            <div class="preview_upload">
                              <h4>Cover Preview</h4>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "10px" }}
                              >
                                {imgPreview.cover && (
                                  <img
                                    src={imgPreview.cover}
                                    alt="Cover Preview"
                                  />
                                )}
                                {imgPreview.cover && (
                                  <button
                                    className="icon_btn __danger"
                                    onClick={() => handleRemoveImage("cover")}
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <span className="errMsg">{errors.cover}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 mt-2">
                        <div className="img-box">
                          <div className="file-uploader">
                            <label
                              className="global_file_upload_deisgn"
                              for="mediatwo"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.1"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                xmlSpace="preserve"
                              >
                                <g>
                                  <path
                                    d="M30 22h-4v4H6v-4H2v8h28zM18 22V8.302l4.867 3.346 2.266-3.296L16 2.072l-9.133 6.28 2.266 3.296L14 8.302V22z"
                                    fill="#a5a3ae"
                                  ></path>
                                </g>
                              </svg>

                              <p className="m-0">Upload Hover Image Here</p>
                              <span>(Image (JPG, JPEG, PNG) and only 2mb)</span>
                              <span className="image_class" style={{ fontWeight: '400!important', fontSize: '14px!important' }}>Image Resolution: 1024 ×  1024 </span>
                              <input
                                type="file"
                                name="hover_img"
                                id="mediatwo"
                                onChange={handleChange}
                              />
                            </label>
                            <div class="preview_upload">
                              <h4>Hover Image Preview</h4>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "10px" }}
                              >
                                {imgPreview.hover_img && (
                                  <img
                                    src={imgPreview.hover_img}
                                    alt="hover_img Preview"
                                  />
                                )}
                                {imgPreview.hover_img && (
                                  <button
                                    className="icon_btn __danger"
                                    onClick={() => handleRemoveImage("hover_img")}
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="img-box mt-4">
                      <div class="file-uploader">
                        <label
                          className="global_file_upload_deisgn"
                          for="mediathree"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            style={{ enableBackground: "new 0 0 512 512" }}
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
                          <span className="image_class" style={{ fontWeight: '400!important', fontSize: '14px!important' }}>Image Resolution: 1024 ×  1024 </span>
                          <input
                            type="file"
                            id="mediathree"
                            multiple
                            onChange={handleImageChange}
                          />
                        </label>

                        <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                          {/* <h4 className="mt-2">Preview</h4> */}
                          {imgPreview?.images?.map((item, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center"
                              style={{ gap: "10px", flexDirection: 'column', position: 'relative' }}
                            >
                              <img style={{ width: '60px' }} src={item?.src} alt="img" />
                              <button
                                className="icon_btn __danger" style={{ position: 'absolute', bottom: '0px', right: '0px', borderRadius: '100%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() =>
                                  handleRemoveImage("images", index, item.id)
                                }
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Right */}
              <div className="col-12 col-lg-4">

                {/* Pricing Card */}
                {(value.product_type == "1" || value.product_type == "3") && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Pricing</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Price"
                          name="price"
                          value={value.price}
                          onChange={handleChange}
                        />
                        <span className="errMsg">{errors.price}</span>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Sale Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Sale Price"
                          name="sale_price"
                          value={value.sale_price}
                          onChange={handleChange}
                        />
                        <span className="errMsg">{errors.sale_price}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* HSN AND GST RATE */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">HSN AND GST RATE</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">HSN</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="hsn"
                        name="hsn"
                        value={value.hsn}
                        onChange={handleChange}
                      />
                      <span className="errMsg">{errors.hsn}</span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">GST RATE (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="GST RATE (%)"
                        name="gst_rate"
                        value={value.gst_rate}
                        onChange={handleChange}
                      />
                      <span className="errMsg">{errors.gst_rate}</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Card */}
                {
                  value.product_type == "4" &&
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Subscription</h5>
                    </div>
                    <div className="card-body">
                      {subscriptionVal.map((subscription, index) => (
                        <div key={index} className="row add-product-row-box mt-2 g-1 align-items-center">
                          <div className="col-1">
                            <input
                              type="text"
                              className="form-control p-1 text-center"
                              placeholder="Price"
                              value={subscription.days}
                              disabled
                            />
                          </div>
                          <div className="col-2"><strong>Days :-</strong></div>
                          <div className="col-2">
                            <input
                              type="text"
                              className="form-control p-1 text-center"
                              placeholder="Price"
                              name="price"
                              value={subscription.price}
                              onChange={(e) => handleSubscriptionChange(e, index, 'price')}
                            />
                          </div>
                          <div className="col-1"><strong>₹</strong></div>
                          <div className="col-2">
                            <input
                              type="text"
                              className="form-control p-1 text-center"
                              placeholder="Price"
                              name="sale_price"
                              value={subscription.sale_price}
                              onChange={(e) => handleSubscriptionChange(e, index, 'sale_price')}
                            />
                          </div>
                          <div className="col-1"><strong>₹</strong></div>
                          <div className="col-2">
                            <input
                              type="text"
                              className="form-control text-center p-1"
                              placeholder="Discount"
                              value={subscription.discount}
                              onChange={(e) => handleSubscriptionChange(e, index, 'discount')}
                            />
                          </div>
                          <div className="col-1"><strong>%</strong></div>
                        </div>
                      ))}
                    </div>
                  </div>
                }

                {/* Organize Card */}
                <div className="card mb-4 pb-3">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Organize</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-4 col ecommerce-select2-dropdown">
                      <label className="form-label mb-1" htmlFor="brand">
                        Brand
                      </label>
                      <select
                        name="brand_id"
                        value={value.brand_id}
                        onChange={handleChange}
                        className="form-select text-capitalize"
                      >
                        <option value>Select</option>
                        {brand?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mt-4">
                      <FormControl
                        sx={{ width: "100%" }}
                        className="main_multi"
                      >
                        <InputLabel id="multiple-checkbox-label bg-white mt-4">
                          Select Categories
                        </InputLabel>
                        <Select
                          labelId="multiple-checkbox-label"
                          id="multiple-checkbox"
                          multiple
                          value={value.category_id || []}
                          onChange={handleCategoryChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) =>
                            selected
                              .map(
                                (id) =>
                                  categories.find((cat) => cat.id === id)?.name
                              )
                              .join(", ")
                          }
                          MenuProps={MenuProps}
                          className="check_select"
                          inputProps={{ "aria-label": "Select categories" }}
                          placeholder="Select categories"
                        >
                          {categories?.map((name) => (
                            <MenuItem key={name.id} value={name.id}>
                              <Checkbox
                                checked={
                                  value.category_id?.indexOf(name.id) > -1
                                }
                              />
                              <ListItemText primary={name?.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="card mb-4 pb-3">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Tags</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-4 col ecommerce-select2-dropdown">
                      <form onSubmit={handleSubmitTag} className="">
                        <input
                          type="text"
                          className="form-control"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter a tag and Press Enter"
                        />
                        {/* <button type="submit">Add Tag</button> */}
                      </form>
                    </div>
                    <div className="tag-box">
                      {tags?.map((tag, index) => (
                        <>
                          <p className="tags">
                            <i class="fa-solid fa-tag"></i>
                            <span key={index}>{tag}</span>
                            <i class="fa fa-times text-danger" onClick={() => removeTag(index)} style={{ cursor: 'pointer' }}></i>
                          </p>
                        </>
                      ))}
                    </div>

                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <button className="btn btn-label-secondary w-100">
                      Cancel
                    </button>
                    {submitLoading ? (
                      <>
                        <button type="button" className="btn btn-primary w-100 mt-2" >
                          <div class="spinner-border " role="status">
                            <span class="sr-only">Loading...</span>
                          </div></button>
                      </>
                    ) : (
                      <>
                        {value.id ? (
                          <button
                            type="button"
                            className="btn btn-primary w-100 mt-2"
                            onClick={handleUpdate}
                          >
                            Update Product
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary  w-100 mt-2"
                            onClick={handleSubmit}
                          >
                            Publish Product
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-backdrop fade" />
      </div>
    </>
  );
};

export default AddProduct;