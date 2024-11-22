// models/Project.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	tagImage: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tags", tagsSchema);
