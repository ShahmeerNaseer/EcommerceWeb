import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, updateQuantity, removeFromCart, clearCart, user }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!user) {
    return (
      <div className="cart-empty">
        <h2>Please login to view your cart</h2>
        <Link to="/login" className="continue-shopping-btn">Login</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="cart-item-quantity">
                <button 
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-total">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;