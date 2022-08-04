const express = require('express');
const router = express.Router();
const { UserController } = require('../../controllers');
const protectedRoute = require('../../middleware/authMiddleware');

router.get('/', protectedRoute, UserController.filterUsers);

module.exports = router;