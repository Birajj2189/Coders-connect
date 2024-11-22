// passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User"); // Adjust the path according to your structure
const slugify = require("slugify");

async function createUniqueSlug(baseUsername) {
	// Create an initial slug from the username
	let slug = slugify(baseUsername, { lower: true });

	// Check if the slug already exists
	let userExists = await User.findOne({ username: slug });

	// If the slug exists, append a number and increment until a unique slug is found
	let count = 1;
	while (userExists) {
		slug = `${slugify(baseUsername, { lower: true })}-${count}`;
		userExists = await User.findOne({ username: slug });
		count++;
	}

	return slug;
}

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			// Extract user information from profile
			const { id, emails, displayName } = profile;
			const email = emails && emails.length > 0 ? emails[0].value : null;

			if (!email) {
				// Handle cases where email is not provided
				return done(new Error("Email not provided by GitHub"), null);
			}
			try {
				// Find or create user
				let user = await User.findOne({ email: email });

				if (user) {
					// Update the Google ID if the user exists
					user.googleId = id;
					await user.save();
				} else {
					const uniqueUsername = await createUniqueSlug(displayName);
					user = await new User({
						googleId: id,
						email: email,
						username: uniqueUsername,
					}).save();
				}

				// Pass user object to the done callback
				done(null, user);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "/api/auth/github/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			// Extract user information from profile
			const { id, emails, displayName, username } = profile;
			const email = emails ? emails[0].value : null;
			try {
				// Find or create user
				let user = await User.findOne({ email: email });
				if (!user) {
					const uniqueUsername = await createUniqueSlug(
						username || displayName
					);
					user = await new User({
						githubId: id,
						email: email,
						githubLink: displayName,
						username: uniqueUsername,
					}).save();
				} else {
					// Update the Google ID if the user exists
					user.githubId = id;
					await user.save();
				}

				// Pass user object to the done callback
				done(null, user);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});
