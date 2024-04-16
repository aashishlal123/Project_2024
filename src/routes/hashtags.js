const { Router } = require('express'),
  { hashtag } = require('../controllers'),
  verifyJWT = require('../middleware/verifyJWT'),
  router = Router();

router.route('/trending').get(verifyJWT, hashtag.getTrendingHashtags);
router.route('/explore').get(verifyJWT, hashtag.explore);
router.route('/explore/:hashtag').get(verifyJWT, hashtag.explored);

module.exports = router;
