const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddlewre = require("../middlewares/auth.middleware");

router.post("/", authMiddlewre, chatController.createChatController);

module.exports = router;
