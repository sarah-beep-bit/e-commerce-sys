import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/dataManager.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders = await readData('orders');

    if (req.user.role === 'admin') {
      // Admin sees all orders
      const users = await readData('users');
      orders = orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        return {
          ...order,
          userName: user ? user.name : 'Unknown',
          userEmail: user ? user.email : 'Unknown'
        };
      });
    } else {
      // Regular user sees only their orders
      orders = orders.filter(o => o.userId === req.user.id);
    }

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orders = await readData('orders');
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method required' });
    }

    // Get user's cart
    const carts = await readData('carts');
    const userCart = carts.find(c => c.userId === req.user.id);

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Get products and calculate total
    const products = await readData('products');
    let total = 0;
    const orderItems = [];

    for (const cartItem of userCart.items) {
      const product = products.find(p => p.id === cartItem.productId);

      if (!product) {
        return res.status(404).json({ error: `Product ${cartItem.productId} not found` });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * cartItem.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image
      });

      // Update product stock
      product.stock -= cartItem.quantity;
    }

    // Create order
    const newOrder = {
      id: uuidv4(),
      userId: req.user.id,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const orders = await readData('orders');
    orders.push(newOrder);
    await writeData('orders', orders);

    // Update product stock
    await writeData('products', products);

    // Clear user's cart
    userCart.items = [];
    await writeData('carts', carts);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const orders = await readData('orders');
    const orderIndex = orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    await writeData('orders', orders);

    res.json(orders[orderIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
