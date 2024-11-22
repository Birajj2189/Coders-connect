// models/Notification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	type: {
		type: String, // e.g., "post_like", "new_follower", "comment", "hackathon_invite", etc.
		required: true,
	},
	url: {
		type: String, // Redirect URL for the notification
		required: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	isSeen: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Notification", notificationSchema);
