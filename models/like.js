const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
  },
  ipEncrypted: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Like", likeSchema);
