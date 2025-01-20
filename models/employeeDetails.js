const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    secondedTo: {
      type: String,
      required: true,
      default: "ICS Outsourcing",
    },
    salaryAccountNumber: {
      type: String,
    },
    bankName: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeDetails", employeeSchema);
