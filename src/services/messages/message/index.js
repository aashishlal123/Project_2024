const getMessages = require('./getMessages.service');
const sendMessage = require('./sendMessage.service');
const deleteMessage = require('./deleteMessage.service');

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
};
