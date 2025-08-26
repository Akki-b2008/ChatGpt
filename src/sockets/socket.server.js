const { Server } = require("socket.io");
const aiService = require("../services/ai.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    console.log("User connected successfully.");

    socket.on("ai-message", async (payLoad) => {
      const response = await aiService.generateResponse(payLoad);
      console.log(response);

      socket.emit("ai-response", response);
    });
  });
}

module.exports = initSocketServer;
