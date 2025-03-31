const express = require('express');
const router = express.Router();
const chainController = require('../controllers/chainsController');

router.get('/', chainController.getAllChains);
router.post('/', chainController.createChain);
router.put('/:id', chainController.updateChain);
router.delete('/:id', chainController.deleteChain);

module.exports = router;
