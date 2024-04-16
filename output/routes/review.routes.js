const express = require('express');
const router = express.Router();
const ReviewService = require('../services/ReviewService');

router.post('/', async (req, res) => {
  const review = await ReviewService.createReview(req.body);
  res.json(review);
});

router.get('/', async (req, res) => {
  const reviews = await ReviewService.getReviews();
  res.json(reviews);
});

router.get('/:id', async (req, res) => {
  const review = await ReviewService.getReviewById(req.params.id);
  res.json(review);
});

router.put('/:id', async (req, res) => {
  const review = await ReviewService.updateReview(req.params.id, req.body);
  res.json(review);
});

router.delete('/:id', async (req, res) => {
  await ReviewService.deleteReview(req.params.id);
  res.json({ message: 'Review deleted successfully' });
});

module.exports = router;