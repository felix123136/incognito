import React, { useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import toast, { Toast } from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (res.statusCode === 500) return;
    const data = await res.json();
    toast.loading("Redirecting...");
    stripe.redirectToCheckout({ sessionId: data.id });
  };
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities}) items</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShoppingCart size={150} />
            <h3>Your cart is empty</h3>
            <button
              type="button"
              onClick={() => setShowCart(false)}
              className="btn"
            >
              Continue Shopping
            </button>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  alt=""
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top cart-product-name">
                    <h5>{item.name}</h5>
                    <h5>${item.price}</h5>
                  </div>
                  <div className="flex bottom cart-bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
