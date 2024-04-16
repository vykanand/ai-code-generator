const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;