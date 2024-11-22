const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const {
	getUserNotifications,
	markAsRead,
	markAllAsRead,
	markAllAsSeen,
	getUnreadCount,
	getUnseenCount,
} = require("../controllers/notificationController");

// Get all notifications for a user
router.get("/all-list", authenticateToken, getUserNotifications);

// Mark a single notification as read
router.patch("/:id/read", authenticateToken, markAsRead);

// Mark all notifications as read
router.patch("/read-all", authenticateToken, markAllAsRead);

// Mark all notifications as seen
router.patch("/seen-all", authenticateToken, markAllAsSeen);

// Get unread notification count
router.get("/count-unread", authenticateToken, getUnreadCount);

// Get unseen notification count
router.get("/count-unseen", authenticateToken, getUnseenCount);

module.exports = router;
