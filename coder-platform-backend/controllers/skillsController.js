// controllers/skillController
const User = require("../models/User");
const Skill = require("../models/Skill");

// Add a new skill
const addSkill = async (req, res) => {
	const { name, description, image } = req.body;

	try {
		// Check if skill already exists
		const existingSkill = await Skill.findOne({ name });
		if (existingSkill) {
			return res.status(400).json({ error: "Skill already exists" });
		}

		// Create a new skill
		const skill = new Skill({ name, description, image });
		await skill.save();
		res.status(201).json(skill);
	} catch (error) {
		res.status(500).json({ error: "Error adding skill" });
	}
};

// Update a skill by ID
const updateSkill = async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;

	try {
		// Find the skill by ID
		const skill = await Skill.findById(id);

		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}

		// Update the skill fields
		skill.name = name || skill.name;
		skill.description = description || skill.description;
		skill.updatedAt = Date.now();

		// Save the updated skill
		await skill.save();
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: "Error updating skill" });
	}
};

// Delete a skill by ID
const deleteSkill = async (req, res) => {
	const { id } = req.params;

	try {
		// Find the skill by ID and delete it
		const skill = await Skill.findByIdAndDelete(id);

		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}

		res.json({ message: "Skill deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting skill" });
	}
};

// Get all skills
// Get skills with pagination
const getAllSkills = async (req, res) => {
	const { page = 1, limit = 50 } = req.query;

	try {
		const skills = await Skill.find()
			.skip((page - 1) * limit)
			.limit(parseInt(limit));

		const total = await Skill.countDocuments();

		res.json({
			skills,
			totalPages: Math.ceil(total / limit),
			currentPage: parseInt(page),
		});
	} catch (error) {
		res.status(500).json({ error: "Error fetching skills with pagination" });
	}
};

// Get skill by ID
const getSkillById = async (req, res) => {
	const { id } = req.params;

	try {
		const skill = await Skill.findById(id);
		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: "Error fetching skill" });
	}
};

// Search skills by name or description
const searchSkills = async (req, res) => {
	const query = req.query.name;
	try {
		const skills = await Skill.find({
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ description: { $regex: query, $options: "i" } },
			],
		});

		res.json(skills);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error searching skills" });
	}
};

// Add multiple skills at once
const addMultipleSkills = async (req, res) => {
	const { skills } = req.body; // Assuming the skills are an array of {name, description}

	try {
		const addedSkills = await Skill.insertMany(skills);
		res.status(201).json(addedSkills);
	} catch (error) {
		res.status(500).json({ error: "Error adding multiple skills" });
	}
};

// Toggle follow/unfollow skill
const toggleFollowSkill = async (req, res) => {
	const userId = req.user.id;

	const { skillId } = req.body;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		const skill = await Skill.findById(skillId);
		if (!skill) return res.status(404).json({ message: "Skill not found" });

		// Check if the user is already following the skill
		const isFollowing = user.followedSkills.includes(skillId);

		if (isFollowing) {
			// Unfollow the skill
			user.followedSkills = user.followedSkills.filter(
				(id) => !id.equals(skillId)
			);
		} else {
			// Follow the skill
			user.followedSkills.push(skillId);
		}

		await user.save();
		res
			.status(200)
			.json({ message: isFollowing ? "Unfollowed skill" : "Followed skill" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

module.exports = {
	addSkill,
	updateSkill,
	deleteSkill,
	searchSkills,
	getAllSkills,
	getSkillById,
	addMultipleSkills,
	toggleFollowSkill,
};
