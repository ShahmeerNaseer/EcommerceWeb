import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createCheckoutSession } from '../../services/stripe';

function Checkout({ cart, clearCart, user }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleStripeCheckout = async () => {
    if (!user) {
      setError('Please login to continue checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const { url } = await createCheckoutSession(items, user.email, user.name);
      
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Payment Information</h3>
          <div className="stripe-checkout-info">
            <p>You will be redirected to Stripe's secure checkout page to complete your payment.</p>
            <p className="secure-checkout">
              <span className="lock-icon">🔒</span> Secure payment powered by Stripe
            </p>
          </div>
          
          <div className="user-info-summary">
            <h4>Ordering as:</h4>
            <p><strong>Name:</strong> {user?.name || 'Guest'}</p>
            <p><strong>Email:</strong> {user?.email || 'Guest'}</p>
          </div>
          
          <button 
            onClick={handleStripeCheckout}
            className="place-order-btn stripe-btn"
            disabled={loading}
          >
            {loading ? 'Redirecting to Stripe...' : `Proceed to Payment - $${total.toFixed(2)}`}
          </button>
          
          <Link to="/cart" className="back-to-cart">
            ← Back to Cart
          </Link>
        </div>
        
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {cart.map((item, index) => (
              <div key={index} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-image" />
                <div className="checkout-item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;