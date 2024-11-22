// app.js (socket.io implementation)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
	console.log("New client connected");

	// Join a chat
	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
	});

	// Typing indicators
	socket.on("typing", (chatId) => {
		socket.to(chatId).emit("typing");
	});

	socket.on("stopTyping", (chatId) => {
		socket.to(chatId).emit("stopTyping");
	});

	// Send message and emit to chat
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

	// Mark messages as read when user reads them
	socket.on("readMessages", async (chatId, userId) => {
		const messages = await Message.updateMany(
			{ chat: chatId },
			{ $addToSet: { readBy: userId } }
		);
		io.to(chatId).emit("messagesRead", userId);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

server.listen(5000, () => {
	console.log("Server is running on port 5000");
});
