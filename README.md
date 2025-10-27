# E-Commerce System

A modern, full-featured e-commerce platform built with React and Node.js.

## Features

### Customer Features
- 🛍️ Browse products with search and filtering
- 🛒 Shopping cart management
- 💳 Checkout process
- 👤 User authentication (register/login)
- 📦 Order history and tracking
- ⭐ Product ratings and reviews

### Admin Features
- 📊 Admin dashboard
- ➕ Add/Edit/Delete products
- 📋 Order management
- 👥 User management
- 📈 Sales analytics

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Lucide React for icons
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- JWT authentication
- RESTful API
- File-based data storage (JSON)

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start both frontend and backend:
```bash
npm run dev
```

2. Or run separately:
```bash
# Backend (runs on http://localhost:3001)
npm run server

# Frontend (runs on http://localhost:5173)
npm run client
```

### Default Credentials

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

**Test User:**
- Email: user@example.com
- Password: user123

## Project Structure

```
ecommerce-sys/
├── backend/
│   ├── server.js           # Express server
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── data/              # JSON data storage
│   └── utils/             # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Main app component
│   └── public/            # Static assets
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:itemId` - Update cart item
- DELETE `/api/cart/:itemId` - Remove cart item

### Orders
- GET `/api/orders` - Get user orders
- POST `/api/orders` - Create order
- GET `/api/orders/:id` - Get order by ID
- PUT `/api/orders/:id/status` - Update order status (Admin)

## Features Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filters
- [ ] Inventory management
- [ ] Discount codes and promotions
- [ ] Multi-image product gallery
- [ ] Database integration (PostgreSQL/MongoDB)

## License

MIT License
