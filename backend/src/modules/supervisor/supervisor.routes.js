// backend/src/modules/supervisor/supervisor.routes.js
const router = require("express").Router();
const ctrl = require("./supervisor.controller");
const authenticate = require("../../middleware/auth");
const zodValidate = require("../../middleware/zodValidate");
const {
  AddUserBodySchema,
  EmployeeIdParamSchema,
  LeaveIdParamSchema,
  UpdateLeaveStatusBodySchema,
} = require("./supervisor.validation");

// All supervisor routes require authentication
router.use(authenticate);

// For now, allow both supervisor and employee roles to access (supervisor might not be set up yet)
// Later, this should be: router.use(authorize('supervisor'));

// Employee endpoints
router.get("/employees", ctrl.getAllEmployees);
router.patch("/employees/:employeeId/block", zodValidate({ part: "params", schema: EmployeeIdParamSchema }), ctrl.blockEmployeeAccess);
router.get("/employees/:employeeId", zodValidate({ part: "params", schema: EmployeeIdParamSchema }), ctrl.getEmployeeStatus);
router.get("/employees/:employeeId/projects", zodValidate({ part: "params", schema: EmployeeIdParamSchema }), ctrl.getEmployeeProjects);
router.delete("/employees/:employeeId", zodValidate({ part: "params", schema: EmployeeIdParamSchema }), ctrl.deleteEmployee);
router.post("/add-user", zodValidate({ part: "body", schema: AddUserBodySchema }), ctrl.addUser);

// Project endpoints
router.get("/projects", ctrl.getSupervisorProjects);

// Leave endpoints
router.get("/leaves", ctrl.getAllLeaveRequests);
router.put(
  "/leaves/:id/status",
  zodValidate({ part: "params", schema: LeaveIdParamSchema }),
  zodValidate({ part: "body", schema: UpdateLeaveStatusBodySchema }),
  ctrl.updateLeaveStatus
);
router.delete("/leaves/:id", zodValidate({ part: "params", schema: LeaveIdParamSchema }), ctrl.deleteLeaveRequest);

module.exports = router;
