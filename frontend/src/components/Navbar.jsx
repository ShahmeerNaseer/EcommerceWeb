import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, logout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ShopHub
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link">
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="nav-user">Welcome, {user.name}</span>
              <button onClick={logout} className="nav-logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;