# E-Commerce System Setup Guide

## Quick Start

Follow these steps to get your e-commerce system up and running:

### 1. Install Dependencies

First, install the root dependencies:
```bash
npm install
```

Then, navigate to the frontend directory and install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
copy .env.example .env
```

The default configuration should work fine for development. The `.env` file contains:
- `PORT=3001` - Backend server port
- `JWT_SECRET` - Secret key for JWT tokens (change this in production!)
- `NODE_ENV=development` - Environment mode

### 3. Run the Application

You have two options:

**Option A: Run both frontend and backend together (Recommended)**
```bash
npm run dev
```

**Option B: Run separately**

In one terminal, start the backend:
```bash
npm run server
```

In another terminal, start the frontend:
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Default Accounts

The system comes with pre-configured accounts:

### Admin Account
- **Email**: admin@ecommerce.com
- **Password**: admin123
- **Access**: Full admin dashboard, product management, order management

### Test User Account
- **Email**: user@example.com
- **Password**: user123
- **Access**: Regular customer features

## Features Overview

### Customer Features
- Browse and search products
- Filter by category
- Add products to cart
- Checkout with shipping information
- View order history
- User registration and authentication

### Admin Features
- Dashboard with sales statistics
- Add/Edit/Delete products
- Manage product inventory
- View all orders
- Update order status
- View user statistics

## Project Structure

```
ecommerce-sys/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── products.js       # Product management
│   │   ├── cart.js           # Shopping cart
│   │   ├── orders.js         # Order management
│   │   └── users.js          # User management
│   ├── middleware/           # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── utils/               # Utility functions
│   │   └── dataManager.js   # Data persistence layer
│   └── data/                # JSON data files (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/       # Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       └── Orders.jsx
│   │   ├── context/         # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   └── public/              # Static assets
│
└── package.json             # Root package configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (supports filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `PUT /api/cart/:itemId` - Update cart item quantity (requires auth)
- `DELETE /api/cart/:itemId` - Remove cart item (requires auth)
- `DELETE /api/cart` - Clear cart (requires auth)

### Orders
- `GET /api/orders` - Get orders (user sees their orders, admin sees all)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create order (requires auth)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Users & Stats
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/stats` - Get system statistics (admin only)

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **File-based storage** - JSON files for data persistence

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

## Data Storage

This application uses file-based JSON storage for simplicity. Data is stored in `backend/data/`:
- `users.json` - User accounts
- `products.json` - Product catalog
- `carts.json` - Shopping carts
- `orders.json` - Order history

**Note**: For production use, consider migrating to a proper database like PostgreSQL or MongoDB.

## Troubleshooting

### Port Already in Use
If you get an error that port 3001 or 5173 is already in use:
1. Change the PORT in `.env` for backend
2. Change the port in `frontend/vite.config.js` for frontend

### Module Not Found Errors
Make sure you've installed dependencies in both root and frontend:
```bash
npm install
cd frontend
npm install
```

### API Connection Issues
Ensure the backend is running on port 3001. The frontend proxy is configured to forward `/api` requests to `http://localhost:3001`.

## Next Steps

1. **Customize Products**: Login as admin and add your own products
2. **Styling**: Modify TailwindCSS configuration in `frontend/tailwind.config.js`
3. **Add Features**: Extend functionality like reviews, wishlists, etc.
4. **Database Integration**: Replace JSON storage with a real database
5. **Payment Gateway**: Integrate Stripe or PayPal for real payments
6. **Email Notifications**: Add email service for order confirmations

## Support

For issues or questions, refer to:
- React documentation: https://react.dev
- Express documentation: https://expressjs.com
- TailwindCSS documentation: https://tailwindcss.com

Happy shopping! 🛍️
