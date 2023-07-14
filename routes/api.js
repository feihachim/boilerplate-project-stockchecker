"use strict";

const axios = require("axios");
const bcrypt = require("bcrypt");

const Like = require("../models/like");
const saltRounds = 10;

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
            if (like) {
              const ipHashed = bcrypt.hashSync(req.ip, saltRounds);
              Like.find({ stock: data.symbol }).then((stockFound) => {
                if (!stockFound) {
                  const newLike = new Like({ stock: data.symbol });
                  newLike.ipsEncrypted.push(ipHashed);
                  newLike.save();
                }
                if (stockFound) {
                  console.log("stock liked", stockFound);
                  const dejaVu = stockFound.ipsEncrypted.filter((element) =>
                    bcrypt.compareSync(req.ip, element)
                  );
                  if (dejaVu.length === 0) {
                    stockFound.ipsEncrypted.push(ipHashed);
                    stockFound.save();
                  }
                }
              });
            }
            Like.countDocuments({ stock: data.symbol }).then((likeCount) => {
              const newStock = {
                stock: data.symbol,
                price: data.latestPrice,
                likes: likeCount,
              };
              res.send({ stockData: newStock });
              return;
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

          if (like) {
            Promise.all([
              Like.findOne({ stock: data[0].symbol }),
              Like.findOne({ stock: data[1].symbol }),
            ]).then(([stock1Likes, stock2Likes]) => {
              const ipHashed = bcrypt.hashSync(req.ip, saltRounds);
              if (!stock1Likes) {
                const newLike1 = new Like({ stock: data[0].symbol });
                newLike1.ipsEncrypted.push(ipHashed);
                newLike1.save();
              }
              if (!stock2Likes) {
                const newLike2 = new Like({ stock: data[1].symbol });
                newLike2.ipsEncrypted.push(ipHashed);
                newLike2.save();
              }
              if (stock1Likes) {
                const dejaVu1 = stock1Likes.ipsEncrypted.filter((element) =>
                  bcrypt.compareSync(req.ip, ipHashed)
                );
                if (dejaVu1.length === 0) {
                  stock1Likes.ipsEncrypted.push(ipHashed);
                  stock1Likes.save();
                }
              }
              if (stock2Likes) {
                const dejaVu2 = stock2Likes.ipsEncrypted.filter((element) =>
                  bcrypt.compareSync(req.ip, ipHashed)
                );
                if (dejaVu2.length === 0) {
                  stock2Likes.ipsEncrypted.push(ipHashed);
                  stock2Likes.save();
                }
              }
            });
          }
          Promise.all([
            Like.countDocuments({ stock: data[0].symbol }),
            Like.countDocuments({ stock: data[1].symbol }),
          ]).then(([stock1Count, stock2Count]) => {
            const newStock1 = {
              stock: data[0].symbol,
              price: data[0].latestPrice,
              rel_likes: stock1Count - stock2Count,
            };
            const newStock2 = {
              stock: data[1].symbol,
              price: data[1].latestPrice,
              rel_likes: stock2Count - stock1Count,
            };
            res.send({ stockData: [newStock1, newStock2] });
          });
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ error: error });
    }
  });
};
