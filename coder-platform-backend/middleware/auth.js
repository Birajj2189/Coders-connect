const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your JWT secret

		// Attach the user ID to the req object
		req.user = await User.findById(decoded.userId);

		if (!req.user) {
			return res.status(404).json({ message: "User not found" });
		}

		next(); // Proceed to the next middleware/controller
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};

module.exports = authenticateToken;
