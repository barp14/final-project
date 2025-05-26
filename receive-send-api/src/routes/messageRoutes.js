const express = require('express');
const router = express.Router();

const { messageController } = require('../controller/messageController');
const { messageWorkerController } = require('../controller/messageWorkerController');
const { getMessageController } = require('../controller/getMessageController');

router.post('/message', messageController);
router.post('/message/worker', messageWorkerController);
router.get('/message', getMessageController);

module.exports = router;
