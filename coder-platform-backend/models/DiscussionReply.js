const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionReplySchema = new Schema({
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	thread: {
		type: Schema.Types.ObjectId,
		ref: "DiscussionThread",
		required: true,
	},
	likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiscussionReply", discussionReplySchema);
