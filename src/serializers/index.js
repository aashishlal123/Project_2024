const errorSerializer = require('./error.serializer');
const postSerializer = require('./post.serializer');
const serializer = require('./serializer');
const userSerializer = require('./user.serializer');
const profileSerializer = require('./profile.serializer');
const followingSerializer = require('./following.serializer');
const followersSerializer = require('./followers.serializer');
const likeSerializer = require('./like.serializer');
const getLikesSerializer = require('./getLikes.serializer');
const commentSerializer = require('./comment.serializer');
const roomSerializer = require('./room.serializer');
const messageSerializer = require('./message.serializer');
const hashtagSerializer = require('./hashtag.serializer');

module.exports = {
  errorSerializer,
  postSerializer,
  profileSerializer,
  serializer,
  userSerializer,
  followingSerializer,
  followersSerializer,
  likeSerializer,
  getLikesSerializer,
  commentSerializer,
  roomSerializer,
  messageSerializer,
  hashtagSerializer,
};
