const express = require('express');
const router = express.Router();
const FriendService = require('../services/FriendService');

router.post('/', async (req, res) => {
  const friend = await FriendService.createFriend(req.body);
  res.json(friend);
});

router.get('/', async (req, res) => {
  const friends = await FriendService.getFriends();
  res.json(friends);
});

router.get('/:id', async (req, res) => {
  const friend = await FriendService.getFriendById(req.params.id);
  res.json(friend);
});

router.put('/:id', async (req, res) => {
  const friend = await FriendService.updateFriend(req.params.id, req.body);
  res.json(friend);
});

router.delete('/:id', async (req, res) => {
  await FriendService.deleteFriend(req.params.id);
  res.json({ message: 'Friend deleted successfully' });
});

module.exports = router;