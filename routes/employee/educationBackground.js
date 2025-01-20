const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const verifyJWT = require("../../middleware/verifyJWT");
const {
  addEducationalBackground, getEducationByUserId,
} = require("../../controllers/employeeController");

router
  .route("/")
  .post(
    verifyJWT,
    [
      check("*.nameOfSchool", "nameOfSchool is required").notEmpty(),
      check("*.qualification", "qualification is required").notEmpty(),
      check("*.dateObtained", "dateObtained is required").notEmpty(),
    ],
    addEducationalBackground
  );

  router.route("/:id").get(verifyJWT, getEducationByUserId)
module.exports = router;
