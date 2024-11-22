const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const crypto = require("crypto");

const postSchema = new Schema({
	title: { type: String },
	content: { type: String },
	code: { type: String },
	image: { type: String },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Likes on the post
	mentions: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	hashtags: [{ type: String, default: [] }],
	slug: { type: String, unique: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate slug before saving the post
postSchema.pre("save", async function (next) {
	if (!this.isModified("content")) {
		return next();
	}

	// Generate a random hexadecimal string
	const randomHex = crypto.randomBytes(3).toString("hex"); // Generates a 6-character hex string
	this.slug = slugify(this.content, { lower: true }) + "-" + randomHex;

	// Ensure the slug is unique
	let postWithSlug = await mongoose.models.Post.findOne({ slug: this.slug });
	let suffix = 1;

	// If the slug already exists, append a numeric suffix to make it unique
	while (postWithSlug) {
		this.slug =
			slugify(this.content, { lower: true }) + "-" + randomHex + "-" + suffix;
		suffix++;
		postWithSlug = await mongoose.models.Post.findOne({ slug: this.slug });
	}

	next();
});

module.exports = mongoose.model("Post", postSchema);
