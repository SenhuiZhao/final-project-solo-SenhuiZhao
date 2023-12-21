const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    target: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxLength: 140,
        minLength: 1
    },
    com_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    com_date_time: {
        type: Date,
        default: () => new Date()
    },
    commentType: {
        type: String,
        enum: ['question', 'answer'], 
        required: true
    },
    votes: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('comments', commentSchema);
