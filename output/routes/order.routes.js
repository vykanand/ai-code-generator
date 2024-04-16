const express = require('express');
const router = express.Router();
const OrderService = require('../services/OrderService');

router.post('/', async (req, res) => {
  const order = await OrderService.createOrder(req.body);
  res.json(order);
});

router.get('/', async (req, res) => {
  const orders = await OrderService.getOrders();
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await OrderService.getOrderById(req.params.id);
  res.json(order);
});

router.put('/:id', async (req, res) => {
  const order = await OrderService.updateOrder(req.params.id, req.body);
  res.json(order);
});

router.delete('/:id', async (req, res) => {
  await OrderService.deleteOrder(req.params.id);
  res.json({ message: 'Order deleted successfully' });
});

module.exports = router;