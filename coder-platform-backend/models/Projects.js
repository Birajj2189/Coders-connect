// models/Project.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	url: { type: String }, // Link to the project
	tags: [String], // Tags for categorization
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
