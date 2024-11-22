// models/Chat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
	participants: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	],
	// messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	isGroupChat: { type: Boolean, default: false }, // For group chats
	groupName: { type: String }, // Name of the group (optional)
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Admins for group chats
	lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Last message
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
