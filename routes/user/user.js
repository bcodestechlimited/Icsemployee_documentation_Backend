const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const {
  getUser,
  getUserById,
  getUsers,
  testUser,
} = require("../../controllers/userController");
const router = express.Router();

router.route("/").get(verifyJWT, getUser);

router.route("/users").get(verifyJWT, getUsers);

router.route("/test").get(testUser)

router.route("/:id").get(verifyJWT, getUserById);

module.exports = router;
