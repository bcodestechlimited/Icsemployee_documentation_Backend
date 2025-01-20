const express = require("express");
const router = express.Router();
const multer = require("multer");
const { check } = require("express-validator");
const verifyJWT = require("../../middleware/verifyJWT");
const {
  addSignature,
  getSignatureByUserId,
  updateSignature,
} = require("../../controllers/employeeController");
const { parser } = require("../../middleware/fileUploader");

router
  .route("/")
  .post(verifyJWT, parser.single("signature"), addSignature)
  .put(verifyJWT, parser.single("signature"), updateSignature);

router.route("/:id").get(verifyJWT, getSignatureByUserId);

module.exports = router;
