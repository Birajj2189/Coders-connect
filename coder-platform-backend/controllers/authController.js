const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const slugify = require("slugify"); // Make sure to import slugify if you haven't already

dotenv.config();
const maxAge = 3 * 24 * 60 * 60 * 1000;
const jargons = [
	"star",
	"wizard",
	"ninja",
	"hawk",
	"tiger",
	"phantom",
	"vortex",
	"quest",
];

async function generateRandomUsername(firstName, length = 8) {
	// Generate a random string
	const randomString = crypto
		.randomBytes(length)
		.toString("hex")
		.slice(0, length);

	// Create an initial slug from the jargons, first name, and random string
	let slug = slugify(
		`${
			jargons[Math.floor(Math.random() * jargons.length)]
		}_${firstName}_${randomString}`,
		{ lower: true, replacement: "_" }
	);

	// Check if the slug already exists
	let userExists = await User.findOne({ username: slug });

	// If the slug exists, append a number and increment until a unique slug is found
	let count = 1;
	while (userExists) {
		slug = `${slugify(
			`${
				jargons[Math.floor(Math.random() * jargons.length)]
			}_${firstName}_${randomString}`,
			{ lower: true, replacement: "_" }
		)}_${count}`;
		userExists = await User.findOne({ username: slug });
		count++;
	}

	return slug;
}

const register = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Generate a unique username
		const username = await generateRandomUsername(firstName);

		// Create a new user
		const user = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			isPassword: true,
		});

		await user.save();

		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: "5h" }
		);

		res.status(200).json({
			token: token,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				email: user.email,
				profilePicture: user.profilePicture,
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
			},
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Set new password
const setNewPassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 12);

		// Find and update the user's password
		const user = await User.findByIdAndUpdate(
			userId,
			{
				password: hashedPassword,
				isPassword: true,
			},
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "An error occurred", error });
	}
};

const resetPassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { oldPassword, newPassword } = req.body;

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the old password is correct
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Old password is incorrect" });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// Update the user's password
		user.password = hashedPassword;
		user.isPassword = true;
		await user.save();

		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
	}
};

const logout = (req, res) => {
	// Ideally, you'd blacklist the token here if you're storing them
	res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { register, login, setNewPassword, resetPassword, logout };
