const Chat = require("../../models/chatModel");
const Message = require("../../models/messageModel");
const User = require("../../models/userModel");


let MessageController = {
  sendMessage: async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      res.status(400);
      throw new Error('Invalid data passed into request.')
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId
    }

    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name profilePic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name profilePic email"
      });

      //update the letest message id from Chat model
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessages: message
      })

      res.status(202).json(message)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  allMessages: async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name profilePic email").populate("chat");

      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }

  }

}

module.exports = MessageController;