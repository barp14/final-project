const express = require('express');
const router = express.Router();
const {
  messageController,
  messageWorkerController,
  getMessageController,
} = require('../controller/messageController');

router.post('/message', messageController);
router.post('/message/worker', messageWorkerController);
router.get('/message', getMessageController);

module.exports = router;