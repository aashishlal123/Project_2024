const ApiError = require('../../utils/errorHandler/APIError');
const { Profile } = require('../../db/models');
const { profileSerializer } = require('../../serializers');

module.exports = async (req, res, next) => {
  try {
    if (req.user) {
      return await Profile.update(
        req.file ? { image: req.file.filename, ...req.body } : req.body,
        {
          where: { userId: req.user.id },
          returning: true,
        }
      )
        .then(async (updatedRow) => {
          updatedRow[1][0].fullName = req.user.fullName;
          updatedRow[1][0].userName = req.user.userName;
          return await profileSerializer(updatedRow[1][0]);
        })
        .catch((error) => {
          return next(ApiError.internalServerError(error));
        });
    } else {
      return next(ApiError.badRequest('Problem Updating Profile'));
    }
  } catch (error) {
    return next(ApiError.internalServerError(error));
  }
};
