const { Op, fn, col } = require('sequelize');
const { Hashtag, Post, Profile } = require('../../db/models');
const { hashtagSerializer } = require('../../serializers');
const { Pagination } = require('../../utils');

module.exports = async (page = 1, size = 20, hashtag) => {
  const pagination = new Pagination(page, size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();

  return await Hashtag.findAll({
    where: { hashtag: { [Op.regexp]: hashtag } },
    include: [
      {
        model: Post,
        as: 'Post',
        where: { deletedAt: null },
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: [],
            where: { profileStatus: 'Public' },
          },
        ],
      },
    ],
    attributes: ['Hashtag.hashtag', [fn('COUNT', col('Post')), 'posts']],
    group: ['Hashtag.hashtag'],
    raw: true,
    distinct: ['Hashtag.hashtag', 'Post.id'],
    order: [[col('posts'), 'DESC']],
    pagination,
    offset,
    limit,
  })
    .then(async (data) => {
      const dataCount = data.length;
      const pageLinkOffsets = pagination.getPageNos(dataCount);
      let serializedData = await hashtagSerializer(data, pageLinkOffsets);
      return serializedData;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
