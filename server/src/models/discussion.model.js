const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const problemSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true, trim: true },
      upvotes: { type: Number, default: 0 },
    }
  ],
  solved: {
    type: Boolean,
    default: false,
  },
  comments: [commentSchema],
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;