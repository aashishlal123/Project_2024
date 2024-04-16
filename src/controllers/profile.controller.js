const {
  userProfile,
  editProfile,
  headerProfile,
  getFollowing,
  getFollowers,
  toogleFollowing,
} = require('../services/profile');
const { APIError } = require('../utils/errorHandler');

exports.getProfile = async (req, res, next) => {
  try {
    const profileData = await userProfile(req, res, next);
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res.status(200).json({
        status: 404,
        message: `No Profile with username ${req.params.userName} found`,
      });
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getHeaderProfile = async (req, res, next) => {
  try {
    const profileData = await headerProfile(req, res, next);

    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res.status(200).json({ status: 404, message: 'Problem Getting Profile' });
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const profileData = await editProfile(req, res, next);
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res
        .status(200)
        .json({ status: 404, message: 'Problem Updating Profile' });
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.removeProfilePicture = async (req, res, next) => {
  try {
    req.file = { filename: 'images/profile.jpg' };
    const profileData = await editProfile(req, res, next);
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res
        .status(200)
        .json({ status: 404, message: 'Problem Updating Profile' });
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getFollowingUser = async (req, res, next) => {
  try {
    const userFollowing = await getFollowing(req.params.userName);
    res.status(200).json(userFollowing);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getFollowersUser = async (req, res, next) => {
  try {
    const userFollowers = await getFollowers(req.params.profileId);
    res.status(200).json(userFollowers);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.toogleFollowingUser = async (req, res, next) => {
  try {
    const userFollowed = await toogleFollowing(req.params.profileId, req.user);
    res.status(200).json(userFollowed);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
