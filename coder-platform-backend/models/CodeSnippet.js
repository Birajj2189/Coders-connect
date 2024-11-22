// models/CodeSnippet.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const codeSnippetSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	code: { type: String, required: true }, // Code content
	skills: { type: Schema.Types.ObjectId, ref: "Skills", required: true }, // Tags for categorization (eg. Javascript , Python)
	author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who created the snippet
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodeSnippet", codeSnippetSchema);
