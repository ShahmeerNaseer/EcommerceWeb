const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Simple in-memory cart storage (for demo purposes)
// In production, you'd use a database with user sessions
let cart = [];

// Get cart items
router.get('/', (req, res) => {
  res.json(cart);
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  const itemIndex = cart.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
  }
  
  res.json(cart);
});

// Remove item from cart
router.delete('/:productId', (req, res) => {
  const { productId } = req.params;
  cart = cart.filter(item => item.productId !== productId);
  res.json(cart);
});

// Clear cart
router.delete('/', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;