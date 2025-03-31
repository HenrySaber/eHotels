const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeesController');

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.put('/:ssn', employeeController.updateEmployee);
router.delete('/:ssn', employeeController.deleteEmployee);

module.exports = router;
