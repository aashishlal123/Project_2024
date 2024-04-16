const { Op } = require('sequelize');
const {
  User,
  Profile,
  Post,
  PostImage,
  Hashtag,
  Comment,
} = require('../../../db/models');
const { postSerializer } = require('../../../serializers');

const getPostDetail = async (id, user = undefined) => {
  if (id) {
    return await Post.findOne({
      where: { id },
      include: [
        {
          model: Profile,
          as: 'Profile',
          include: 'User',
        },
        { model: PostImage, as: 'postImage' },
        { model: Hashtag, as: 'hashtag' },
      ],
    })
      .then(async (post) => {
        if (post) {
          const currentUser = user && (await user.getProfile());
          user
            ? post.Profile.setDataValue(
                'isCurrentUser',
                currentUser.id === post.profileId
              )
            : post.Profile.setDataValue('isCurrentUser', null);
          return post;
        }
        return { status: 404, message: 'Post not found' };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
  return { status: 404, message: 'no post found with given id' };
};

const getUserPosts = async (
  pagination,
  limit,
  offset,
  sortingQuery,
  profileId,
  user
) => {
  if (profileId) {
    let profile = user
      ? await Profile.findOne({ where: { userId: user.id } })
      : null;
    return await Post.findAndCountAll({
      where: profile?.filterPost
        ? { profileId, isChildSafe: true }
        : { profileId },
      offset,
      limit,
      order: [sortingQuery],
      distinct: true,
      include: [
        { model: PostImage, as: 'postImage' },
        { model: Hashtag, as: 'hashtag' },
      ],
    })
      .then(async (posts) => {
        if (posts.count > 0) {
          const dataCount = posts.count;
          const pageLinkOffsets = pagination.getPageNos(dataCount);
          let serializedData = await postSerializer(
            posts.rows,
            profileId,
            pageLinkOffsets
          );
          return serializedData;
        }
        return { status: 204, message: 'No Posts Added' };
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }
  return { status: 404, message: 'no profile found with given id' };
};

const calculateAge = (birthday) => {
  const diffTime = Math.abs(new Date() - new Date(birthday));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
};

const getFollowedPosts = async (
  pagination,
  limit,
  offset,
  sortingQuery,
  user
) => {
  if (user) {
    let profile = await user.getProfile();

    let posts = await Post.findAndCountAll({
      where: profile.filterPost
        ? { isChildSafe: true, deletedAt: null }
        : { deletedAt: null },
      include: [
        {
          model: Profile,
          as: 'Profile',
          attributes: ['id', 'userId', 'image'],
          where: { userId: { [Op.not]: user.id } },
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['userName'],
            },
            {
              model: User,
              as: 'Followers',
              where: { id: user.id },
              attributes: [],
            },
          ],
        },
        { model: PostImage, as: 'postImage' },
        {
          model: User,
          as: 'Liked',
          attributes: ['id', 'email', 'userName'],
        },
        {
          model: Comment,
          as: 'Comment',
        },
      ],
      pagination,
      order: [sortingQuery],
      distinct: true,
      offset,
      limit,
    })
      .then(async (posts) => {
        if (posts.count > 0) {
          const dataCount = posts.count;
          const pageLinkOffsets = pagination.getPageNos(dataCount);
          let serializedData = await postSerializer(
            posts.rows,
            user.id,
            pageLinkOffsets
          );
          return serializedData;
        }
        return { status: 204, message: 'No posts to show' };
      })
      .catch((error) => {
        throw new Error(error);
      });
    return posts;
  }
};

module.exports = { getPostDetail, getUserPosts, getFollowedPosts };
