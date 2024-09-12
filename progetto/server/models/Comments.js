const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    date: { type: Date, default: Date.now },
    text: String
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;