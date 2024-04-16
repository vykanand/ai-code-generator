const FriendService = require('../services/FriendService');
const assert = require('assert');
const { initService } = require('./testInit');

let service;

beforeEach(() => {
  service = initService(FriendService);
});

describe('FriendService', () => {
  describe('createFriend', () => {
    it('should create a new friend', async () => {
      const friend = await FriendService.createFriend({ name: 'John Doe', age: 30 });
      assert.ok(friend._id);
      assert.strictEqual(friend.name, 'John Doe');
      assert.strictEqual(friend.age, 30);
    });
  });

  describe('getFriends', () => {
    it('should get all friends', async () => {
      const friends = await FriendService.getFriends();
      assert.ok(friends.length > 0);
    });
  });

  describe('getFriendById', () => {
    it('should get a friend by id', async () => {
      const friend = await FriendService.createFriend({ name: 'John Doe', age: 30 });
      const foundFriend = await FriendService.getFriendById(friend._id);
      assert.strictEqual(foundFriend.name, 'John Doe');
      assert.strictEqual(foundFriend.age, 30);
    });
  });

  describe('updateFriend', () => {
    it('should update a friend', async () => {
      const friend = await FriendService.createFriend({ name: 'John Doe', age: 30 });
      const updatedFriend = await FriendService.updateFriend(friend._id, { name: 'Jane Doe', age: 31 });
      assert.strictEqual(updatedFriend.name, 'Jane Doe');
      assert.strictEqual(updatedFriend.age, 31);
    });
  });

  describe('deleteFriend', () => {
    it('should delete a friend', async () => {
      const friend = await FriendService.createFriend({ name: 'John Doe', age: 30 });
      await FriendService.deleteFriend(friend._id);
      const foundFriend = await FriendService.getFriendById(friend._id);
      assert.strictEqual(foundFriend, null);
    });
  });
});