const Post = require("../models/Post");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const fs = require("fs");
const path = require("path");

// Controller function to handle post creation
const createPost = async (req, res) => {
	try {
		const { content, code, hashtags, mentions } = req.body; // `image` is handled by `req.file`

		// Check if the content is provided
		if (!content) {
			return res.status(400).json({ message: "Post content is required" });
		}

		const userId = req.user.id;
		let imagePath = null; // Initialize the imagePath as null (no image by default)

		// Check if a file is uploaded
		if (req.file) {
			const date = Date.now();
			const fileExtension = path.extname(req.file.originalname).toLowerCase();
			const validExtensions = [".png", ".jpg", ".jpeg"];

			// Check if the uploaded file is an image
			if (!validExtensions.includes(fileExtension)) {
				return res.status(400).json({ message: "Invalid image format" });
			}

			imagePath = req.file.path; // Get the uploaded file path
			const targetPath = `uploads/posts/img-${req.user.username}-${date}${fileExtension}`;

			// Rename file asynchronously and handle errors
			await fs.promises.rename(imagePath, targetPath);
			imagePath = targetPath; // Set the correct imagePath after renaming
			console.log(`Image saved to: ${targetPath}`);
		}

		// Create a new post object
		const newPost = new Post({
			author: userId,
			content,
			code,
			mentions: mentions || [],
			hashtags: hashtags || [],
			image: imagePath, // This will be null if no image was uploaded
		});

		// Save the new post to the database
		await newPost.save();

		// Return success response
		res
			.status(201)
			.json({ message: "Post created successfully", post: newPost });
	} catch (err) {
		console.error(err);

		// Return error response
		res
			.status(500)
			.json({ message: "Error creating post", error: err.message });
	}
};
	
// Get all posts
const getAllPosts = async (req, res) => {
	try {
		const userId = req.user.id;
		const posts = await Post.find()
			.populate({
				path: "author",
				select: "username firstName lastName profilePicture",
			}) // Assuming User has a 'username' field
			.populate({
				path: "mentions",
				select: "username firstName lastName profilePicture",
			})
			.sort({ createdAt: -1 }); // Specify the model for population

		// Add likeCount manually to each post
		const postsWithLikeCount = posts.map((post) => ({
			...post.toObject(), // Convert the Mongoose document to a plain object
			likeCount: post.likes.length,
			isLiked: post.likes.includes(userId), // Calculate likeCount based on the length of the like array
			commentCount: post.comments.length,
		}));

		res.json(postsWithLikeCount);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error fetching posts", details: error.message }); // Include error details
		console.error(error);
	}
};

// Get a single post by ID
const getPostById = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Post.findById(id)
			.populate("author", "username")
			.populate("skills", "name");
		// Calculate like count
		const likeCount = post.likes.length;

		// Append like count to the post object
		const postWithLikeCount = {
			...post._doc,
			likeCount: likeCount,
		};
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.json(postWithLikeCount);
	} catch (error) {
		res.status(500).json({ error: "Error fetching post" });
	}
};

// Update a post by ID
const updatePost = async (req, res) => {
	const { id } = req.params;
	const { title, content, skills } = req.body;
	const userId = req.user.id;

	try {
		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.author.toString() !== userId) {
			return res
				.status(403)
				.json({ error: "Unauthorized to update this post" });
		}

		post.title = title || post.title;
		post.content = content || post.content;
		post.skills = skills || post.skills;
		post.updatedAt = Date.now();

		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: "Error updating post" });
	}
};

// Delete a post by ID
const deletePost = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.author.toString() !== userId) {
			return res
				.status(403)
				.json({ error: "Unauthorized to delete this post" });
		}

		// Use deleteOne with the criteria for deletion
		const result = await Post.deleteOne({ _id: id });

		if (result.deletedCount === 0) {
			return res
				.status(404)
				.json({ error: "Post not found or already deleted" });
		}
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error deleting post" });
	}
};

// custom like messages for notification
const generateLikeNotificationMessage = (users, postTitle) => {
	const userCount = users.length;

	if (userCount === 0) {
		return `Your post: "${postTitle}" has been liked.`;
	}

	const userNames = users.map(
		(user) => `${user.firstName || "User"} ${user.lastName || ""}`
	);

	if (userCount === 1) {
		return `${userNames[0]} liked your post: "${postTitle}"`;
	} else if (userCount === 2) {
		return `${userNames[0]} and ${userNames[1]} liked your post: "${postTitle}"`;
	} else {
		const othersCount = userCount - 2;
		return `${userNames[0]}, ${userNames[1]} and ${othersCount} others liked your post: "${postTitle}"`;
	}
};

// Like/Unlike a post
const togglePostLike = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const isLiked = post.likes.includes(userId);

		if (isLiked) {
			post.likes = post.likes.filter((like) => like.toString() !== userId);
			await post.save();
		} else {
			post.likes.push(userId);
			await post.save();

			const usersWhoLiked = await User.find({ _id: { $in: post.likes } });
			const message = generateLikeNotificationMessage(
				usersWhoLiked,
				post.title
			);

			try {
				const notification = await createNotification({
					userId: post.author._id,
					message: message,
					type: "post_liked",
					url: `/posts/${post._id}`,
				});
				console.log("Notification created:", notification);
			} catch (error) {
				console.error("Error creating notification:", error.message);
				return res.status(500).json({ error: "Error creating notification" });
			}
		}

		res.status(200).send({ message: "Toggled Post Like successfully" });
	} catch (error) {
		console.error(
			`Error toggling post like for postId: ${id}, userId: ${userId}`,
			error
		);
		res.status(500).json({ error: "Error liking post" });
	}
};

// Route to get a post by slug
const getPostBySlug = async (req, res) => {
	try {
		const { slug } = req.params;
		const userId = req.user.id;
		const post = await Post.findOne({ slug })
			.populate({
				path: "author",
				select: "username firstName lastName profilePicture",
			}) // Assuming User has a 'username' field
			.populate({
				path: "mentions",
				select: "username firstName lastName profilePicture",
			});

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Convert the Mongoose document to a plain object
		const postObject = post.toObject();

		// Add likeCount, isLiked, and commentCount
		postObject.likeCount = post.likes.length;
		postObject.isLiked = post.likes.some((like) => like.equals(userId)); // Check if user has liked the post
		postObject.commentCount = post.comments.length;

		// Remove the likes and comments arrays from the response
		delete postObject.likes;
		delete postObject.comments;

		// Respond with the modified post
		return res.status(200).json(postObject);
	} catch (error) {
		console.error("Error fetching post by slug:", error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
	togglePostLike,
	getPostBySlug,
};
