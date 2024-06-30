// models/post.model.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    author: String,
    date: { type: Date, default: Date.now },
})

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'  },
    content: { type: String  },
    comment: [commentSchema],
    likes: [String],
    photos: [String],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
