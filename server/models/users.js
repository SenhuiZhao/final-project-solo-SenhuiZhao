const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: () => new Date()
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions'
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }], 
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags"
    }]

});



userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('users', userSchema);