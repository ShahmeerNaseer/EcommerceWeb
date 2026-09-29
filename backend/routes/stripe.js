const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail, customerName } = req.body;
    
    // Validate items
    const lineItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            ...(product.image && product.image.startsWith('http') ? { images: [product.image] } : {}),
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      };
    }));
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      customer_email: customerEmail,
      metadata: {
        customerName: customerName,
        items: JSON.stringify(items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })))
      },
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;