const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    photos: [{
        type: String
    }],
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', PostSchema);
