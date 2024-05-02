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
import Address from './front/pages/address/address';
import Cart from './front/pages/cart/Cart';
import CheckOut from './front/pages/checkout/CheckOut';
import Payment from './front/pages/payment/Payment';
import Account from './front/pages/account/Account';
import { AyurvedExperience } from './admin/pages/SubPage/AyurvedExperience';
import Index from './front/pages/cart-checkout-payment/Index';
function App() {
  const path = useLocation().pathname
  useEffect(() => {
    document.title = path === '/' ? "Aksveda" : `Aksveda` + path.replace('/admin/', ' - ');
    return () => { document.title = "Aksveda" };
  }, [path]);
  return (
    <>
      <Routes>

        <Route path='/' element={<FrontWeb cmp={Home} />} />
        <Route path='/about' element={<FrontWeb cmp={About} />} />
        <Route path='/contact-us' element={<FrontWeb cmp={ContactUs} />} />
        <Route path='/collections' element={<FrontWeb cmp={Collections} />} />
        <Route path='/product-detail/:slug' element={<FrontWeb cmp={ProductDetail} />} />
        <Route path='/shop/:category' element={<FrontWeb cmp={Shop} />} />
        <Route path='/privacy-policy' element={<FrontWeb cmp={PrivacyPolicy} />} />
        <Route path='/address' element={<FrontWeb cmp={Address} />} />
        <Route path='/cart' element={<FrontWeb cmp={Index} />} />
        <Route path='/payment' element={<FrontWeb cmp={Index} />} />
        <Route path='/checkout' element={<FrontWeb cmp={Index} />} />
        <Route path='/account' element={<FrontWeb cmp={Account} />} />
        <Route path='/login' Component={FrontLogin} />

        <Route path='/admin' Component={Login} />
        <Route exact path='/admin/forgot-password' Component={ForgotPassword} />
        <Route exact path="/admin/dashboard" element={<AdminAuth cmp={Dashboard} />} />
        <Route exact path="/admin/brand" element={<AdminAuth cmp={Brand} />} />
        <Route exact path="/admin/category" element={<AdminAuth cmp={Category} />} />

        <Route exact path="/admin/attributes" element={<AdminAuth cmp={Attributes} />} />

        <Route exact path="/admin/products" element={<AdminAuth cmp={Product} />} />
        <Route exact path="/admin/products/:slug" element={<AdminAuth cmp={ProductDetails} />} />

        <Route exact path="/admin/add-products" element={<AdminAuth cmp={AddProduct} />} />
        <Route exact path="/admin/my-profile" element={<AdminAuth cmp={MyProfile} />} />
        <Route exact path="/admin/customer" element={<AdminAuth cmp={Customer} />} />
        <Route exact path="/admin/customer-details/:id" element={<AdminAuth cmp={CustomerDetails} />} />

        <Route exact path="/admin/offers" element={<AdminAuth cmp={OfferList} />} />
        <Route exact path="/admin/images-videos" element={<AdminAuth cmp={ImagesVideo} />} />
        <Route exact path="/admin/ayurved-experience" element={<AdminAuth cmp={AyurvedExperience} />} />

        {/* Redirect Page */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
