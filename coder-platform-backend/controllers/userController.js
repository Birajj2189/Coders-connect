const User = require("../models/User");
const Skill = require("../models/Skill");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Get all users
const getAllUsers = async (req, res) => {
	try {
		// Assuming req.user contains the current user's information, including their _id and following array
		const currentUserId = req.user._id;

		// Fetch all users except the current user
		const users = await User.find({ _id: { $ne: currentUserId } })
			.select("firstName lastName username profilePicture bio skills followers") // Include followers to check if the current user follows them
			.lean(); // Use lean to return plain JavaScript objects for easier manipulation

		// Map through users to add an 'isFollowing' field
		const usersWithFollowingStatus = users.map((user) => {
			// Check if the current user is in the 'followers' list of this user
			const isFollowing = user.followers.some(
				(followerId) => followerId.toString() === currentUserId.toString()
			);
			return {
				...user,
				isFollowing, // Add the new field
			};
		});

		res.status(200).json(usersWithFollowingStatus);
	} catch (error) {
		res.status(500).json({ message: "Error fetching users", error });
	}
};

// Get user by username
const getUserByUsername = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select(
			"username profilePicture bio skills"
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Error fetching user", error });
	}
};

// Get all the details of my profile
const myProfile = async (req, res) => {
	try {
		const user = req.user;

		// Send the user's data back
		res.json({
			id: user._id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			isPassword: user.isPassword,
			profilePicture: user.profilePicture,
			coverPicture: user.coverPicture,
			title: user.title,
			bio: user.bio,
			skills: user.skills,
			googleId: user.googleId,
			githubId: user.githubId,
			githubLink: user.githubLink,
			location: user.location,
			experience: user.experience,
			education: user.education,
			website: user.website,
			linkedin: user.linkedin,
			following: user.following,
			followers: user.followers,
			projects: user.projects,
			createdAt: user.createdAt,
			onlineStatus: user.onlineStatus,
		});
	} catch (err) {
		res.status(500).json({ message: "Error fetching user data" });
	}
};

// update Profile information
const updateProfile = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			bio,
			gender,
			skills, // array of skill IDs
			country,
			city,
			degree,
			institution,
			graduationYear,
			fieldOfStudy,
			linkedin,
			website, // website URL
		} = req.body;

		const userId = req.user.id; // Assuming this is extracted from authenticated user token

		// Find and update the user with new profile details
		const user = await User.findByIdAndUpdate(
			userId,
			{
				firstName,
				lastName,
				bio,
				gender,
				skills, // array of skill IDs (referencing Skill model)
				country,
				city,
				degree,
				institution,
				graduationYear,
				fieldOfStudy,
				linkedin, // LinkedIn profile link
				website, // personal website link
			},
			{ new: true } // return the updated user document
		);

		// If user is not found, return a 404 error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return the updated user profile in response
		res.json(user);
	} catch (error) {
		// Handle server errors
		res.status(500).json({ message: "Server error", error });
	}
};

// Update User Profile Picture
const updateProfilePicture = async (req, res) => {
	try {
		// Check if a file was uploaded
		if (!req.file) {
			return res.status(400).json({ message: "Profile picture is required" });
		}
		const date = Date.now();
		const tempPath = req.file.path; // Get the uploaded file path
		const fileExtension = path.extname(req.file.originalname);
		const userId = req.user.id;
		const targetPath = `uploads/profiles/pp-${req.user.username}-${date}${fileExtension}`;
		fs.renameSync(tempPath, targetPath);
		// Update user's profile picture in the database
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePicture: targetPath },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		// Respond with success message and updated user
		res.status(200).json({ profilePicture: updatedUser.profilePicture });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
		console.log(error);
	}
};

// Delete Profile Picture
const deleteProfilePicture = async (req, res) => {
	try {
		const user = req.user;

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.profilePicture) {
			fs.unlinkSync(user.profilePicture);
		}
		user.profilePicture = null;
		await user.save();

		res
			.status(200)
			.json({ message: "Profile picture deleted successfully", user });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Update User Profile's cover Picture
const updateCoverPicture = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "Cover picture is required" });
		}
		const date = Date.now();
		const tempPath = req.file.path; // Get the uploaded file path
		const fileExtension = path.extname(req.file.originalname);
		const userId = req.user.id;
		const targetPath = `uploads/profiles/cp-${req.user.username}-${date}${fileExtension}`;
		fs.renameSync(tempPath, targetPath);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ coverPicture: targetPath },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).send({ coverPicture: updatedUser.coverPicture });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Delete Profile Picture
