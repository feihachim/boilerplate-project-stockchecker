"use strict";

const axios = require("axios");
const bcrypt = require("bcrypt");

const Like = require("../models/like");

module.exports = function (app) {
  app.route("/api/stock-prices").get(function (req, res) {});
};
