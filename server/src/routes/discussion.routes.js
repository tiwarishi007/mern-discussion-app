// const express = require('express');
// const router = express.Router();
// const {createProblem, getProblems} = require('../controllers/discussion.controller');
// const { protectRoutes } = require('../middleware/auth.middleware');
// const Problem = require('../models/discussion.model');

// router.post('/createProblem', protectRoutes, createProblem);
// router.get('/getProblem',  getProblems);
// router.post("/addComment/:id", async (req, res) => {
//   const { text } = req.body;

//   const problem = await Problem.findById(req.params.id);

//   problem.comments.push({
//     text,
//     createdAt: new Date(),
//   });

//   await problem.save();

//   res.json(problem.comments[problem.comments.length - 1]);
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

const { createProblem, getProblems, deleteProblem } = require('../controllers/discussion.controller');
const { protectRoutes } = require('../middleware/auth.middleware');
const Problem = require('../models/discussion.model');

// CREATE
router.post('/createProblem', protectRoutes, createProblem);

// GET ALL
router.get('/getProblem', getProblems);

// DELETE
router.delete('/delete/:id', protectRoutes, deleteProblem);

// MARK AS SOLVED / OPEN
router.patch('/solve/:id', protectRoutes, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Only the owner can toggle solved
    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    problem.solved = req.body.solved;
    await problem.save();

    res.json({ success: true, solved: problem.solved });
  } catch (err) {
    console.error('Solve toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD COMMENT
router.post('/addComment/:id', protectRoutes, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const newComment = {
      text: text.trim(),
      user: req.user._id,
      createdAt: new Date(),
    };

    problem.comments.push(newComment);
    await problem.save();

    // Return comment with user info
    const populatedProblem = await Problem.findById(req.params.id)
      .populate('comments.user', 'fullName');

    const savedComment = populatedProblem.comments[populatedProblem.comments.length - 1];
    res.status(201).json(savedComment);

  } catch (err) {
    console.error('Add Comment Error:', err);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

module.exports = router;