const LikeService = require('../services/LikeService');
const assert = require('assert');
const { initService } = require('./testInit');

let service;

beforeEach(() => {
  service = initService(LikeService);
});
describe('LikeService', () => {
  describe('createLike', () => {
    it('should create a new like', async () => {
      const like = await LikeService.createLike({ userId: '12345', postId: '67890' });
      assert.ok(like._id);
      assert.strictEqual(like.userId, '12345');
      assert.strictEqual(like.postId, '67890');
    });
  })
})