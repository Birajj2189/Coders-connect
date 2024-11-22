const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Likes on the comment
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Virtual field for like count
commentSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

module.exports = mongoose.model("Comment", commentSchema);
