const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({});

module.exports = mongoose.model("Like", likeSchema);
