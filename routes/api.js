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
    if (!stock) {
      res.send({ error: "No required stock field" });
      return;
    }
    if (typeof stock === "string") {
      axios
        .get(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
        )
        .then((foundStock) => {})
        .catch((error) => {
          res.send({ error: error });
        });
      return;
    }
    if (Array.isArray(stock)) {
      axios.all
        .get(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[0]}/quote`
        )
        .get(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[1]}/quote`
        )
        .then((stock1, stock2) => {})
        .catch((error) => {
          res.send({ error: error });
        });
      return;
    }
  });
};
