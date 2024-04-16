const ReviewService = require('../services/ReviewService');
const assert = require('assert');

describe('ReviewService', () => {
  describe('createReview', () => {
    it('should create a new review', async () => {
      const review = await ReviewService.createReview({ title: 'Great product', body: 'I love this product!', rating: 5 });
      assert.ok(review._id);
      assert.strictEqual(review.title, 'Great product');
      assert.strictEqual(review.body, 'I love this product!');
      assert.strictEqual(review.rating, 5);
    });
  });

  describe('getReviews', () => {
    it('should get all reviews', async () => {
      const reviews = await ReviewService.getReviews();
      assert.ok(reviews.length > 0);
    });
  });

  describe('getReviewById', () => {
    it('should get a review by id', async () => {
      const review = await ReviewService.createReview({ title: 'Great product', body: 'I love this product!', rating: 5 });
      const foundReview = await ReviewService.getReviewById(review._id);
      assert.strictEqual(foundReview.title, 'Great product');
      assert.strictEqual(foundReview.body, 'I love this product!');
      assert.strictEqual(foundReview.rating, 5);
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const review = await ReviewService.createReview({ title: 'Great product', body: 'I love this product!', rating: 5 });
      const updatedReview = await ReviewService.updateReview(review._id, { title: 'Good product', body: 'I like this product!', rating: 4 });
      assert.strictEqual(updatedReview.title, 'Good product');
      assert.strictEqual(updatedReview.body, 'I like this product!');
      assert.strictEqual(updatedReview.rating, 4);
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const review = await ReviewService.createReview({ title: 'Great product', body: 'I love this product!', rating: 5 });
      await ReviewService.deleteReview(review._id);
      const foundReview = await ReviewService.getReviewById(review._id);
      assert.strictEqual(foundReview, null);
    });
  });
});