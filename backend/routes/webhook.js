const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Parse metadata
        const items = JSON.parse(session.metadata.items);
        const customerName = session.metadata.customerName;
        const customerEmail = session.customer_email;
        
        // Check if order already exists (could be created by frontend fallback)
        const existingOrder = await Order.findOne({ stripeSessionId: session.id });
        if (existingOrder) {
          console.log('Order already exists for session:', session.id);
          return res.json({ received: true });
        }

        // Calculate total amount and create order items
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
          const product = await Product.findById(item.productId);
          if (product) {
            orderItems.push({
              product: product._id,
              quantity: item.quantity,
              price: product.price
            });
            totalAmount += product.price * item.quantity;
          }
        }
        
        // Create order
        const order = new Order({
          items: orderItems,
          totalAmount: totalAmount, // totalAmount is already in dollars
          customerName,
          customerEmail,
          customerAddress: 'N/A (Stripe checkout)',
          status: 'processing',
          stripeSessionId: session.id,
          paymentMethod: 'stripe',
          paymentStatus: session.payment_status
        });
        
        await order.save();
        console.log('Order created successfully:', order._id);
      } catch (error) {
        console.error('Error creating order from webhook:', error);
      }
      break;
      
    case 'checkout.session.expired':
      console.log('Checkout session expired');
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

module.exports = router;