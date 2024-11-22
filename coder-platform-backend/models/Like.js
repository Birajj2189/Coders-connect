// models/Like.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who liked the content
	contentType: {
		type: String,
		enum: ["Post", "Comment", "CodeSnippet"],
		required: true,
	}, // Type of content
	contentId: { type: Schema.Types.ObjectId, required: true }, // ID of the content that was liked
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Like", likeSchema);
