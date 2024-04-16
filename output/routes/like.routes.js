const express = require('express');
const router = express.Router();
const LikeService = require('../services/LikeService');

router.post('/', async (req, res) => {
  const like = await LikeService.createLike(req.body);
  res.json(like);
});

router.get('/', async (req, res) => {
  const likes = await LikeService.getLikes();
  res.json(likes);
});

router.get('/:id', async (req, res) => {
  const like = await LikeService.getLikeById(req.params.id);
  res.json(like);
});

router.put('/:id', async (req, res) => {
  const like = await LikeService.updateLike(req.params.id, req.body);
  res.json(like);
});

router.delete('/:id', async (req, res) => {
  await LikeService.deleteLike(req.params.id);
  res.json({ message: 'Like deleted successfully' });
});

module.exports = router;