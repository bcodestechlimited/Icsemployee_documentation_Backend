const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const verifyJWT = require("../../middleware/verifyJWT");
const {
  addEmployeeDetails,
  getEmployeeDetailsByUserId,
  updateEmployeDetails,
} = require("../../controllers/employeeController");

router
  .route("/")
  .post(
    verifyJWT,
    [
      check("employeeId", "employeeId is required").notEmpty(),
      check("secondedTo", "secondedTo is required").notEmpty(),
      check(
        "salaryAccountNumber",
        "salaryAccountNumber is required"
      ).notEmpty(),
      check("bankName", "bankName is required").notEmpty(),
    ],
    addEmployeeDetails
  )
  .put(verifyJWT, updateEmployeDetails);

router.route("/:id").get(verifyJWT, getEmployeeDetailsByUserId);

module.exports = router;
