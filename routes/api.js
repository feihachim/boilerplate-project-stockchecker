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
        .then((foundStock) => {
          if (!foundStock) {
            res.send("no stock under this symbol");
            return;
          }
          const data = foundStock.data;
          console.log("simple stock");
          console.log(data);
          const newStock = {
            stock: data.symbol,
            price: data.latestPrice,
            likes: 0,
          };
          res.send({
            stockData: newStock,
          });
        })
        .catch((error) => {
          res.send({ error: error });
        });
      return;
    }
    if (Array.isArray(stock)) {
      const urls = [
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[0]}/quote`,
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[1]}/quote`,
      ];
      axios
        .all(urls.map((url) => axios.get(url)))
        .then((stocks) => {
          console.log("double request");
          const data = stocks.map((stock) => stock.data);
          console.log(data);
        })
        .catch((error) => {
          res.send({ error: error });
        });
      return;
    }
  });
};
