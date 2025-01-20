const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const tokenSchema  = new Schema({
    token: {
        type: String,
    },
})

module.exports = mongoose.model("Token", tokenSchema)