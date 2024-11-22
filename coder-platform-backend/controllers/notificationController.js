// controllers/notificationController.js
const Notification = require("../models/Notification");

// Create a new notification
const createNotification = async (notificationData) => {
	const { userId, message, type, url } = notificationData || {};

	if (!message || !type || !url) {
		throw new Error("Missing required fields");
	}

	try {
		const notification = new Notification({ userId, message, type, url });
		await notification.save();
		return notification; // Return the created notification
	} catch (error) {
		console.error("Error creating notification:", error);
		throw new Error("Error creating notification");
	}
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
	const userId = req.user.id;

	try {
		const notifications = await Notification.find({ userId }).sort({
			createdAt: -1,
		});
		const totalCount = await Notification.countDocuments({ userId });

		res.json({ totalCount, notifications });
	} catch (error) {
		res.status(500).json({ error: "Error fetching notifications" });
	}
};

// Mark a single notification as read
const markAsRead = async (req, res) => {
	const { id } = req.params;

	try {
		const notification = await Notification.findByIdAndUpdate(
			id,
			{ isRead: true },
			{ new: true }
		);
		res.json(notification);
	} catch (error) {
		res.status(500).json({ error: "Error marking notification as read" });
	}
};

// Mark all notification as read
const markAllAsRead = async (req, res) => {
	const userId = req.user.id;

	try {
		const notification = await Notification.updateMany(
			{ userId, isRead: false },
			{ isRead: true }
		);
		res.json(notification);
	} catch (error) {
		res.status(500).json({ error: "Error marking notification as read" });
	}
};

// Mark all notification as seen
const markAllAsSeen = async (req, res) => {
	const userId = req.user.id;

	try {
		const notification = await Notification.updateMany(
			{ userId, isSeen: false },
			{ isSeen: true }
		);
		res.json(notification);
	} catch (error) {
		res.status(500).json({ error: "Error marking notification as read" });
	}
};

const getUnreadCount = async (req, res) => {
	const userId = req.user.id;

	try {
		const unreadCount = await Notification.countDocuments({
			userId,
			isRead: false,
		});
		res.json({ unreadCount });
	} catch (error) {
		res.status(500).json({ error: "Error fetching unread count" });
	}
};

// Get unseen notification count
const getUnseenCount = async (req, res) => {
	const userId = req.user.id;

	try {
		const unseenCount = await Notification.countDocuments({
			userId,
			isSeen: false,
		});
		res.json({ unseenCount });
	} catch (error) {
		res.status(500).json({ error: "Error fetching unseen count" });
	}
};

module.exports = {
	createNotification,
	getUserNotifications,
	markAsRead,
	markAllAsRead,
	markAllAsSeen,
	getUnreadCount,
	getUnseenCount,
};
