const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
});

const feedbackSchema = new mongoose.Schema({
  overallScore: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  communicationRating: { type: Number, required: true },
  technicalRating: { type: Number, required: true },
  hrReadinessRating: { type: Number, required: true },
  improvementRecommendations: [{ type: String }],
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  role: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  feedback: feedbackSchema,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
