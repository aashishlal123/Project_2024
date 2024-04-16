const { Pagination } = require('../../utils');
const { getUserPosts } = require('./helpers');

module.exports = async (req) => {
  const sortingQuery = [
    req.query.sort || 'createdAt',
    req.query.order || 'desc',
  ];
  const pagination = new Pagination(req.query.page, req.query.size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();
  let serializedMessage = await getUserPosts(
    pagination,
    limit,
    offset,
    sortingQuery,
    req.params.profileId,
    req.user
  );
  return serializedMessage;
};
