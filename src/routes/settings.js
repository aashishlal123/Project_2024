const { Router } = require('express'),
  { settings } = require('../controllers'),
  verifyJWT = require('../middleware/verifyJWT'),
  router = Router();

router.patch('/disableAccount', verifyJWT, settings.disableAccountToogle);
router.delete('/deleteAccount', verifyJWT, settings.deleteAccount);
router.patch('/profileView', verifyJWT, settings.profileViewToogle);
router.patch('/filterPostsView', verifyJWT, settings.filterPostsToogle);
router.patch(
  '/filterOffensiveMessageView',
  verifyJWT,
  settings.filterOffensiveMessageToogle
);
router.patch('/childProfileView', verifyJWT, settings.childProfileViewToogle);
router.patch(
  '/childFilterPostsView',
  verifyJWT,
  settings.childFilterPostsToogle
);
router.patch(
  '/childFilterOffensiveMessageView',
  verifyJWT,
  settings.childFilterOffensiveMessageToogle
);
router.patch('/updateUser', verifyJWT, settings.updateUserInformation);
router.post('/passwordConformation', verifyJWT, settings.passwordConformation);
router.get('/loadChildAccounts', verifyJWT, settings.loadChildrenAccounts);

module.exports = router;
