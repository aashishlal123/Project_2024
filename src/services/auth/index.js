const loginUser = require('./login.service');
const registerUser = require('./register.service');
const validateField = require('./fieldVaidate.service');
const validateAllFields = require('./validateAllFields.service');
const sendEmailConformation = require('./emailConformation.service');
const searchUsers = require('./searchUsers.service.js');

module.exports = {
  loginUser,
  registerUser,
  validateField,
  validateAllFields,
  sendEmailConformation,
  searchUsers,
};
