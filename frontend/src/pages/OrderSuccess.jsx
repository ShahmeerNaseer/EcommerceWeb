import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getSessionDetails } from '../services/stripe';

const API_URL = import.meta.env.VITE_API_URL || '';

function OrderSuccess({ clearCart, user }) {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const sessionData = await getSessionDetails(sessionId);
        setSession(sessionData);
        
        // Create order manually without webhook (only once)
        if (sessionData.payment_status === 'paid' && !orderCreated) {
          await createOrderFromSession(sessionData);
          setOrderCreated(true);
          clearCart(); // Clear cart after successful order creation
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const createOrderFromSession = async (sessionData) => {
    try {
      const metadata = sessionData.metadata || {};
      const items = metadata.items ? JSON.parse(metadata.items) : [];
      
      const orderData = {
        items: items,
        customerName: metadata.customerName || user?.name || 'Guest',
        customerEmail: sessionData.customer_email || user?.email,
        customerAddress: 'N/A (Stripe checkout)',
        stripeSessionId: sessionData.id,
        paymentMethod: 'stripe',
        paymentStatus: sessionData.payment_status
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        console.log('Order created successfully from Stripe session');
      }
    } catch (err) {
      console.error('Error creating order from session:', err);
    }
  };

  if (loading) {
    return (
      <div className="order-success">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="order-success">
        <h2>Order not found</h2>
        <p>{error}</p>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    );
  }

  const metadata = session.metadata || {};
  const items = metadata.items ? JSON.parse(metadata.items) : [];

  return (
    <div className="order-success">
      <div className="success-message">
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
      </div>
      
      <div className="order-details">
        <h2>Order Details</h2>
        <p><strong>Session ID:</strong> {session.id}</p>
        <p><strong>Payment Status:</strong> {session.payment_status}</p>
        <p><strong>Total Amount:</strong> ${(session.amount_total / 100).toFixed(2)}</p>
        <p><strong>Customer Email:</strong> {session.customer_email}</p>
        
        <h3>Order Items</h3>
        <div className="order-items">
          {items.map((item, index) => (
            <div key={index} className="order-item">
              <h4>Product ID: {item.productId}</h4>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> {metadata.customerName}</p>
        <p><strong>Email:</strong> {session.customer_email}</p>
      </div>
      
      <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
    </div>
  );
}

export default OrderSuccess;
