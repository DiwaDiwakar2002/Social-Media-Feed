// controllers/post.controller.js
const fs = require('fs');
const Post = require('../Models/post.model');

// Upload files to upload folder
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

// Create a new post
const createPost = async (req, res) => {
    try {
        const { content, photos } = req.body;
        const user = req.user;  // User is already verified by middleware

        const postDoc = await Post.create({
            user: user.id,
            content,
            photos,
        });

        res.status(200).json(postDoc);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: error.message });
    }
};

const getPost = async (req, res)=>{
    try {
        const postDoc = await Post.find()
        res.status(200).json(postDoc)
        
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    uploadFile,
    createPost,
    getPost
};
