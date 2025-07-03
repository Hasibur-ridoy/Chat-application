const express = require('express');
const router = express.Router();
const whatsAppController = require('../controllers/whatsappController');
const session = require('../middleware/session');

router.post('/signup', whatsAppController.signUp);
router.post('/login', whatsAppController.login);
router.post('/logout', session, whatsAppController.logout);
router.get('/getUser', session, whatsAppController.getUser);
router.get('/getAllUsers', session, whatsAppController.getAllUsers);
router.post('/getOrCreateConversationId', session, whatsAppController.getOrCreateConversationId);

module.exports = router;