require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Clothing',
    stock: 100
  },
  {
    name: 'Backpack',
    description: 'Durable backpack for travel and daily use',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 75
  },
  {
    name: 'Sunglasses',
    description: 'Stylish sunglasses with UV protection',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Accessories',
    stock: 60
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 40
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');

    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');
    
    mongoose.connection.close();
    console.log('Database connection closed');
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });