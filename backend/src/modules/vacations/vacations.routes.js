const express = require('express');
const router = express.Router();
const vacationsController = require('./vacations.controller');
const authMiddleware = require('../../middleware/auth');
const zodValidate = require('../../middleware/zodValidate');
const { createVacationSchema } = require('./vacations.validate');


// Get all employees with their leaves (accessible by HR or everyone depending on rules)
// Assuming regular employees can view the calendar too, we'll just require auth.
router.get('/', authMiddleware, vacationsController.getEmployeesWithLeaves);

// Request a holiday for self only. user_id comes from authMiddleware (req.user)
router.post('/request', authMiddleware, zodValidate(createVacationSchema), vacationsController.requestLeave);

module.exports = router; 