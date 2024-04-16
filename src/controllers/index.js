const user = require('./user.controller');
const profile = require('./profile.controller');
const post = require('./post.controller');
const comment = require('./comment.controller');
const messages = require('./messages.controller');
const settings = require('./settings.controller');
const hashtag = require('./hashtag.controller');

module.exports = {
  user,
  profile,
  post,
  comment,
  messages,
  settings,
  hashtag,
};
