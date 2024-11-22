const express = require("express");
const router = express.Router();
const {
	createComment,
	getCommentsByPostId,
	getTopThreeCommentsByPostId,
	// editComment,
	deleteComment,
	toggleLikeOnComment,
} = require("../controllers/commentController");

const authenticateToken = require("../middleware/auth"); // JWT auth middleware

// Route to create a new comment
router.post("/create/", authenticateToken, createComment);

// Route to get all comments for a post by post ID
router.get("/list-all/:postId", authenticateToken, getCommentsByPostId);

// Route to get the top 3 recent comments for a post by post ID
router.get(
	"/list-three/:postId",
	authenticateToken,
	getTopThreeCommentsByPostId
);

// Route to edit a comment
// router.put("/:commentId", editComment);

// Route to delete a comment
router.delete("/delete/:commentId", authenticateToken, deleteComment);

// Route to toggle like on a comment
router.post("/toggle-like/:commentId/", authenticateToken, toggleLikeOnComment);

module.exports = router;
