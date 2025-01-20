const express = require("express");
const {
  sendEmployeeMessage,
  addClientList,
  updateClientList,
  deleteClientList,
  getClientLists,
} = require("../../controllers/adminController");
const verifyJWT = require("../../middleware/verifyJWT");
const router = express.Router();
const { check } = require("express-validator");

router
  .route("/send-emails")
  .post(
    verifyJWT,
    [
      check("emails", "Field is required").notEmpty(),
      check("message", "Field is required").notEmpty(),
    ],
    sendEmployeeMessage
  );

router
  .route("/client-list")
  .get(getClientLists)
  .post(
    verifyJWT,
    [check("name", "name is required").notEmpty()],
    addClientList
  );

router
  .route("/client-list/:id")
  .patch(
    verifyJWT,
    [check("name", "name is required").notEmpty()],
    updateClientList
  )
  .delete(verifyJWT, deleteClientList);

module.exports = router;
