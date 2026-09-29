# Simple E-commerce Website

A full-stack e-commerce application with a React frontend and Node.js/Express backend using MongoDB.

## Features

- Product browsing and catalog
- Product details page
- Shopping cart functionality
- **Stripe payment integration** for secure checkout
- Order management
- User authentication (Login/Signup)
- Protected routes for authenticated users
- 404 error page
- Responsive design

## Tech Stack

### Frontend
- React 19
- React Router
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (make sure MongoDB is running on localhost:27017)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

4. Create a `.env` file in the frontend directory with the following content:
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

5. **Get your Stripe API keys:**
   - Sign up at [Stripe](https://stripe.com)
   - Go to Dashboard → Developers → API keys
   - Copy your Secret key (starts with `sk_test_`) and Publishable key (starts with `pk_test_`)
   - Add them to your respective `.env` files

6. **Set up Stripe webhook (for production):**
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook/webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret and add to `STRIPE_WEBHOOK_SECRET`

7. Seed the database with sample products:
```bash
npm run seed
```

8. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port as specified by Vite)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status

### Stripe
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout session
- `GET /api/stripe/session/:sessionId` - Get Stripe session details
- `POST /api/webhook/webhook` - Stripe webhook handler

## Usage

1. Make sure MongoDB is running
2. Start the backend server (`cd backend && npm start`)
3. Start the frontend server (`cd frontend && npm run dev`)
4. Open your browser and navigate to the frontend URL
5. Browse products, add items to cart, and complete the checkout process

## Project Structure

```
FiverrGIG1/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── auth.js
│   │   ├── stripe.js
│   │   └── webhook.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductList.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── stripe.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Notes

- The cart is stored in localStorage on the frontend
- User authentication is implemented with JWT tokens
- Stripe integration provides secure payment processing
- For local development, webhooks may not work without ngrok or similar tunneling service
- The product images are from Unsplash and may require internet connection to load
- MongoDB connection string assumes MongoDB is running locally on the default port
- Make sure to add your actual Stripe API keys to the .env files for payment processing to work