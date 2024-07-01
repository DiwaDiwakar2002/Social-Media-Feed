// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile, createPost, getPosts, postComments, postLike, getPostsById, deletePostById } = require("../Controller/post.controller");
const authenticateToken = require('../middleware/authenticateToken');

const photoMiddleware = multer({ dest: 'uploads/' });

router.get("/post", getPosts);
router.post("/upload", photoMiddleware.array('photos', 100), uploadFile);
router.post("/userpost", authenticateToken, createPost);

// get post by Id
router.get("/post-data/:id", getPostsById);
// comment
router.post("/add-comments/:postId", postComments)

// like
router.post("/post-like/:postId", postLike )

// delete post
router.delete("/post-delete/:id", deletePostById)


module.exports = router;
