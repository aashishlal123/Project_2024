const disableAccountToogle = require('./disableAccountToogle');
const deleteAccount = require('./deleteAccount');
const profileViewToogle = require('./profileViewToogle');
const filterPostsToogle = require('./filterPostsToogle');
const filterOffensiveMessageToogle = require('./filterOffensiveMessageToogle');
const updateUserInformation = require('./updateUserInformation.service');
const passwordConfirmation = require('./passwordConfirmation.service');
const loadChildAccounts = require('./loadChildAccounts.service');

module.exports = {
  disableAccountToogle,
  deleteAccount,
  profileViewToogle,
  filterPostsToogle,
  filterOffensiveMessageToogle,
  updateUserInformation,
  passwordConfirmation,
  loadChildAccounts,
};
