const express = require("express");
const {
  addPersonalDetails,
  uploadPassport,
  getPersonalDetailsByUserId,
  updatePersonalDetails,
} = require("../../controllers/employeeController");
const router = express.Router();
const { check } = require("express-validator");
const verifyJWT = require("../../middleware/verifyJWT");
const { parser, validatePassport } = require("../../middleware/fileUploader");

router
  .route("/?prevalidate=prevalidate")
  .post(
    verifyJWT,
    [
      check("firstName", "firstName is required").notEmpty(),
      check("lastName", "lastName is required").notEmpty(),
      check("email", "email is required").notEmpty(),
      check("officialEmail", "officialEmail is required").notEmpty(),
      check("phone", "phone is required").notEmpty(),
      check("address", "address is required").notEmpty(),
      check("closestBusStop", "closestBusStop is required").notEmpty(),
      check("stateOfOrigin", "stateOfOrigin is required").notEmpty(),
      check("localGovernment", "localGovernment is required").notEmpty(),
      check("homeTownAddress", "homeTownAddress is required").notEmpty(),
    ],
    addPersonalDetails
  );

router
  .route("/")
  .post(
    verifyJWT,
    [
      check("firstName", "firstName is required").notEmpty(),
      check("lastName", "lastName is required").notEmpty(),
      check("email", "email is required").notEmpty(),
      check("officialEmail", "officialEmail is required").notEmpty(),
      check("phone", "phone is required").notEmpty(),
      check("address", "address is required").notEmpty(),
      check("closestBusStop", "closestBusStop is required").notEmpty(),
      check("stateOfOrigin", "stateOfOrigin is required").notEmpty(),
      check("localGovernment", "localGovernment is required").notEmpty(),
      check("homeTownAddress", "homeTownAddress is required").notEmpty(),
      check("bvn", "bvn is required").notEmpty(),
      check("dob", "dob is required").notEmpty(),
      check("gender", "gender is required").notEmpty(),
      check("nationality", "nationality is required").notEmpty(),
      check("maritalStatus", "maritalStatus is required").notEmpty(),
    ],
    addPersonalDetails
  )
  .put(verifyJWT, updatePersonalDetails);

router
  .route("/upload-passport")
  .post(verifyJWT, parser.single("passport"), uploadPassport);

router.route("/:id").get(verifyJWT, getPersonalDetailsByUserId);

module.exports = router;
