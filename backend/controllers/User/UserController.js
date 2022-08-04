const User = require("../../models/userModel");

let UserController = {
  filterUsers: async (req, res) => {
    try {
      const filter = req.query.search ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } }
        ]
      } : {};
      let users = await User.find(filter).find({ _id: { $ne: req.user._id } });
      res.status(200).send(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = UserController;