const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillSchema = new Schema({
	name: { type: String, unique: true, required: true }, // Skill name
	description: { type: String, required: true }, // Optional description
	image: { type: String, default: "https://via.placeholder.com/150x150.png" },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Skill", skillSchema);
