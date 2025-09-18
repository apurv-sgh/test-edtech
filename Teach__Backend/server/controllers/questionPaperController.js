const QuestionPaper = require('../models/QuestionPaper');

// @desc Get all question papers
// @route GET /api/questionpapers
// access public
const getQuestionPapers = async (req, res) => {
    try {
        const papers = await QuestionPaper.find({});
        res.json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single question paper by ID
// @route GET /api/questionpapers/:id
// @access public
const getQuestionPaperById = async (req, res) => {
    try {
        const paper = await QuestionPaper.findById(req.params.id);
        if (paper) {
            // FIX: Ensure the output matches the frontend's expected 'title' if needed,
            // or modify frontend to use 'paperTitle'
            res.json(paper);
        } else {
            res.status(404).json({ message: 'Question paper not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a new question paper
// @route POST /api/questionpapers
// @access public
const createQuestionPaper = async (req, res) => {
    // FIX 1: Change 'questoins' to 'questions'
    const { paperTitle, subject, duration, totalMarks, instructions, questions, user } = req.body;

    if (!paperTitle || !subject || !duration || !totalMarks) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // FIX 2: Correct variable name from 'questonPaper' to 'questionPaper'
        const questionPaper = new QuestionPaper({
            paperTitle,
            subject,
            duration,
            totalMarks,
            instructions,
            questions, // FIX 3: Use 'questions'
            user: user.id// Provide a dummy user ID or remove if not required
        });

        const createdPaper = await questionPaper.save(); // FIX 4: Correct variable name
        res.status(201).json(createdPaper);
    } catch (error) {
        console.error("Error creating paper:", error); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
};

// @desc Update an existing question paper
// @route PUT /api/questionpapers/:id
// @access public
const updateQuestionPaper = async (req, res) => {
    // FIX 1: Change 'questoins' to 'questions'
    const { paperTitle, subject, duration, totalMarks, instructions, questions } = req.body;

    try {
        const paper = await QuestionPaper.findById(req.params.id);
        if (paper) {
            paper.paperTitle = paperTitle !== undefined ? paperTitle : paper.paperTitle;
            paper.subject = subject !== undefined ? subject : paper.subject;
            paper.duration = duration !== undefined ? duration : paper.duration;
            paper.totalMarks = totalMarks !== undefined ? totalMarks : paper.totalMarks;
            paper.instructions = instructions !== undefined ? instructions : paper.instructions;
            // FIX 2: Use 'questions'
            paper.questions = questions !== undefined ? questions : paper.questions; // completely replace questions array

            const updatedPaper = await paper.save();
            res.json(updatedPaper);
        } else {
            res.status(404).json({ message: 'Question paper not found' });
        }
    } catch (error) {
        console.error("Error updating paper:", error); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete a question paper
// @route DELETE /api/questionpapers/:id
// @access public
const deleteQuestionPaper = async (req, res) => {
    try {
        const paper = await QuestionPaper.findById(req.params.id);

        if (paper) {
            await paper.deleteOne(); // use deleteOne on the document itself
            res.json({ message: 'Question paper removed' });
        } else{
            // FIX: Correct typo 'Quston' to 'Question'
            res.status(404).json({ message: 'Question paper not found' });
        }
    } catch (error) {
        console.error("Error deleting paper:", error); // Log error for debugging
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuestionPapers,
    getQuestionPaperById,
    createQuestionPaper,
    updateQuestionPaper,
    deleteQuestionPaper,
};