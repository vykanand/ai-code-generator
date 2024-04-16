const express = require('express');
const router = express.Router();
const ProductService = require('../services/ProductService');

router.post('/', async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.json(product);
});

router.get('/', async (req, res) => {
  const products = await ProductService.getProducts();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json(product);
});

router.put('/:id', async (req, res) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;