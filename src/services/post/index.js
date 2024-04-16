const getPost = require('./userPost.service');
const getPosts = require('./userPosts.service');
const addPost = require('./addPost.service');
const updatePost = require('./updatePost.service');
const deletePost = require('./deletePost.service');
const toogleLike = require('./toogleLike.service');
const getLikes = require('./getLikes.service');
const getLiked = require('./getLiked.service');
const followedPosts = require('./followedPosts.service');

module.exports = {
  getPost,
  getPosts,
  addPost,
  updatePost,
  deletePost,
  toogleLike,
  getLikes,
  getLiked,
  followedPosts,
};
