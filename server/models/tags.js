const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions"
  }],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

//   tagSchema.virtual('url').get(function () {
//     return 'posts/tag/' + _id;
//   });

module.exports = mongoose.model('tags', tagSchema);