const express = require("express");
const router = express.Router();

const { createTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTask);

module.exports = router;