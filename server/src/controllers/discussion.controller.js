const Problem = require('../models/discussion.model');

exports.createProblem = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, question } = req.body;

    if (!subject || !question) {
      return res.status(400).json({
        success: false,
        message: "Subject and question are required",
      });
    }

    const problem = await Problem.create({
      subject,
      question,
      user: req.user._id,
    });

    const populated = await Problem.findById(problem._id).populate('user', 'fullName email');

    res.status(201).json({
      success: true,
      data: populated,
    });

  } catch (error) {
    console.error("Create Problem Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .populate("user", "fullName email")
      .populate("comments.user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);

  } catch (error) {
    console.error("Get Problems Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this problem" });
    }

    await Problem.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Problem deleted" });

  } catch (error) {
    console.error("Delete Problem Error:", error);
    res.status(500).json({ message: error.message });
  }
};