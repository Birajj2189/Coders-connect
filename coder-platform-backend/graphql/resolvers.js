const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {
	Query: {
		getUser: async (_, { id }) => {
			return await User.findById(id);
		},
		getUsers: async () => {
			return await User.find();
		},
	},
	Mutation: {
		register: async (_, { username, email, password }) => {
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({ username, email, password: hashedPassword });
			return await user.save();
		},
		login: async (_, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) throw new Error("User not found");
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) throw new Error("Invalid credentials");
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			return token;
		},
	},
	Subscription: {
		userAdded: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(["USER_ADDED"]),
		},
	},
};

module.exports = resolvers;
