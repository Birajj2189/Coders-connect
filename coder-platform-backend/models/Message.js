// models/Message.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
	content: { type: String, required: true },
	readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who read the message
	deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who received the message
	mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Mentions (@user)
	replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // For message threads/replies
	isEdited: { type: Boolean, default: false }, // Track if message has been edited
	deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who deleted the message
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
