const { APIError } = require('../utils').errorHandler;
const { loginUser } = require('../services/auth/helpers');
const { User, Profile } = require('../db/models');
const {
  deleteAccount,
  disableAccountToogle,
  profileViewToogle,
  filterPostsToogle,
  filterOffensiveMessageToogle,
  updateUserInformation,
  passwordConfirmation,
  loadChildAccounts,
} = require('../services/settings');

exports.deleteAccount = async (req, res, next) => {
  try {
    const serializedMessage = await deleteAccount(req.user.id);
    res
      .status(200)
      .json(
        serializedMessage === 1
          ? { status: 200, message: 'Successfully deleted user' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.disableAccountToogle = async (req, res, next) => {
  try {
    const serializedMessage = await disableAccountToogle(req.user);
    res
      .status(200)
      .json(
        serializedMessage[0] === 1
          ? { status: 200, message: 'Successfully changed profile status' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.profileViewToogle = async (req, res, next) => {
  try {
    const serializedMessage = await profileViewToogle(req.user);
    res
      .status(200)
      .json(
        serializedMessage[0] === 1
          ? { status: 200, message: 'Successfully changed profile view' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.filterPostsToogle = async (req, res, next) => {
  try {
    const serializedMessage = await filterPostsToogle(req.user);
    res.status(200).json(
      serializedMessage[0] === 1
        ? {
            status: 200,
            message: 'Successfully changed profile filter post view',
          }
        : serializedMessage
    );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.filterOffensiveMessageToogle = async (req, res, next) => {
  try {
    const serializedMessage = await filterOffensiveMessageToogle(req.user);
    res.status(200).json(
      serializedMessage[0] === 1
        ? {
            status: 200,
            message:
              'Successfully changed profile filter offensive message view',
          }
        : serializedMessage
    );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

const getChildInfo = async (id, parentId) => {
  return await User.findOne({
    where: {
      id,
      parentId,
      deletedAt: null,
    },
    include: { model: Profile, as: 'profile' },
  })
    .then(async (user) => {
      if (user) {
        return user;
      }
      return null;
    })
    .catch((error) => {
      return new Error(error);
    });
};

exports.childProfileViewToogle = async (req, res, next) => {
  try {
    let { currentPassword, id, parentId } = req.body;
    let isAuthorized = await loginUser(currentPassword, req.user);
    if (isAuthorized?.accessToken) {
      const user = await getChildInfo(id, parentId);
      if (user) {
        const serializedMessage = await profileViewToogle(user);
        res
          .status(200)
          .json(
            serializedMessage[0] === 1
              ? { status: 200, message: 'Successfully changed profile view' }
              : serializedMessage
          );
      } else {
        next(APIError.badRequest(error));
      }
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.childFilterPostsToogle = async (req, res, next) => {
  try {
    let { currentPassword, id, parentId } = req.body;
    let isAuthorized = await loginUser(currentPassword, req.user);
    if (isAuthorized?.accessToken) {
      const user = await getChildInfo(id, parentId);
      if (user) {
        const serializedMessage = await filterPostsToogle(user);
        res.status(200).json(
          serializedMessage[0] === 1
            ? {
                status: 200,
                message: 'Successfully changed profile filter post view',
              }
            : serializedMessage
        );
      } else {
        next(APIError.badRequest(error));
      }
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.childFilterOffensiveMessageToogle = async (req, res, next) => {
  try {
    let { currentPassword, id, parentId } = req.body;
    let isAuthorized = await loginUser(currentPassword, req.user);
    if (isAuthorized?.accessToken) {
      const user = await getChildInfo(id, parentId);
      if (user) {
        const serializedMessage = await filterOffensiveMessageToogle(user);
        res.status(200).json(
          serializedMessage[0] === 1
            ? {
                status: 200,
                message:
                  'Successfully changed profile filter offensive message view',
              }
            : serializedMessage
        );
      } else {
        next(APIError.badRequest(error));
      }
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.updateUserInformation = async (req, res, next) => {
  try {
    let { currentPassword, data } = req.body;
    let serializedMessage = await updateUserInformation(
      req.user,
      currentPassword,
      data
    );
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};

exports.passwordConformation = async (req, res, next) => {
  try {
    let { password } = req.body;
    let serializedMessage = await passwordConfirmation(req.user.id, password);
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};

exports.loadChildrenAccounts = async (req, res, next) => {
  try {
    let serializedMessage = await loadChildAccounts(req.user.id);
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};
