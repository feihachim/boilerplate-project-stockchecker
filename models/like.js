const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
  },
  ipList: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Like", likeSchema);
