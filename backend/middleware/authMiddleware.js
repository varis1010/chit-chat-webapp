const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protectedRoute = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401);

  try {
    //decode the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById({ _id: decode.id }).select('-password');
    next();
  } catch (error) {
    res.status(401)
    throw new Error("Not Authorized, token failed")
  }
}

module.exports = protectedRoute;