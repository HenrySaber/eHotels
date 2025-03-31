const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationsController');

router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
