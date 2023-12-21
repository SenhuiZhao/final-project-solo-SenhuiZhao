const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 1
    },
    summary: {
        type: String,
        required: true,
        maxLength: 140,
        minLength: 1
    },
    text: {
        type: String,
        required: true,
        minLength: 1
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tags',
            required: true
        }
    ],
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'answers'
    }],
    asked_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    ask_date_time: {
        type: Date,
        default: () => new Date()
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    votes: [{
        type: Schema.Types.ObjectId,
        ref: 'votes'
    }]
});

module.exports = mongoose.model('questions', questionSchema);

