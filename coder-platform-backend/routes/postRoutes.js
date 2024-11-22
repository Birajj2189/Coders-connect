const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
	togglePostLike,
	getPostBySlug,
} = require("../controllers/postController");
const authenticateToken = require("../middleware/auth"); // Assuming JWT auth

const upload = multer({ dest: "uploads/posts" });

// Create a new post
router.post("/create", authenticateToken, upload.single("image"), createPost);

// Get all posts
router.get("/all-list", authenticateToken, getAllPosts);

// Get a single post by ID-
router.get("/:id", getPostById);

// Update a post by ID
router.patch("/:id", authenticateToken, updatePost);

// Delete a post by ID
router.delete("/:id", authenticateToken, deletePost);

// Like/unlike a post
router.post("/toggle-like/:id", authenticateToken, togglePostLike);

// Like/unlike a post
router.get("/slug/:slug", authenticateToken, getPostBySlug);

module.exports = router;
