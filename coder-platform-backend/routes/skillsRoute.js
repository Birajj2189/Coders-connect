const express = require("express");
const router = express.Router();
const {
	addSkill,
	updateSkill,
	deleteSkill,
	getAllSkills,
	getSkillById,
	searchSkills,
	addMultipleSkills,
	toggleFollowSkill,
} = require("../controllers/skillsController");
const authAdmin = require("../middleware/authAdmin");
const authenticateToken = require("../middleware/auth");

// Route to add a skill
router.post("/add", authAdmin, addSkill);

// Route to update a skill by ID
router.patch("/update/:id", authAdmin, updateSkill);

// Route to delete a skill by ID
router.delete("/delete/:id", authAdmin, deleteSkill);

// Route to get all skills
router.get("/all-list", getAllSkills);

// Route to search skills (use:  /?name=xyz )
router.get("/search", searchSkills);

// Route to add multiple skills
router.post("/add-bulk", authAdmin, addMultipleSkills);

// Route to get skill by ID
router.get("/:id", getSkillById);

// Route to follow/unfollow skill
router.post("/toggle-follow", authenticateToken, toggleFollowSkill);

file: module.exports = router;
