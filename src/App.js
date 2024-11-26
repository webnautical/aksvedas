import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { Dashboard } from './admin/pages/Dashboard/Dashboard';
import AdminAuth from './layout/AdminAuth';
import Product from './admin/pages/Products/Product';
import Login from './auth/admin/Login';
import FrontLogin from './auth/customer/FrontLogin';
import ForgotPassword from './auth/admin/ForgotPassword';
import AddProduct from './admin/pages/Products/AddProduct';
import { useEffect } from 'react';
import Brand from './admin/pages/Brand/Brand';
import Category from './admin/pages/Category/Category';
import MyProfile from './admin/pages/ProfileSetting/MyProfile';
import Customer from './admin/pages/Customer/Customer';
import CustomerDetails from './admin/pages/Customer/CustomerDetails';
import Home from './front/pages/home/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper';
import Attributes from './admin/pages/Attributes/Attributes';
import ProductDetails from './admin/pages/Products/ProductDetails';
import FrontWeb from './layout/FrontWeb';
import About from './front/pages/about/About';
import ContactUs from './front/pages/contact/ContactUs';
import Collections from './front/pages/collections/Collections';
import Shop from './front/pages/shop/Shop';
import ProductDetail from './front/pages/product-details/ProductDetail';
import { OfferList } from './admin/pages/Offers/OfferList';
import ImagesVideo from './admin/pages/ImagesVideos/ImagesVideo';
import PrivacyPolicy from './front/pages/privacy-policy/PrivacyPolicy';
import { TermsConditions } from './front/pages/terms-and-conditons/TermsConditions';
import Address from './front/pages/address/address';
import Account from './front/pages/account/Account';
import { AyurvedExperience } from './admin/pages/SubPage/AyurvedExperience';
import Index from './front/pages/cart-checkout-payment/Index';
import OrderDetails from './front/pages/account/OrderDetails';
import OrderList from './admin/pages/Orders/OrderList';
import { OrderDetails as AdminOrderDetails } from './admin/pages/Orders/OrderDetails';
import OrderSuccess from './front/pages/account/OrderSuccess';
import Blog from './front/pages/blog/Blog';
import BlogDetails from './front/pages/blog/BlogDetails';
import ScrollToTop from './components/front/ScrollToTop';
import CancellationReturnsRefundsPolicy from './front/pages/terms-and-conditons/CancellationReturnsRefundsPolicy';
import ShippingPolicy from './front/pages/shipping-policy/ShippingPolicy';
import ShippingNow from './admin/pages/Orders/ShippingNow';
import CustomerReviewList from './admin/pages/Reviews/CustomerReviewList';
import StaticPages from './admin/pages/StaticPages/StaticPages';
import BlogCommentList from './admin/pages/Blog/BlogCommentList';
import StaticPagesFront from './front/pages/staticPages/StaticPages';
import FixedReviews from './admin/pages/Reviews/FixedReviews';
import QueryList from './admin/pages/Query/QueryList';
import Utils from './admin/pages/Utils/Utils';
import CustomerReports from './admin/pages/Reports/CustomerReports';
import OrderFailure from './front/pages/account/OrderFailure';
import Transaction from './admin/pages/Orders/Transaction';
import OrderProducts from './admin/pages/Reports/OrderProducts';
import ReasonList from './admin/pages/Query/ReasonList';
import SubscribersList from './admin/pages/Query/SubscribersList';
import MetaList from './admin/pages/Meta/MetaList';
function App() {
  // const path = useLocation().pathname
  // useEffect(() => {
  //   document.title = path === '/' ? "Aksveda" : `Aksveda` + path.replace('/admin/', ' - ');
  //   return () => { document.title = "Aksveda" };
  // }, [path]);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<FrontWeb cmp={Home} />} />
        <Route path='/about' element={<FrontWeb cmp={StaticPagesFront} />} />
        <Route path='/privacy-policy' element={<FrontWeb cmp={StaticPagesFront} />} />
        <Route path='/term-and-condition' element={<FrontWeb cmp={StaticPagesFront} />} />
        <Route path='/cancellation-returns-refunds-policy' element={<FrontWeb cmp={StaticPagesFront} />} />
        <Route path='/shipping-policy' element={<FrontWeb cmp={StaticPagesFront} />} />
        <Route path='/contact-us' element={<FrontWeb cmp={StaticPagesFront} />} />

        <Route path='/blog' element={<FrontWeb cmp={Blog} />} />
        <Route path='/blog-details/:slug' element={<FrontWeb cmp={BlogDetails} />} />
        <Route path='/collections' element={<FrontWeb cmp={Collections} />} />
        <Route path='/product-detail/:slug' element={<FrontWeb cmp={ProductDetail} />} />
        <Route path='/shop/:category' element={<FrontWeb cmp={Shop} />} />
        <Route path='/address' element={<FrontWeb cmp={Address} />} />
        <Route path='/cart' element={<FrontWeb cmp={Index} />} />
        <Route path='/payment' element={<FrontWeb cmp={Index} />} />
        <Route path='/checkout' element={<FrontWeb cmp={Index} />} />
        <Route path='/account/:page' element={<FrontWeb cmp={Account} />} />
        <Route path='/order-details/:order_id' element={<FrontWeb cmp={OrderDetails} />} />
        <Route path='/order-success/:order_id' element={<FrontWeb cmp={OrderSuccess} />} />
        <Route path='/order-failure/:tracking_id' element={<FrontWeb cmp={OrderFailure} />} />
        <Route path='/login' Component={FrontLogin} />

        <Route path='/admin' Component={Login} />
        <Route exact path='/admin/forgot-password' Component={ForgotPassword} />
        <Route exact path="/admin/dashboard" element={<AdminAuth cmp={Dashboard} />} />
        <Route exact path="/admin/brand" element={<AdminAuth cmp={Brand} />} />
        <Route exact path="/admin/category" element={<AdminAuth cmp={Category} />} />

        <Route exact path="/admin/attributes" element={<AdminAuth cmp={Attributes} />} />

        <Route exact path="/admin/products" element={<AdminAuth cmp={Product} />} />
        <Route exact path="/admin/products/:slug" element={<AdminAuth cmp={ProductDetails} />} />

        <Route exact path="/admin/orders" element={<AdminAuth cmp={OrderList} />} />
        <Route exact path="/admin/transaction" element={<AdminAuth cmp={Transaction} />} />
        <Route exact path="/admin/order-details/:order_id" element={<AdminAuth cmp={AdminOrderDetails} />} />
        <Route exact path="/admin/shipping-now/:order_id" element={<AdminAuth cmp={ShippingNow} />} />


        <Route exact path="/admin/add-products" element={<AdminAuth cmp={AddProduct} />} />
        <Route exact path="/admin/my-profile" element={<AdminAuth cmp={MyProfile} />} />
        <Route exact path="/admin/customer" element={<AdminAuth cmp={Customer} />} />
        <Route exact path="/admin/customer-details/:id" element={<AdminAuth cmp={CustomerDetails} />} />

        <Route exact path="/admin/offers" element={<AdminAuth cmp={OfferList} />} />
        <Route exact path="/admin/images-videos" element={<AdminAuth cmp={ImagesVideo} />} />
        <Route exact path="/admin/ayurved-experience" element={<AdminAuth cmp={AyurvedExperience} />} />

        <Route exact path="/admin/customer-reviews" element={<AdminAuth cmp={CustomerReviewList} />} />
        <Route exact path="/admin/page/:route" element={<AdminAuth cmp={StaticPages} />} />
        <Route exact path="/admin/blog/:page" element={<AdminAuth cmp={BlogCommentList} />} />
        <Route exact path="/admin/reviews/:page" element={<AdminAuth cmp={FixedReviews} />} />
        <Route exact path="/admin/queries" element={<AdminAuth cmp={QueryList} />} />
        <Route exact path="/admin/subscribers" element={<AdminAuth cmp={SubscribersList} />} />
        <Route exact path="/admin/utils" element={<AdminAuth cmp={Utils} />} />
        <Route exact path="/admin/reasons" element={<AdminAuth cmp={ReasonList} />} />
        <Route exact path="/admin/meta-list/:page" element={<AdminAuth cmp={MetaList} />} />


        <Route exact path="/admin/reports/customer" element={<AdminAuth cmp={CustomerReports} />} />
        <Route exact path="/admin/reports/order-products" element={<AdminAuth cmp={OrderProducts} />} />



        {/* Redirect Page */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
