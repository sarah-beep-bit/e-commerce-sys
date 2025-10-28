import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/dataManager.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let products = await readData('products');

    // Filter by category
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await readData('products');
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const products = await readData('products');
    const newProduct = {
      id: uuidv4(),
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      stock: parseInt(stock) || 0,
      featured: featured || false,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    await writeData('products', products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await readData('products');
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, description, price, category, image, stock, featured } = req.body;
    
    products[index] = {
      ...products[index],
      name: name || products[index].name,
      description: description !== undefined ? description : products[index].description,
      price: price ? parseFloat(price) : products[index].price,
      category: category || products[index].category,
      image: image || products[index].image,
      stock: stock !== undefined ? parseInt(stock) : products[index].stock,
      featured: featured !== undefined ? featured : products[index].featured,
      updatedAt: new Date().toISOString()
    };

    await writeData('products', products);
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await readData('products');
    const filteredProducts = products.filter(p => p.id !== req.params.id);

    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await writeData('products', filteredProducts);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
