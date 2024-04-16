const express = require('express');
const router = express.Router();
const PostService = require('../services/PostService');

router.post('/', async (req, res) => {
  const post = await PostService.createPost(req.body);
  res.json(post);
});

router.get('/', async (req, res) => {
  const posts = await PostService.getPosts();
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await PostService.getPostById(req.params.id);
  res.json(post);
});

router.put('/:id', async (req, res) => {
  const post = await PostService.updatePost(req.params.id, req.body);
  res.json(post);
});

router.delete('/:id', async (req, res) => {
  await PostService.deletePost(req.params.id);
  res.json({ message: 'Post deleted successfully' });
});

module.exports = router;