const deleteCoverPicture = async (req, res) => {
	try {
		const userId = req.user.id;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $unset: { coverPicture: 1 } }, // Remove the profilePicture field
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ profilePicture: updatedUser.profilePicture });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Delete user
const deleteUser = async (req, res) => {
	const userId = req.user.id; // Assuming req.user contains the logged-in user's data
	try {
		const user = await User.findById(userId);

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Delete the user and cascade delete their posts using pre-remove middleware
		await user.remove();
		await User.findByIdAndDelete(userId);

		return res
			.status(200)
			.json({ message: "User and related posts deleted successfully." });
	} catch (err) {
		console.error(err);
		// Send a proper error response to the client
		return res
			.status(500)
			.json({ message: "Server error. Could not delete user." });
	}
};

// Toggle user follow/following
const toggleFollowUser = async (req, res) => {
	const userId = req.params.userId;
	const currentUserId = req.user.id;
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const userToToggle = await User.findById(userId).session(session);
		const currentUser = await User.findById(currentUserId).session(session);

		if (!userToToggle || !currentUser) {
			await session.abortTransaction();
			return res
				.status(404)
				.json({ message: "User not found", userToToggle, currentUser });
		}

		const isFollowing = currentUser.following.includes(userId);

		if (isFollowing) {
			await User.findByIdAndUpdate(
				currentUserId,
				{ $pull: { following: userId } },
				{ session }
			);
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { followers: currentUserId } },
				{ session }
			);
			await session.commitTransaction();
			return res.status(200).json({ message: "Unfollowed successfully" });
		} else {
			currentUser.following.push(userId);
			userToToggle.followers.push(currentUserId);
			await currentUser.save({ session });
			await userToToggle.save({ session });
			await session.commitTransaction();
			return res.status(200).json({ message: "Followed successfully" });
		}
	} catch (error) {
		await session.abortTransaction();
		res.status(500).json({ message: "Server error", error });
	} finally {
		session.endSession();
	}
};

// Get followers
const getFollowers = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate(
			"followers",
			"username profilePicture"
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			followersCount: user.followers.length,
			followers: user.followers,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Get following
const getFollowing = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate(
			"following",
			"username profilePicture"
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			followingCount: user.following.length,
			following: user.following,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// get follow suggestions
const getFollowSuggestions = async (req, res) => {
	const currentUserId = req.user.id;
	console.log(currentUserId);
	try {
		// Step 1: Find the current user and get their following list and skills
		const currentUser = await User.findById(currentUserId)
			.populate("following", "followers skills")
			.populate("skills");

		// Extract the IDs of users that the current user follows
		const followingIds = currentUser.following.map((user) => user._id);

		// Extract the IDs of skills that the current user has
		const userSkillIds = currentUser.skills.map((skill) => skill._id);

		// Step 2: Find users who are followed by people the current user follows
		const mutualFollowers = await User.find({
			_id: { $nin: [...followingIds, currentUserId] }, // Exclude already followed users and current user
			followers: { $in: followingIds }, // Users followed by those the current user follows
		})
			.populate("skills", "name") // Populate skill names
			.select("username profilePicture followers skills")
			.lean();

		// Step 3: Enhance with common interests/skills
		const skillBasedSuggestions = await User.find({
			_id: { $nin: [...followingIds, currentUserId] },
			skills: { $in: userSkillIds }, // Users who share at least one skill
		})
			.populate("skills", "name") // Populate skill names
			.select("username profilePicture followers skills")
			.lean();

		// Merge and remove duplicates
		const combinedSuggestions = [
			...new Map(
				[...mutualFollowers, ...skillBasedSuggestions].map((item) => [
					item._id,
					item,
				])
			).values(),
		];

		combinedSuggestions.sort((a, b) => b.followers.length - a.followers.length);

		// Step 5: Limit the number of suggestions
		const limitedSuggestions = combinedSuggestions.slice(0, 10);

		// Send the suggestions to the user
		res.status(200).json(limitedSuggestions);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching follow suggestions", error });
	}
};

const getMentionList = async (req, res) => {
	const currentUserId = req.user.id; // Assuming user ID is available in req.user (authenticated user)
	console.log(currentUserId);
	const currentUser = await User.findById(currentUserId);
	try {
		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find users with mentionControl = "all"
		const allUsers = await User.find({
			mentionControl: "all",
			_id: { $ne: currentUserId },
		})
			.select("firstName lastName username avatar")
			.lean();

		// Find users with mentionControl = "followers"
		const followersUsers = await User.find({ mentionControl: "followers" });
		const followersList = followersUsers.filter((user) =>
			currentUser.following.includes(user.id)
		);

		// Combine users from both queries
		const mentionableUsers = [...allUsers, ...followersList];
		res.json(mentionableUsers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Export all functions
module.exports = {
	getAllUsers,
	getUserByUsername,
	myProfile,
	updateProfile,
	updateProfilePicture,
	updateCoverPicture,
	deleteProfilePicture,
	deleteCoverPicture,
	deleteUser,
	toggleFollowUser, // Ensure this is exported
	getFollowers,
	getFollowing,
	getFollowSuggestions,
	getMentionList,
};
