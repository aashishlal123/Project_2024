const { PostImage, Hashtag } = require('../../db/models');
const { postSerializer } = require('../../serializers');
module.exports = async (currentUser) => {
  let liked = await currentUser.getLike({
    include: [
      { model: PostImage, as: 'postImage' },
      { model: Hashtag, as: 'hashtag' },
    ],
  });
  return await postSerializer(liked);
};
