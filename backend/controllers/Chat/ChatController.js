const User = require('../../models/userModel');
const Chat = require('../../models/chatModel');

let ChatController = {
  accessOrCreateOneOnOneChat: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.sendStatus(400);
    }

    let isUserChatExist = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    }).populate('users', '-password').populate('latestMessages');

    isUserChatExist = await User.populate(isUserChatExist, {
      path: 'latestMessages.sender',
      select: 'name profilePic email'
    })

    if (isUserChatExist.length > 0) {
      res.send(isUserChatExist[0])
    }
    else {
      let newChat = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId]
      };

      try {
        const createChat = await Chat.create(newChat);

        const getCreatedChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
        res.status(200).send(getCreatedChat)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    }
  },
  fetchChats: async (req, res) => {
    try {

      let chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate('latestMessages')
        .sort({ updatedAt: -1 })
      let results = await User.populate(chat, {
        path: "latestMessages.sender",
        select: "name profilePic email",
      });
      res.status(200).send(results);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  },
  createGroup: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "All field's are required!" })
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send({ message: "More than 2 user's required to create a group!" })
    }

    users.push(req.user);
    try {
      const createGroupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user
      });
      const fetchGroupChat = await Chat.findOne({ _id: createGroupChat._id })
        .populate('users', "-password")
        .populate("groupAdmin", "-password")

      res.status(200).json(fetchGroupChat)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  },
  renameGroup: async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).send({ message: "Can not find All params!, Please send required params with body." })
    }
    try {
      const renameGroupChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

      if (!renameGroupChat) {
        res.status(400);
        throw new Error("Chat not Found!");
      }
      res.status(200).json(renameGroupChat)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  },
  addToGroup: async (req, res) => {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
      return res.status(400).send({ message: "Can not find All params!, Please send required params with body." })
    }
    try {
      const addToGroup = await Chat.findByIdAndUpdate(groupId, {
        $push: {
          users: userId
        }
      }, { new: true })
        .populate("users", "-password")
        .populate('groupAdmin', '-password');

      if (!addToGroup) {
        res.status(400);
        throw new Error("User not Found!");
      }
      res.status(200).json(addToGroup)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  },
  removeGroup: async (req, res) => {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
      return res.status(400).send({ message: "Can not find All params!, Please send required params with body." })
    }
    try {
      const addToGroup = await Chat.findByIdAndUpdate(groupId, {
        $pull: {
          users: userId
        }
      }, { new: true })
        .populate("users", "-password")
        .populate('groupAdmin', '-password');

      if (!addToGroup) {
        res.status(400);
        throw new Error("User not Found!");
      }
      res.status(200).json(addToGroup)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
}

module.exports = ChatController;