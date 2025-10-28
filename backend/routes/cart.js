import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/dataManager.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const carts = await readData('carts');
    const userCart = carts.find(c => c.userId === req.user.id);

    if (!userCart) {
      return res.json({ userId: req.user.id, items: [] });
    }

    // Populate with product details
    const products = await readData('products');
    const populatedItems = userCart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    });

    res.json({ ...userCart, items: populatedItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    // Check if product exists and has stock
    const products = await readData('products');
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const carts = await readData('carts');
    let userCart = carts.find(c => c.userId === req.user.id);

    if (!userCart) {
      userCart = {
        userId: req.user.id,
        items: [],
        createdAt: new Date().toISOString()
      };
      carts.push(userCart);
    }

    // Check if item already in cart
    const existingItemIndex = userCart.items.findIndex(i => i.productId === productId);

    if (existingItemIndex > -1) {
      userCart.items[existingItemIndex].quantity += quantity;
    } else {
      userCart.items.push({
        id: uuidv4(),
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    userCart.updatedAt = new Date().toISOString();
    await writeData('carts', carts);

    // Return populated cart
    const populatedItems = userCart.items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return { ...item, product: prod };
    });

    res.json({ ...userCart, items: populatedItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const carts = await readData('carts');
    const userCart = carts.find(c => c.userId === req.user.id);

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = userCart.items.findIndex(i => i.id === req.params.itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Check stock
    const products = await readData('products');
    const product = products.find(p => p.id === userCart.items[itemIndex].productId);

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    userCart.items[itemIndex].quantity = quantity;
    userCart.updatedAt = new Date().toISOString();
    await writeData('carts', carts);

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:itemId', authenticateToken, async (req, res) => {
  try {
    const carts = await readData('carts');
    const userCart = carts.find(c => c.userId === req.user.id);

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    userCart.items = userCart.items.filter(i => i.id !== req.params.itemId);
    userCart.updatedAt = new Date().toISOString();
    await writeData('carts', carts);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const carts = await readData('carts');
    const userCart = carts.find(c => c.userId === req.user.id);

    if (userCart) {
      userCart.items = [];
      userCart.updatedAt = new Date().toISOString();
      await writeData('carts', carts);
    }

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
