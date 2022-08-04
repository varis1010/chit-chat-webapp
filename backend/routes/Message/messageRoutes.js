const express = require('express');
const router = express.Router();

const protectedRoute = require('../../middleware/authMiddleware');
const { MessageController } = require('../../controllers')



router.post('/', protectedRoute, MessageController.sendMessage);
router.get('/:chatId', protectedRoute, MessageController.allMessages);

module.exports = router;