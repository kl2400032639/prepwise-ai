const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadResumeAndGenerateQuestions,
  submitInterviewAndGetFeedback,
  getDashboardStats,
  getInterviewHistory,
  getInterviewById,
} = require('../controllers/interviewController');

const router = express.Router();

router.post('/setup', protect, upload.single('resume'), uploadResumeAndGenerateQuestions);
router.post('/:interviewId/submit', protect, submitInterviewAndGetFeedback);
router.get('/dashboard', protect, getDashboardStats);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);

module.exports = router;
