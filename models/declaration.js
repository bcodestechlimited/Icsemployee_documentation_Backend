const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const declarationSchema = new Schema(
  {
    declaration: {
      type: String,
      required: true,
    },
    signature: {
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

module.exports = mongoose.model("Declaration", declarationSchema);
