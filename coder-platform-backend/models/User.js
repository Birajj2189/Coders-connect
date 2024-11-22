const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./Post");

const userSchema = new Schema(
	{
		firstName: { type: String, default: null },
		lastName: { type: String, default: null },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, default: null },
		isPassword: { type: Boolean, default: false },
		profilePicture: {
			type: String,
			default: null,
		},
		coverPicture: {
			type: String,
			default: null,
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Other"],
			default: "Male",
		},
		title: { type: String, default: null },
		bio: { type: String, default: null },
		skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
		googleId: { type: String, default: null },
		githubId: { type: String, default: null },
		githubLink: { type: String, default: null },
		provider: {
			type: String,
			enum: ["email", "google", "github"],
			default: "email",
		},
		projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		notifications: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
		],
		country: { type: String, default: null },
		city: { type: String, default: null },
		degree: {
			type: String,
			enum: ["highschool", "bachelor", "master", "phd"],
			default: null,
		},
		institution: { type: String, default: null },
		graduationYear: {
			type: Number,
			min: 1900,
			max: 2099,
			default: null,
		},
		fieldOfStudy: { type: String, default: null },
		website: { type: String, default: null },
		linkedin: { type: String, default: null },
		accountType: {
			type: String,
			enum: ["user", "company", "admin"],
			default: "admin",
		},
		onlineStatus: { type: Boolean, default: false },
		createdAt: { type: Date, default: Date.now },
		mentionControl: {
			type: String,
			enum: ["all", "followers", "none"],
			default: "all",
		},
	},
	{ timestamps: true }
);

// Pre-remove middleware to cascade delete user's posts
userSchema.pre("remove", async function (next) {
	try {
		// 1. Delete all posts where the author is the current user
		await Post.deleteMany({ author: this._id });

		// 2. Delete all likes associated with the user
		await Like.deleteMany({ user: this._id });

		// 3. Delete all notifications related to the user
		await Notification.deleteMany({ user: this._id });

		// 4. Delete all projects where the user is the creator/owner
		await Project.deleteMany({ creator: this._id });

		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model("User", userSchema);
