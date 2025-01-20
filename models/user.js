const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
  personalInfo: {
    type: ObjectId,
    ref: "PersonalInfo",
  },
  guarantors: {
    type: [ObjectId],
    ref: "Guarantor",
  },
  education: {
    type: [ObjectId],
    ref: "Education",
  },
  certificates: {
    type: [ObjectId],
    ref: "Certificate",
  },
  employeeDetails: {
    type: ObjectId,
    ref: "EmployeeDetails",
  },
  signature: {
    type: ObjectId,
    ref: "Signature",
  },
});

module.exports = mongoose.model("User", userSchema);
