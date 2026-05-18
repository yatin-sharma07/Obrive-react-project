// backend/src/modules/supervisor/supervisor.routes.js
const router = require("express").Router();
const ctrl = require("./supervisor.controller");
const authenticate = require("../../middleware/auth");

// All supervisor routes require authentication
router.use(authenticate);

// For now, allow both supervisor and employee roles to access (supervisor might not be set up yet)
// Later, this should be: router.use(authorize('supervisor'));

// Employee endpoints
router.get("/employees", ctrl.getAllEmployees);
router.patch("/employees/:employeeId/block", ctrl.blockEmployeeAccess);
router.get("/employees/:employeeId", ctrl.getEmployeeStatus);
router.get("/employees/:employeeId/projects", ctrl.getEmployeeProjects);
router.delete("/employees/:employeeId", ctrl.deleteEmployee);

// Project endpoints
router.get("/projects", ctrl.getSupervisorProjects);

// Leave endpoints
router.get("/leaves", ctrl.getAllLeaveRequests);
router.put("/leaves/:id/status", ctrl.updateLeaveStatus);
router.delete("/leaves/:id", ctrl.deleteLeaveRequest);

module.exports = router;
