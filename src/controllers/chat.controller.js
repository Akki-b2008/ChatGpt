const chatModel = require("../models/chat.model");

async function createChatController(req, res) {
  const { title } = req.body;
  
  const user = req.user;
    
  const chat = await chatModel.create({
    user: user._id,
    title,
  });

  console.log(chat);


  res.status(201).json({
    message: "chat created successfully.",
    chat: {
      id : chat._id,
      user: chat.user,
      title: chat.title,
    },
  });
}

module.exports = {
  createChatController,
};
