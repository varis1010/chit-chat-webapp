const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');
const generateToken = require('../../config/generateToken')

let AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.profilePic,
          token: generateToken(user._id),
        });
      } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  register: asyncHandler(async (req, res) => {
    try {
      const { name, email, password, profilePic } = req.body;
      if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please Enter All the required filed.');
      }

      // Check if this user already exisits
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).send('That user already exisits!');
      }

      // Insert the new user if they do not exist yet
      let newuser = new User({
        name, email, password, profilePic
      });
      await newuser.save();
      res.send({
        userId: newuser._id,
        name: newuser.name,
        email: newuser.name,
        pic: newuser.profilePic,
        token: generateToken(newuser._id),
      });

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }),
};

module.exports = AuthController;