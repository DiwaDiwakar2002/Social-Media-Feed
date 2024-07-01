// controllers/post.controller.js
const fs = require('fs');
const Post = require('../Models/post.model');
const jwt = require('jsonwebtoken');

const jwtSecret = 'c49w84d9c84w9dc8wdc7';

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: error.message });
    }
};

const uploadFile = async (req, res) => {
    try {
        const uploadedFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
            uploadedFiles.push(newPath.replace('uploads\\', ''));
        }
        res.status(200).json(uploadedFiles);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const { token } = req.cookies;
        const { content, photos } = req.body;

        jwt.verify(token, jwtSecret, async (err, user) => {
            if (err) return res.status(401).json({ message: 'Unauthorized' });
            const postDoc = await Post.create({
                user: user.id,
                content,
                photos,
            });
            res.status(200).json(postDoc);
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: error.message });
    }
};


const postComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const commentVO = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: ` Post not found ${postId}` });
        }
        post.comment.push(commentVO);
        await post.save(); // Save the updated post
        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: error.message });
    }
};

// like

const postLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const postVO = await Post.findById(postId).populate('user');
        const tempLikes = postVO.likes ?? [];
        const index = tempLikes.indexOf(userId);
        if (index > -1) {
            tempLikes.splice(index, 1);
        } else {
            tempLikes.push(userId);
        }
        await postVO.save();
        const updatedPost = await Post.findById(postId).populate('user'); // Re-populate user field
        res.status(200).json({ message: index > -1 ? "Removed" : "Comment added successfully", postVO: updatedPost });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: error.message });
    }
}

const getPostsById = async (req, res) =>{
    try {
        const {id} = req.params
        const post = await Post.find({"user":id})
        if (!post) {
            return res.status(404).json({ message: ` Post not found ${id}`})
            }
            res.status(200).json({message: "Post found", post})
    } catch (error) {
        console.error('Error getting post by id:', error);
        res.status(500).json({ message: error.message });
    }
}

const deletePostById = async (req, res) => {
    try {
        const {id} = req.params
        console.log(id)
        await Post.findByIdAndDelete(id)
        res.status(200).json("post deleted successfully")
    } catch (error) {
        console.error('Error deleting post by id:', error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    uploadFile,
    createPost,
    getPosts,
    postComments,
    postLike,
    getPostsById,
    deletePostById
};
