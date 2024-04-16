const express = require('express'),
  router = express.Router(),
  multer = require('multer'),
  path = require('path'),
  fs = require('fs'),
  uuid = require('uuid'),
  { post, comment } = require('../controllers'),
  { APIError } = require('../utils/errorHandler'),
  verifyJWT = require('../middleware/verifyJWT'),
  postPath = (userName) => `/opt/metagram/${userName}/posts`,
  storage = multer.diskStorage({
    destination: async (req, file, next) => {
      next(null, postPath(req.user.userName));
    },
    filename: async (req, file, next) => {
      fs.mkdirSync(postPath(req.user.userName), { recursive: true });
      next(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    },
  });

function checkFileType(file, next) {
  const filetypes = /jpeg|jpg|png|mp4|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return next(null, true);
  } else {
    return next(
      APIError.unsupportedMediaType('Post can only be jpeg, jpg, png or mp4')
    );
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 1000000000 },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).array('postImages', 4);

router.get('/posts/timeline', verifyJWT, post.getFollowedPosts);

router
  .route('/posts/:postId')
  .get((req, res, next) => verifyJWT(req, res, next, true), post.getPost)
  .patch(verifyJWT, post.updatePost)
  .delete(verifyJWT, post.deletePost);

router
  .route('/:profileId/posts')
  .get((req, res, next) => verifyJWT(req, res, next, true), post.getPosts)
  .post(
    verifyJWT,
    (req, res, next) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return next(APIError.badRequest(err));
        } else if (err?.statusCode === 415) {
          return res.status(200).json(err);
        } else if (err) {
          return next(APIError.internalServerError(err));
        } else if (req.files.length === 0) {
          return next(APIError.badRequest({ message: 'No Images Found' }));
        }
        next();
      });
    },
    post.addPost
  );

router.post('/posts/:postId/toogleLike', verifyJWT, post.toogleLike);
router.get('/likedPosts', verifyJWT, post.getPostLiked);
router.get('/posts/:postId/likes', post.getPostLikes);

router
  .route('/posts/:postId/comments')
  .get((req, res, next) => verifyJWT(req, res, next, true), comment.getComments)
  .post(verifyJWT, comment.addComment);

router.delete(
  '/posts/:postId/comments/:commentId',
  verifyJWT,
  comment.deleteComment
);

module.exports = router;
