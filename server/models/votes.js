const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    type: {
        type: String,
        enum: ['upvote', 'downvote'],
        required: true
    },
    vote_by: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
    answer_id: {
        type: Schema.Types.ObjectId,
        ref: 'answers'
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    }
});

module.exports = mongoose.model('votes', voteSchema);