// routes/chat.js
const express = require("express");
const router = express.Router();
const {
	createChat,
	getChats,
	getChatHistory,
	sendMessage,
	getMessages,
	editMessage,
	deleteMessage,
	markAsRead,
	createGroupChat,
	addAdmin,
	removeAdmin,
	addUserToGroup,
	removeUserFromGroup,
	replyToMessage,
} = require("../controllers/chatController");
const authToken = require("../middleware/auth");

// Existing routes
router.post("/create-chat", authToken, createChat); // Create a chat
router.get("/list-chats", authToken, getChats); // Get user's chats
router.get("/chat-history", authToken, getChatHistory); // Get user's chats
router.post("/message", authToken, sendMessage); // Send message
router.get("/messages/:chatId", authToken, getMessages); // Get chat messages

// New routes
router.put("/edit-message/:messageId", editMessage); // Edit a message
router.delete("/delete-message/:messageId", deleteMessage); // Delete a message
router.post("/message-read/:messageId", markAsRead); // Mark message as read
router.post("/create-group-chat", createGroupChat); // Create a group chat
router.post("/add-group-admin", addAdmin); // Add an admin to a group
router.post("/remove-group-admin", removeAdmin); // Remove admin from group
router.post("/add-group-user", addUserToGroup); // Add user to group
router.post("/remove-group-user", removeUserFromGroup); // Remove user from group
router.post("/message-reply/:messageId", replyToMessage); // Reply to a message

module.exports = router;
