const Friend = require('../models/Friend');

class FriendService {
  async createFriend(friend) {
    const newFriend = new Friend(friend);
    await newFriend.save();
    return newFriend;
  }

  async getFriends() {
    const friends = await Friend.find();
    return friends;
  }

  async getFriendById(id) {
    const friend = await Friend.findById(id);
    return friend;
  }

  async updateFriend(id, friend) {
    const updatedFriend = await Friend.findByIdAndUpdate(id, friend, { new: true });
    return updatedFriend;
  }

  async deleteFriend(id) {
    await Friend.findByIdAndDelete(id);
  }
}

module.exports = FriendService;