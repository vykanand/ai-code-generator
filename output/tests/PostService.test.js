const PostService = require('../services/PostService');
const assert = require('assert');
const { initService } = require('./testInit');

let service;

beforeEach(() => {
  service = initService(PostService);
});

describe('PostService', () => {
  describe('createPost', () => {
    it('should create a new post', async () => {
      const post = await PostService.createPost({ title: 'My first post', body: 'This is my first post on this platform!' });
      assert.ok(post._id);
      assert.strictEqual(post.title, 'My first post');
      assert.strictEqual(post.body, 'This is my first post on this platform!');
    });
  });

  describe('getPosts', () => {
    it('should get all posts', async () => {
      const posts = await PostService.getPosts();
      assert.ok(posts.length > 0);
    });
  });

  describe('getPostById', () => {
    it('should get a post by id', async () => {
      const post = await PostService.createPost({ title: 'My first post', body: 'This is my first post on this platform!' });
      const foundPost = await PostService.getPostById(post._id);
      assert.strictEqual(foundPost.title, 'My first post');
      assert.strictEqual(foundPost.body, 'This is my first post on this platform!');
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const post = await PostService.createPost({ title: 'My first post', body: 'This is my first post on this platform!' });
      const updatedPost = await PostService.updatePost(post._id, { title: 'My updated post', body: 'This is my updated post!' });
      assert.strictEqual(updatedPost.title, 'My updated post');
      assert.strictEqual(updatedPost.body, 'This is my updated post!');
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const post = await PostService.createPost({ title: 'My first post', body: 'This is my first post on this platform!' });
      await PostService.deletePost(post._id);
      const foundPost = await PostService.getPostById(post._id);
      assert.strictEqual(foundPost, null);
    });
  });
});