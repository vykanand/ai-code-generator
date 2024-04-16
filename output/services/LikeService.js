const Like = require('../models/Like');

class LikeService {
  async createLike(like) {
    const newLike = new Like(like);
    await newLike.save();
    return newLike;
  }

  async getLikes() {
    const likes = await Like.find();
    return likes;
  }

  async getLikeById(id) {
    const like = await Like.findById(id);
    return like;
  }

  async updateLike(id, like) {
    const updatedLike = await Like.findByIdAndUpdate(id, like, { new: true });
    return updatedLike;
  }

  async deleteLike(id) {
    await Like.findByIdAndDelete(id);
  }
}

module.exports = LikeService;