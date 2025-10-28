import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Read data from JSON file
export const readData = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write data to JSON file
export const writeData = async (filename, data) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Initialize default data
export const initializeData = async () => {
  await ensureDataDir();

  // Initialize users
  const users = await readData('users');
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 'user-1',
        email: 'admin@ecommerce.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-2',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        name: 'John Doe',
        role: 'customer',
        createdAt: new Date().toISOString()
      }
    ];
    await writeData('users', defaultUsers);
    console.log('✅ Default users created');
  }

  // Initialize products
  const products = await readData('products');
  if (products.length === 0) {
    const defaultProducts = [
      {
        id: 'prod-1',
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 199.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 50,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-2',
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock: 30,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-3',
        name: 'Laptop Backpack',
        description: 'Durable waterproof backpack with laptop compartment',
        price: 79.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        stock: 100,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-4',
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical gaming keyboard with custom switches',
        price: 149.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        stock: 45,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-5',
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 49.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
        stock: 75,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-6',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 39.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
        stock: 120,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-7',
        name: 'Phone Stand',
        description: 'Adjustable aluminum phone stand for desk',
        price: 24.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
        stock: 200,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-8',
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof Bluetooth speaker with 360° sound',
        price: 89.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        stock: 60,
        featured: true,
        createdAt: new Date().toISOString()
      }
    ];
    await writeData('products', defaultProducts);
    console.log('✅ Default products created');
  }

  // Initialize empty carts and orders
  const carts = await readData('carts');
  if (carts.length === 0) {
    await writeData('carts', []);
  }

  const orders = await readData('orders');
  if (orders.length === 0) {
    await writeData('orders', []);
  }

  console.log('✅ Data initialization complete');
};
