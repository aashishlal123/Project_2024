const { Pagination } = require('../../utils');
const { getFollowedPosts } = require('./helpers');

module.exports = async (page, size, user) => {
  const sortingQuery = ['updatedAt', 'desc'];
  const pagination = new Pagination(page, size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();
  let serializedMessage = await getFollowedPosts(
    pagination,
    limit,
    offset,
    sortingQuery,
    user
  );
  return serializedMessage;
};
