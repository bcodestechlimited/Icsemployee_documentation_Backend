const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const verifyJWT = require("../../middleware/verifyJWT");
const { addCertificates, getCertificatesByUserId } = require("../../controllers/employeeController");

router
  .route("/").get()
  .post(
    verifyJWT,
    [
      check("*.name", "name is required").notEmpty(),
      check("*.dateObtained", "dateObtained is required").notEmpty(),
      check("*.nameOfCourse", "nameOfCourse is required").notEmpty(),
    ],
    addCertificates
  );

  router.route("/:id").get(verifyJWT, getCertificatesByUserId)

module.exports = router;
