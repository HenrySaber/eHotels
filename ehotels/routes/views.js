const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

router.get('/views/available-rooms-zone', viewsController.getAvailableRoomsPerArea);
router.get('/views/room-capacity', viewsController.getRoomCapacityByHotel);

module.exports = router;
