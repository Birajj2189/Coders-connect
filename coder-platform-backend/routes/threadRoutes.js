const express = require("express");
const router = express.Router();
const threadController = require("../controllers/threadController");

// POST: Create a new thread
router.post("/threads", threadController.createThread);

// GET: Get all threads
router.get("/threads", threadController.getAllThreads);

// GET: Get a thread by ID
router.get("/threads/:id", threadController.getThreadById);

// GET: Filter threads by user
router.get("/threads/user/:userId", threadController.getThreadsByUser);

// PUT: Update a thread by ID
router.put("/threads/:id", threadController.updateThread);

// DELETE: Delete a thread by ID
router.delete("/threads/:id", threadController.deleteThread);

// GET: Filter threads by skills
router.get("/threads/filter", threadController.filterThreadsBySkills);

module.exports = router;
