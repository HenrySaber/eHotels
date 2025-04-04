const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomsController');

router.get('/', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
