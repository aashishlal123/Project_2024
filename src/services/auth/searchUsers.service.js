const { getUsers } = require('./helpers');
const { Pagination } = require('../../utils');
const searchHastag = require('../hashtag/searchHastag.service');

module.exports = async (user, page, currentUser) => {
  const sortingQuery = ['createdAt', 'desc'];
  const pagination = new Pagination(page, 20);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();
  try {
    if (user.slice(0, 1) === '#') {
      let hashtags = await searchHastag(page, 20, user);
      return { type: 'hashtag', ...hashtags };
    }
    let users = await getUsers(
      pagination,
      limit,
      offset,
      sortingQuery,
      user,
      currentUser
    );
    return { type: 'users', ...users };
  } catch (error) {
    throw new Error(error);
  }
};
