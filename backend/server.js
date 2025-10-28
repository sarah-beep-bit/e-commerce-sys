import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import { initializeData } from './utils/dataManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (try dist first, fallback to public for demo)
const distPath = path.join(__dirname, '../frontend/dist');
const publicPath = path.join(__dirname, 'public');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('✅ Serving React build from /frontend/dist');
} else {
  app.use(express.static(publicPath));
  console.log('📱 Serving demo from /backend/public');
}

// Initialize data files
await initializeData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-commerce API is running' });
});

// Serve React app for all other routes (must be after API routes)
app.get('*', (req, res) => {
  const reactBuild = path.join(__dirname, '../frontend/dist/index.html');
  const demoPage = path.join(__dirname, 'public/index.html');
  
  if (existsSync(reactBuild)) {
    res.sendFile(reactBuild);
  } else if (existsSync(demoPage)) {
    res.sendFile(demoPage);
  } else {
    res.status(404).send('Application not found. Please run npm install in frontend folder.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 E-commerce API ready`);
});
