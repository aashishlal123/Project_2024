const { Op, fn } = require('sequelize');
const { Hashtag, Post, Profile, PostImage, User } = require('../../db/models');
const { postSerializer } = require('../../serializers');
const { Pagination } = require('../../utils');

module.exports = async (page = 1, size = 20) => {
  const sortingQuery = ['createdAt', 'desc'];
  const pagination = new Pagination(page, size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();

  return await Post.findAndCountAll({
    where: { deletedAt: null },
    include: [
      { model: Hashtag, as: 'hashtag', attributes: [] },
      { model: PostImage, as: 'postImage', attributes: ['image'] },
      {
        model: Profile,
        as: 'Profile',
        attributes: ['id', 'userId'],
        where: { profileStatus: 'Public' },
        include: [{ model: User, as: 'User', attributes: ['userName'] }],
      },
    ],
    // order: [fn('RANDOM')],
    order: [sortingQuery],
    distinct: true,
    limit,
    offset,
  })
    .then(async (data) => {
      if (data.count > 0) {
        const dataCount = data.count;
        const pageLinkOffsets = pagination.getPageNos(dataCount);
        let serializedData = await postSerializer(
          data.rows,
          undefined,
          pageLinkOffsets
        );
        return { count: data.count, ...serializedData };
      } else {
        return {
          status: 404,
          message: `Opps looks like there is nothing to explore`,
        };
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};
