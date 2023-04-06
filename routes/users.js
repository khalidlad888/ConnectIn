const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

console.log("Users router loaded");

router.get('/profile', usersController.profile);
router.get('/chats', usersController.chats);

module.exports = router;