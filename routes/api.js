"use strict";

const axios = require("axios");
const bcrypt = require("bcrypt");

const Like = require("../models/like");
const saltRounds = 10;

module.exports = function (app) {
  app.route("/api/stock-prices").get(function (req, res) {
    // TODO
    const stock = req.query.stock;
    const like = req.query.like;
  });
};
