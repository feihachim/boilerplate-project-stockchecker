const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
    unique: true,
  },
  ipsEncrypted: {
    type: [String],
  },
});

module.exports = mongoose.model("Like", likeSchema);
