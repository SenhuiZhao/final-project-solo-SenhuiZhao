const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },    
    ans_date_time: {
        type: Date,
        default: () => new Date()
    }, 
    questions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    votes: [{
        type: Schema.Types.ObjectId,
        ref: 'votes'
    }],
});


module.exports = mongoose.model('answers', answerSchema);