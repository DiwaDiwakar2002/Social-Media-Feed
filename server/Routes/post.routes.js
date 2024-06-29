// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile, createPost, getPost } = require("../Controller/post.controller");
const authenticateToken = require("../Middleware/authenticateToken.js");

// Create a multer instance for file uploads
const photoMiddleware = multer({ dest: 'uploads/' });

router.post("/upload", photoMiddleware.array('photos', 100), uploadFile);
router.post("/userpost", authenticateToken, createPost);

// get all post
router.get('/post', getPost)
module.exports = router;
