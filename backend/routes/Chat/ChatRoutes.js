const express = require('express');
const router = express.Router();

const protectedRoute = require('../../middleware/authMiddleware');
const { ChatController } = require('../../controllers')



router.post('/', protectedRoute, ChatController.accessOrCreateOneOnOneChat);
router.get('/', protectedRoute, ChatController.fetchChats);
router.post('/group', protectedRoute, ChatController.createGroup);
router.put('/group', protectedRoute, ChatController.renameGroup);
router.put('/group/add', protectedRoute, ChatController.addToGroup);
router.put('/group/remove', protectedRoute, ChatController.removeGroup);

module.exports = router;