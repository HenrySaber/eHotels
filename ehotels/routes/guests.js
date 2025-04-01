const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestsController');

router.get('/', guestController.getAllGuests);
router.post('/', guestController.createGuest);
router.put('/:guest_ssn', guestController.updateGuest);
router.delete('/:guest_ssn', guestController.deleteGuest);

module.exports = router;
