const { Router } = require('express'),
  multer = require('multer'),
  path = require('path'),
  fs = require('fs'),
  uuid = require('uuid'),
  { profile } = require('../controllers'),
  { APIError } = require('../utils/errorHandler'),
  verifyJWT = require('../middleware/verifyJWT'),
  router = Router(),
  imagePath = (userName) => `/opt/metagram/${userName}/profiePicture`,
  storage = multer.diskStorage({
    destination: async (req, file, next) => {
      next(null, imagePath(req.user.userName));
    },
    filename: async (req, file, next) => {
      fs.mkdirSync(imagePath(req.user.userName), { recursive: true });
      next(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    },
  });

function checkFileType(file, next) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return next(null, true);
  } else {
    return next(
      APIError.unsupportedMediaType(
        'Profile Picture can only be jpeg,jpg or png'
      )
    );
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profilePicture');

router.get('/userDetail', verifyJWT, profile.getHeaderProfile);

router
  .route('/:userName')
  .get((req, res, next) => verifyJWT(req, res, next, true), profile.getProfile)
  .put(
    verifyJWT,
    (req, res, next) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return next(APIError.badRequest(err));
        } else if (err?.statusCode === 415) {
          return res.status(200).json(err);
        } else if (err) {
          return next(APIError.internalServerError(err));
        }
        next();
      });
    },
    profile.editProfile
  )
  .patch(verifyJWT, profile.removeProfilePicture);

router.get('/:userName/following', profile.getFollowingUser);
router.get('/:profileId/followers', profile.getFollowersUser);
router.post('/:profileId/toogleFollow', verifyJWT, profile.toogleFollowingUser);

module.exports = router;
