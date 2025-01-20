const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const guarantorsSchema = new Schema(
  {
    guarantor: {
      publicId: String,
      url: String,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    target: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guarantor", guarantorsSchema);
