// server.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const Message = require("./models/Message"); // Assuming Message model is defined elsewhere
const Chat = require("./models/Chat"); // Assuming Chat model is defined elsewhere
const User = require("./models/User");
const fs = require("fs");

// Image upload directory setup
const uploadsDir = path.join(__dirname, "uploads");
const profilesDir = path.join(uploadsDir, "profiles");
const postsDir = path.join(uploadsDir, "posts");

// Api route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const postRoutes = require("./routes/postRoutes");
const skillsRoutes = require("./routes/skillsRoute");
const chatRoutes = require("./routes/chatRoutes");
const threadRoutes = require("./routes/threadRoutes");
const commentRoutes = require("./routes/commentRoutes");

const { disconnect } = require("process");
require("./config/passport");

dotenv.config(); // Load environment variables

// Initialize the Express app
const app = express();
app.use(express.json());
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(cookieParser());

// Session and Passport setup
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: process.env.NODE_ENV === "production" }, // Set to true in production
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/comments", commentRoutes);

app.use("/uploads/profiles", express.static("/uploads/profiles"));
app.use("/uploads/posts", express.static("/uploads/posts"));

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
	fs.mkdirSync(profilesDir);
}
if (!fs.existsSync(postsDir)) {
	fs.mkdirSync(postsDir);
}

// Serve static files
app.use(
	"/uploads/profiles",
	express.static(path.join(__dirname, "uploads/profiles"))
);
app.use(
	"/uploads/posts",
	express.static(path.join(__dirname, "uploads/posts"))
);

const port = process.env.PORT || 4000;

// MongoDB connection
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected successfully"))
	.catch((err) => console.error("MongoDB connection error:", err));

// GraphQL setup
const server = new ApolloServer({
	typeDefs: require("./graphql/typeDefs"), // Assuming typeDefs defined elsewhere
	resolvers: require("./graphql/resolvers"), // Assuming resolvers defined elsewhere
	introspection: true,
	playground: true,
	formatError: (err) => {
		console.error(err);
		return new Error("Internal server error");
	},
});
server.start().then(() => {
	server.applyMiddleware({ app });
	console.log(
		`GraphQL server running at http://localhost:${port}${server.graphqlPath}`
	);
});

// For REST API error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Something went wrong!" });
});

// Create HTTP server for both Express and Socket.io
const httpServer = http.createServer(app);

// Update user's online status
const updateOnlineStatus = async (userId, status) => {
	try {
		await User.findByIdAndUpdate(userId, { online: status });
	} catch (err) {
		console.error("Error updating online status:", err);
	}
};

// CORS configuration
// Socket.io setup
const io = socketIo(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap.set(userId, socket.id);
		console.log("New client connected", userId, socket.id);
	} else {
		console.log("user id not provided during connnection");
	}
	// Mark user as online
	updateOnlineStatus(userId, true);

	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
	});

	// Typing indicators
	socket.on("typing", (chatId) => {
		socket.to(chatId).emit("typing");
		console.log("typing");
	});

	socket.on("stopTyping", (chatId) => {
		socket.to(chatId).emit("stopTyping");
		console.log("stopeed typing");
	});

	// Send message
	socket.on("sendMessage", async (messageData) => {
		const { chatId, senderId, content, mentions } = messageData;

		const message = new Message({
			sender: senderId,
			chat: chatId,
			content,
			mentions,
		});
		await message.save();

		// Mark message as delivered
		const chat = await Chat.findById(chatId).populate("participants");
		message.deliveredTo = chat.participants.map((user) => user._id);
		await message.save();

		io.to(chatId).emit("newMessage", message);
	});

	// Mark messages as read
	socket.on("readMessages", async (chatId, userId) => {
		await Message.updateMany(
			{ chat: chatId },
			{ $addToSet: { readBy: userId } }
		);
		io.to(chatId).emit("messagesRead", userId);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
		updateOnlineStatus(userId, false);
	});
});

// Start the server with both API routes and Socket.io
httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
