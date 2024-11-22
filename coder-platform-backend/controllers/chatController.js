// controllers/chatController.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Create or get a chat between two users (for 1-on-1 chats)
exports.createChat = async (req, res) => {
	const userId = req.user.id;
	const { participantId } = req.body;
	if (userId === participantId) {
		// Handle the case where userId and participantId are the same
		return res
			.status(400)
			.json({ message: "User cannot chat with themselves" });
	}
	let chat = await Chat.findOne({
		participants: { $all: [userId, participantId], $size: 2 },
		isGroupChat: false,
	});

	if (!chat) {
		chat = new Chat({ participants: [userId, participantId] });
		await chat.save();
	}

	res.status(200).json(chat);
};

// Get all chats for a user
exports.getChats = async (req, res) => {
	const userId = req.user._id;

	try {
		const chats = await Chat.find({ participants: userId })
			.populate({
				path: "participants",
				select: "username onlineStatus", // Select only the fields you need
				// Exclude the current user
			})
			.populate({
				path: "lastMessage",
				populate: { path: "sender", select: "username" }, // Optional: Include sender info in last message
			});

		// Format the chat data to include only necessary participant info
		const formattedChats = chats.map((chat) => {
			return {
				...chat.toObject(),
				participants: chat.participants.map((participant) => ({
					id: participant._id,
					username: participant.username,
					onlineStatus: participant.onlineStatus,
				})),
			};
		});

		res.status(200).json(formattedChats);
	} catch (error) {
		res.status(500).json({ message: "Error fetching chats", error });
	}
};

// Get paginated chat history
exports.getChatHistory = async (req, res) => {
	try {
		const { chatId, page = 1, pageSize = 20 } = req.query; // Optional page and pageSize from query params

		// Calculate how many documents to skip based on the page number
		const skip = (page - 1) * pageSize;

		// Check if the chat exists
		const chat = await Chat.findById(chatId).populate("participants", "name");
		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		// Fetch messages from the chat with pagination
		const messages = await Message.find({ chat: chatId })
			.sort({ createdAt: 1 }) // Sort by most recent first
			.skip(skip) // Skip based on pagination
			.limit(parseInt(pageSize)) // Limit the results to pageSize
			.populate("sender", "name avatar") // Populate sender details (e.g., name, avatar)
			.exec();

		// console.log(messages);

		// Return the paginated messages
		res.status(200).json({
			chatId,
			participants: chat.participants, // Optionally include participants
			messages,
			pagination: {
				page: parseInt(page),
				pageSize: parseInt(pageSize),
				totalMessages: await Message.countDocuments({ chat: chatId }),
			},
		});
	} catch (error) {
		console.error("Error fetching chat history:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
	const senderId = req.user._id;
	const { chatId, content } = req.body;

	const message = new Message({ sender: senderId, chat: chatId, content });
	await message.save();

	// Update chat with the new message
	const chat = await Chat.findByIdAndUpdate(
		chatId,
		{
			lastMessage: message._id, // Update lastMessage field
		},
		{ new: true } // Return the updated chat document
	)
		// .populate("messages") // Optionally populate messages to return full message details
		.populate("lastMessage");

	res.status(201).json(message);
};

// Get messages for a specific chat
exports.getMessages = async (req, res) => {
	const { chatId } = req.params;
	const messages = await Message.find({ chat: chatId })
		.populate("sender")
		.sort("createdAt");
	res.status(200).json(messages);
};

// Edit a message
exports.editMessage = async (req, res) => {
	const { messageId } = req.params;
	const { content } = req.body;

	const message = await Message.findByIdAndUpdate(
		messageId,
		{ content, isEdited: true },
		{ new: true }
	);
	res.status(200).json(message);
};

// Delete a message (soft delete)
exports.deleteMessage = async (req, res) => {
	const { messageId } = req.params;
	const { userId } = req.body;

	const message = await Message.findByIdAndUpdate(
		messageId,
		{
			$addToSet: { deletedBy: userId },
		},
		{ new: true }
	);

	res.status(200).json({ success: true });
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
	const { messageId } = req.params;
	const { userId } = req.body;

	const message = await Message.findByIdAndUpdate(
		messageId,
		{
			$addToSet: { readBy: userId },
		},
		{ new: true }
	);

	res.status(200).json({ success: true });
};

// Create a group chat
exports.createGroupChat = async (req, res) => {
	const { participants, groupName, adminId } = req.body;

	const chat = new Chat({
		participants,
		isGroupChat: true,
		groupName,
		admins: [adminId],
	});
	await chat.save();

	res.status(201).json(chat);
};

// Add an admin to a group
exports.addAdmin = async (req, res) => {
	const { chatId, userId } = req.body;

	const chat = await Chat.findByIdAndUpdate(
		chatId,
		{
			$addToSet: { admins: userId },
		},
		{ new: true }
	);

	res.status(200).json(chat);
};

// Remove an admin from a group
exports.removeAdmin = async (req, res) => {
	const { chatId, userId } = req.body;

	const chat = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { admins: userId },
		},
		{ new: true }
	);

	res.status(200).json(chat);
};

// Add user to group chat
exports.addUserToGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	const chat = await Chat.findByIdAndUpdate(
		chatId,
		{
			$addToSet: { participants: userId },
		},
		{ new: true }
	);

	res.status(200).json(chat);
};

// Remove user from group chat
exports.removeUserFromGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	const chat = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { participants: userId },
		},
		{ new: true }
	);

	res.status(200).json(chat);
};

// Reply to a message (message threading)
exports.replyToMessage = async (req, res) => {
	const { messageId } = req.params;
	const { senderId, content } = req.body;

	const replyMessage = new Message({
		sender: senderId,
		chat: req.body.chatId,
		content,
		replyTo: messageId,
	});

	await replyMessage.save();

	res.status(201).json(replyMessage);
};
