const { APIError } = require('../utils').errorHandler;
const { userSerializer } = require('../serializers');
const {
  loginUser,
  registerUser,
  validateField,
  validateAllFields,
  sendEmailConformation,
  searchUsers,
  loadChildAccounts,
} = require('../services/auth');

exports.register = async (req, res, next) => {
  let data = ({
    email,
    userName,
    fullName,
    password,
    birthday,
    conformationCode,
  } = req.body);
  try {
    let serializedMessage = await registerUser({ ...data, profile: [{}] });
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.login = async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  let user = await loginUser(emailOrUsername, password, next);
  return res.status(200).json(
    user.accessToken
      ? {
          ...(await userSerializer(user.user)),
          accessToken: user.accessToken,
        }
      : user
  );
};

exports.sendConformationMail = async (req, res, next) => {
  try {
    let serializedMessage = await sendEmailConformation(req.body.email);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};

exports.validateRegistration = async (req, res, next) => {
  const { fieldName, value } = req.body;
  try {
    let serializedMessage = await validateField(fieldName, value);
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};

exports.validateAll = async (req, res, next) => {
  try {
    let serializedMessage = await validateAllFields(req.body);
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    let serializedMessage = await searchUsers(
      req.query.value,
      req.query.page,
      req.user
    );
    res.status(200).json(serializedMessage);
  } catch (error) {
    return next(APIError.internalServerError(error));
  }
};
