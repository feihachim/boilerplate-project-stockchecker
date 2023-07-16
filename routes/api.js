"use strict";

const axios = require("axios");
// const bcrypt = require("bcrypt");

const Like = require("../models/like");
// const saltRounds = 10;

function getStockLiked(likeFound, data, req, like = false) {
  let stockLiked;
  if (!likeFound) {
    const newLike = new Like({ stock: data.symbol });
    if (like) {
      if (!newLike.ipList.includes(req.ip)) {
        newLike.ipList.push(req.ip);
      }
    }
    stockLiked = newLike;
    newLike.save();
  } else {
    if (like) {
      if (!likeFound.ipList.includes(req.ip)) {
        likeFound.ipList.push(req.ip);
        likeFound.save();
      }
    }
    stockLiked = likeFound;
  }
  return stockLiked;
}

module.exports = function (app) {
  app.route("/api/stock-prices").get(function (req, res) {
    const stock = req.query.stock;
    const like = req.query.like;
    try {
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
            // console.log(data);
            Like.findOne({ stock: data.symbol }).then((likeFound) => {
              let stockLiked = getStockLiked(likeFound, data, like);
              const stockData = {
                stockData: {
                  stock: data.symbol,
                  price: data.latestPrice,
                  likes: stockLiked.ipList.length,
                },
              };
              res.send(stockData);
            });
          });
      }
      if (Array.isArray(stock)) {
        const urls = [
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[0]}/quote`,
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[1]}/quote`,
        ];
        axios.all(urls.map((url) => axios.get(url))).then((stocks) => {
          const data = stocks.map((stock) => stock.data);
          if (!data || data.length < 2) {
            res.send("no data");
            return;
          }
          Promise.all([
            Like.findOne({ stock: data[0].symbol }),
            Like.findOne({ stock: data[1].symbol }),
          ]).then(([stock1Likes, stock2Likes]) => {
            // console.log([stock1Likes, stock2Likes]);
            let result1 = getStockLiked(stock1Likes, data[0], req, like);
            let result2 = getStockLiked(stock2Likes, data[1], req, like);
            const rel_likes = result1.ipList.length - result2.ipList.length;
            const stockData = {
              stockData: [
                {
                  stock: data[0].symbol,
                  price: data[0].latestPrice,
                  rel_likes: rel_likes,
                },
                {
                  stock: data[1].symbol,
                  price: data[1].latestPrice,
                  rel_likes: -rel_likes,
                },
              ],
            };
            res.send(stockData);
          });
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ error: error });
    }
  });
};
