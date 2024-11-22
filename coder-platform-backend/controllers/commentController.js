const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create a new comment
const createComment = async (req, res) => {
	try {
		const { postId, content } = req.body;
		const userId = req.user._id; // Assumes `req.user` contains the authenticated user's ID from the JWT middleware

		// Check if the post exists
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Create the new comment
		const comment = new Comment({
			content,
			author: userId,
			post: postId,
		});

		await comment.save();

		// Optionally, add the comment to the post's comments array
		post.comments.push(comment._id);
		await post.save();

		res.status(201).json(comment);
	} catch (error) {
		res.status(500).json({ message: "Error creating comment", error });
	}
};

// Get all comments by post ID
const getCommentsByPostId = async (req, res) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;
		const { sort } = req.query;

		const comments = await Comment.find({ post: postId }).populate({
			path: "author",
			select: "username firstName lastName profilePicture",
		});

		// Determine the sorting criteria
		let modifiedCommentList;
		if (sort === "popular") {
			// Sort by the number of likes after fetching the comments
			modifiedCommentList = comments
				.map((comment) => ({
					...comment.toObject(),
					likeCount: comment.likes.length,
					isLiked: comment.likes.includes(userId),
				}))
				.sort((a, b) => b.likeCount - a.likeCount); // Sort by likeCount in descending order
		} else {
			// Default to sorting by createdAt
			modifiedCommentList = comments
				.map((comment) => ({
					...comment.toObject(),
					likeCount: comment.likes.length,
					isLiked: comment.likes.includes(userId),
				}))
				.sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt in descending order
		}

		res.status(200).json(modifiedCommentList);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching comments", error });
	}
};

// Get the top 3 recent comments by post ID
const getTopThreeCommentsByPostId = async (req, res) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;
		const comments = await Comment.find({ post: postId })
			.populate({
				path: "author",
				select: "username firstName lastName profilePicture",
			})
			.sort({ createdAt: -1 })
			.limit(3);
		const modifiedCommentList = comments.map((comment) => ({
			...comment.toObject(),
			likeCount: comment.likes.length,
			isLiked: comment.likes.includes(userId),
		}));
		res.status(200).json(modifiedCommentList);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching recent comments", error });
	}
};

// Edit a comment
const editComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const userId = req.user.id;

		let comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Optionally, you can verify if the logged-in user is the author of the comment
		comment.content = content;
		comment.updatedAt = Date.now();

		await comment.save();
		res.status(200).json(comment);
	} catch (error) {
		res.status(500).json({ message: "Error updating comment", error });
	}
};

// Delete a comment
const deleteComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const userId = req.user.id;

		let comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		await Comment.findByIdAndDelete(commentId);

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error deleting comment", error });
	}
};

// Toggle like on a comment
const toggleLikeOnComment = async (req, res) => {
	try {
		const userId = req.user.id; // Assume the user ID is sent in the request body
		const { commentId } = req.params;

		let comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if the user has already liked the comment
		const hasLiked = comment.likes.includes(userId);

		if (hasLiked) {
			// If already liked, unlike it
			comment.likes = comment.likes.filter(
				(like) => like.toString() !== userId
			);
		} else {
			// Otherwise, add the like
			comment.likes.push(userId);
		}

		await comment.save();
		res.status(200).json(comment);
	} catch (error) {
		res.status(500).json({ message: "Error toggling like on comment", error });
	}
};

module.exports = {
	createComment,
	getCommentsByPostId,
	getTopThreeCommentsByPostId,
	toggleLikeOnComment,
	deleteComment,
};
