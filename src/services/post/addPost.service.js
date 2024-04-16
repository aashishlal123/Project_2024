const { Post, PostImage, Hashtag } = require('../../db/models');
const postSerializer = require('../../serializers/post.serializer');

module.exports = async (req) => {
  const { caption, isChildSafe, hashtags } = req.body;
  let postImage = [];
  await req.files.map(
    (file) => (postImage = [...postImage, { image: file.filename }])
  );

  let newPost = await new Post(
    {
      profileId: req.params.profileId,
      caption,
      isChildSafe,
      postImage,
    },
    {
      include: [
        {
          model: PostImage,
          as: 'postImage',
        },
      ],
    }
  );

  let createdPost = await newPost.save().then(async (post) => {
    hashtags.split(',').map((hash) => {
      if (hash !== 'null') {
        Hashtag.findOrCreate({
          where: { postId: post.id, hashtag: hash },
        }).then(([user, created]) => {
          if (!created) {
            Hashtag.update(
              { totalUsed: user.totalUsed + 1 },
              { where: { postId: post.id, hashtag: hash } }
            );
          }
        });
      }
    });

    return await postSerializer(post);
  });
  return createdPost;
};
