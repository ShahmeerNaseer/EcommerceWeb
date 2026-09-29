import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails({ addToCart, user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`${quantity} ${product.name}(s) added to cart!`);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-details">
      <Link to="/" className="back-link">← Back to Products</Link>
      <div className="product-details-container">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-details-image" />
        </div>
        <div className="product-details-info">
          <h1 className="product-details-name">{product.name}</h1>
          <p className="product-details-category">{product.category}</p>
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          <p className="product-details-description">{product.description}</p>
          <p className="product-details-stock">In Stock: {product.stock}</p>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <select 
              id="quantity" 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              max={product.stock}
            >
              {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
