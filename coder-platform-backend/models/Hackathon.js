// models/Hackathon.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hackathonSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	rules: { type: String },
	prizes: [{ type: String }], // List of prizes
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hackathon", hackathonSchema);
