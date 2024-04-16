const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;