const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerAddress, stripeSessionId, paymentMethod, paymentStatus } = req.body;
    
    // Deduplicate Stripe orders
    if (stripeSessionId) {
      const existingOrder = await Order.findOne({ stripeSessionId });
      if (existingOrder) {
        return res.status(200).json(existingOrder);
      }
    }
    
    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      totalAmount += product.price * item.quantity;
    }
    
    const order = new Order({
      items: orderItems,
      totalAmount,
      customerName,
      customerEmail,
      customerAddress,
      stripeSessionId: stripeSessionId || null,
      paymentMethod: paymentMethod || 'manual',
      paymentStatus: paymentStatus || 'pending'
    });
    
    const savedOrder = await order.save();
    await savedOrder.populate('items.product');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;