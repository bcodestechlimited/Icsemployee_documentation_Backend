const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const educationSchema = new Schema(
  {
    nameOfSchool: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    dateObtained: {
      type: String,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);
