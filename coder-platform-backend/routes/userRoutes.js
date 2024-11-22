const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
	getAllUsers,
	getUserByUsername,
	updateProfile,
	updateProfilePicture,
	updateCoverPicture,
	deleteProfilePicture,
	deleteCoverPicture,
	deleteUser,
	myProfile,
	toggleFollowUser,
	getFollowers,
	getFollowing,
	getFollowSuggestions,
	getMentionList,
} = require("../controllers/userController");
const multer = require("multer");

// Configure multer storage
const upload = multer({ dest: "uploads/profiles" });

// Route to get mention List
router.get("/mention-list", authenticateToken, getMentionList);

// get follow suggestions
router.get("/follow-suggestions", authenticateToken, getFollowSuggestions);

// Update User Profile Endpoint
router.put("/update-profile", authenticateToken, updateProfile);

// Get the loggined user's profile details
router.get("/my-profile", authenticateToken, myProfile);

// Route to get all users
router.get("/all-users", authenticateToken, getAllUsers);

// Route to get a user by username
router.get("/:username", getUserByUsername);

// Single endpoint for follow/unfollow
router.post("/:userId/toggle-follow", authenticateToken, toggleFollowUser);

// get followers list of the <userID> provided
router.get("/:userId/followers", getFollowers);

// get following list of the <userID> provided
router.get("/:userId/followings", getFollowing);

// Route to update profile picture
router.put(
	"/update/profile-picture",
	authenticateToken,
	upload.single("profilePicture"),
	updateProfilePicture
);

// Route to update cover picture
router.put(
	"/update/cover-picture",
	authenticateToken,
	upload.single("coverPicture"),
	updateCoverPicture
);

// Route to delete profile picture
router.delete(
	"/delete/profile-picture",
	authenticateToken,
	deleteProfilePicture
);
// Route to delete cover picture
router.delete("/delete/cover-picture", authenticateToken, deleteCoverPicture);

module.exports = router;
