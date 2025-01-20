const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Schema = mongoose.Schema;

const clientListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  employees: {
    type: [ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("ClientList", clientListSchema);
