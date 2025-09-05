const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");

function initSocketServer(httpserver) {
  const io = new Server(httpserver, {});

  io.use(async (socket, next) => {
    const { token } = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!token) {
      return next(new Error("Authentication error : Token is missing."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error: User not found."));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication error : Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        await messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chatId,
          role: "user",
          content: messagePayload.content,
        });

        const chatHistory = (
          await messageModel
            .find({
              chat: messagePayload.chatId,
            })
            .sort({ createdAt: -1 })
            .lean()
            .limit(20)
        ).reverse();

        const response = await aiService.generateResponse(
          chatHistory.map((item) => {
            return {
              role: item.role,
              parts: [{ text: item.content }],
            };
          })
        );

        await messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chatId,
          role: "model",
          content: response,
        });

        socket.emit("ai-response", response);
      } catch (err) {
        console.error("AI error:", err);
        socket.emit(
          "ai-error",
          "Something went wrong while generating a response."
        );
      }
    });
  });
}

module.exports = initSocketServer;
