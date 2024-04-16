const { Hashtag, Post, Profile, PostImage, User } = require('../../db/models');
const { postSerializer } = require('../../serializers');
const { Pagination } = require('../../utils');

module.exports = async (page = 1, size = 20, hashtag) => {
  const sortingQuery = ['createdAt', 'desc'];
  const pagination = new Pagination(page, size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();

  return await Post.findAndCountAll({
    include: [
      { model: Hashtag, as: 'hashtag', attributes: [], where: { hashtag } },
      {
        model: Profile,
        as: 'Profile',
        attributes: ['id', 'userId'],
        where: { profileStatus: 'Public' },
        include: [{ model: User, as: 'User', attributes: ['userName'] }],
      },
      { model: PostImage, as: 'postImage', attributes: ['image'] },
    ],
    order: [sortingQuery],
    limit,
    offset,
  })
    .then(async (data) => {
      if (data) {
        const dataCount = data.count;
        const pageLinkOffsets = pagination.getPageNos(dataCount);
        let serializedData = await postSerializer(
          data.rows,
          undefined,
          pageLinkOffsets
        );
        return { hashtag, count: dataCount, ...serializedData };
      } else {
        return {
          status: 404,
          message: `No Posts found assoicated with ${hashtag}`,
        };
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};
