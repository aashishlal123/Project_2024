const { Router } = require('express'),
  { user } = require('../controllers'),
  verifyJWT = require('../middleware/verifyJWT'),
  multer = require('multer'),
  router = Router(),
  upload = multer();

router.post('/login', upload.none(), user.login);
router.post('/register', user.register);
router.post('/emailConformation', user.sendConformationMail);
router.post('/attempt', user.validateRegistration);
router.post('/validateRegistration', user.validateAll);

module.exports = router;
