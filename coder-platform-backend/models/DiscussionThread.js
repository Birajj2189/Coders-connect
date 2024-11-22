// models/DiscussionThread.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionThreadSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: "DiscussionReply" }], // Replies to the thread
	anonymous: { type: Boolean, default: false }, // Whether the thread is anonymous
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiscussionThread", discussionThreadSchema);
