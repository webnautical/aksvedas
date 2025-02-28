import React, { useState } from 'react';
import { authCustomer, toastifyError } from '../../utility/Utility';
import { addToCartRepeater } from '../../utility/api/RepeaterAPI';
import { useNavigate } from 'react-router';
import { useFrontDataContext } from '../../context/FrontContextProvider';

const ProductItemButton = ({ row }) => {
  const { getWishlistFun, getCartFun, cartData } = useFrontDataContext();
  const [cartLoading, setCartLoading] = useState(false)
  const navigate = useNavigate()
  const [clickCount, setClickCount] = useState(0)

  const addToCartFun = async (type, item) => {
    setClickCount(clickCount + 1)
    const cartItem = cartData.find(cartItem => cartItem.product_id == item.id);
    if (cartItem && cartItem.qnt > 4) {
      if(clickCount > 5){
       return false
      }else{
        toastifyError('You cannot add more than 5 of this item.');
        return false
      }
    }

    const param = { product_id: item.id, qnt: 1 };
    // if (authCustomer()?.id) {
      if (item.quantity > 0 && item.product_type !== 4) {
        setCartLoading(true)
        const canvas = type == "buy" ? 0 : 1
        await addToCartRepeater(param, getWishlistFun, getCartFun, 0, canvas);
        if (type == "buy") {
          navigate("/checkout");
        }
        setCartLoading(false)
      } else {
        navigate(`/product-detail/${item.slug}`);
      }
    // } else {
    //   sessionStorage.setItem('cart', JSON.stringify(param))
    //   navigate("/login", {state : {data: type}});
    // }
  };
  return (
    <>
      {
        row?.quantity > 0 ?
          <>
            <div className="doble_btn global_btn d-flex mt-3">
              <button className="btn-2 w-100" onClick={() => addToCartFun("buy", row)}>
                Buy Now <i className="fa-solid fa-arrow-right"></i>
              </button>
              {
                cartLoading ?
                  <button class="btn-2 w-100" type="button">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span role="status"> Loading...</span>
                  </button>
                  :
                  <button className="btn-2 w-100" onClick={() => addToCartFun("cart", row)}>
                    <i className="me-1 fa-solid fa-cart-plus"></i>Add To cart
                  </button>
              }

            </div>
          </>
          :
          <div className="doble_btn global_btn d-flex mt-3">
            <button className="btn-2 w-100" onClick={() => addToCartFun("buy", row)}>
              Buy Now <i className="fa-solid fa-arrow-right"></i>
            </button>

            <button className="btn-2 w-100" onClick={() => addToCartFun("cart", row)} >
              <i className="me-1 fa-solid fa-cart-plus"></i>Add To cart
            </button>
          </div>
      }

    </>
  )
}

export default ProductItemButton