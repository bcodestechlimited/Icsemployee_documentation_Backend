const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const certificatesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateObtained: {
      type: String,
      required: true,
    },
    nameOfCourse: {
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

module.exports = mongoose.model("Certificate", certificatesSchema);
