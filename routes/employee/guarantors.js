const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const {
  addGuarantors,
  getGuarantorsByUserId,
  updateGuarantors,
} = require("../../controllers/employeeController");
const { parser } = require("../../middleware/fileUploader");

router
  .route("/")
  .post(verifyJWT, parser.any(), addGuarantors)
  .put(verifyJWT, parser.any(), updateGuarantors);

router.route("/:id").get(verifyJWT, getGuarantorsByUserId);

module.exports = router;
