const express = require('express');
const {
    getQuestionPapers,
    getQuestionPaperById,
    createQuestionPaper,
    updateQuestionPaper,
    deleteQuestionPaper,
} = require('../controllers/questionPaperController');

const router = express.Router();

router.route('/').get(getQuestionPapers).post(createQuestionPaper);
router.route('/:id').get(getQuestionPaperById).put(updateQuestionPaper).delete(deleteQuestionPaper);

module.exports = router;