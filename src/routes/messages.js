const { Router } = require('express'),
  { messages } = require('../controllers'),
  verifyJWT = require('../middleware/verifyJWT'),
  router = Router();

router
  .route('/rooms/:roomId')
  .get(verifyJWT, messages.getRoom)
  .delete(verifyJWT, messages.deleteRoom);

router
  .route('/rooms')
  .get(verifyJWT, messages.getRooms)
  .post(verifyJWT, messages.addRoom);

router
  .route('/rooms/:roomId/messages')
  .get(verifyJWT, messages.getMessages)
  .post(verifyJWT, messages.sendMessage);

router
  .route('/rooms/:roomId/messages/:messageId')
  .delete(verifyJWT, messages.deleteMessage);

module.exports = router;
