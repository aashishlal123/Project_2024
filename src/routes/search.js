const { Router } = require('express'),
  { user } = require('../controllers'),
  verifyJWT = require('../middleware/verifyJWT'),
  router = Router();

router.get(
  '/users',
  (req, res, next) => verifyJWT(req, res, next, true),
  user.searchUsers
);

module.exports = router;
