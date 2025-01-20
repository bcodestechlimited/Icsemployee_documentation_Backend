const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const personalInfoSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    otherName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    officialEmail: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    closestBusStop: {
      type: String,
      required: true,
    },
    stateOfOrigin: {
      type: String,
      required: true,
    },
    localGovernment: {
      type: String,
      required: true,
    },
    homeTownAddress: {
      type: String,
      required: true,
    },
    passport: {
      publicId: String,
      url: String,
    },
    nin: {
      type: String,
    },
    bvn: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
