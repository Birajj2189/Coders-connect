const DiscussionThread = require("../models/DiscussionThread");

// POST: Create a new thread
exports.createThread = async (req, res) => {
	try {
		const { title, content, author, anonymous } = req.body;
		const newThread = new DiscussionThread({
			title,
			content,
			author,
			anonymous,
		});
		await newThread.save();
		res.status(201).json(newThread);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// GET: Get all threads
exports.getAllThreads = async (req, res) => {
	try {
		const threads = await DiscussionThread.find().populate("author");
		res.status(200).json(threads);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// GET: Get a thread by ID
exports.getThreadById = async (req, res) => {
	try {
		const thread = await DiscussionThread.findById(req.params.id).populate(
			"author"
		);
		if (!thread) return res.status(404).json({ message: "Thread not found" });
		res.status(200).json(thread);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// GET: Filter threads by user
exports.getThreadsByUser = async (req, res) => {
	try {
		const threads = await DiscussionThread.find({
			author: req.params.userId,
		}).populate("author");
		res.status(200).json(threads);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// PUT: Update a thread by ID
exports.updateThread = async (req, res) => {
	try {
		const { title, content, anonymous } = req.body;
		const thread = await DiscussionThread.findByIdAndUpdate(
			req.params.id,
			{ title, content, anonymous, updatedAt: Date.now() },
			{ new: true }
		);
		if (!thread) return res.status(404).json({ message: "Thread not found" });
		res.status(200).json(thread);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// DELETE: Delete a thread by ID
exports.deleteThread = async (req, res) => {
	try {
		const thread = await DiscussionThread.findByIdAndDelete(req.params.id);
		if (!thread) return res.status(404).json({ message: "Thread not found" });
		res.status(200).json({ message: "Thread deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// GET: Filter threads by skill(s)
exports.filterThreadsBySkills = async (req, res) => {
	const { skills } = req.query; // expecting an array of skills
	try {
		// Assuming you have a "skills" field in your schema or model (update schema accordingly)
		const threads = await DiscussionThread.find({
			skills: { $in: skills },
		}).populate("author");
		res.status(200).json(threads);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
