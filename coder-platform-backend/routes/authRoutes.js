const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");
const {
	register,
	login,
	setNewPassword,
	resetPassword,
	logout,
} = require("../controllers/authController");

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

router.get("/logout", authenticateToken, logout);

//Set new Password route
router.post("/set-password", authenticateToken, setNewPassword);

//Reset Password route
router.post("/reset-password", authenticateToken, resetPassword);

// Google OAuth routes
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h", // Set expiration time as needed
		});
		res.redirect(`http://localhost:3000/oauth-callback?token=${token}`); // Redirect to the frontend after successful login
	}
);

// GitHub OAuth route
router.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth callback route
router.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: "/" }),
	(req, res) => {
		// Successful authentication
		const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h", // Set expiration time as needed
		});
		res.redirect(`http://localhost:3000/oauth-callback?token=${token}`);
	}
);

// Logout route
router.get("/logout", (req, res) => {
	req.logout(() => {
		res.redirect("http://localhost:3000/signup");
	});
});

module.exports = router;
