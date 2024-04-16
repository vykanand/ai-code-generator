const Post = require('../models/Post');

class PostService {
  async createPost(post) {
    const newPost = new Post(post);
    await newPost.save();
    return newPost;
  }

  async getPosts() {
    const posts = await Post.find();
    return posts;
  }

  async getPostById(id) {
    const post = await Post.findById(id);
    return post;
  }

  async updatePost(id, post) {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    return updatedPost;
  }

  async deletePost(id) {
    await Post.findByIdAndDelete(id);
  }
}

module.exports = PostService;