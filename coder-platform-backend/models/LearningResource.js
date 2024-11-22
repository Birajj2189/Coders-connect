// models/LearningResource.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learningResourceSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	link: { type: String, required: true }, // Link to the resource
	type: {
		type: String,
		enum: ["Tutorial", "Course", "Challenge"],
		required: true,
	}, // Type of resource
	difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] }, // Difficulty level
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LearningResource", learningResourceSchema);
