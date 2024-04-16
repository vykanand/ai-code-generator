const Review = require('../models/Review');

class ReviewService {
  async createReview(review) {
    const newReview = new Review(review);
    await newReview.save();
    return newReview;
  }

  async getReviews() {
    const reviews = await Review.find();
    return reviews;
  }

  async getReviewById(id) {
    const review = await Review.findById(id);
    return review;
  }

  async updateReview(id, review) {
    const updatedReview = await Review.findByIdAndUpdate(id, review, { new: true });
    return updatedReview;
  }

  async deleteReview(id) {
    await Review.findByIdAndDelete(id);
  }
}

module.exports = ReviewService;