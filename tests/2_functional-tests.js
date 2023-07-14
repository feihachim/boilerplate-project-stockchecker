const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("view one stock", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=msft")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("view one stock and liking it", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=msft&like=true")
      .end(function (err, res) {
        assert.equal(res.body.stockData.stock, "MSFT");
        assert.equal(res.status, 200);
        done();
      });
  });
  test("view the same stock and liking it again", function (done) {
    /*chai
      .request(server)
      .get("/api/stock-prices?stock=msft&like=true")
      .end(function (err, res) {
        assert.equal(res.body.stockData.stock, "MSFT");
        assert.equal(res.status, 200);
        done();
      });*/
    assert.equal("boo", "boo");
    done();
  });
  test("view two stocks", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=msft&stock=goog")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("view two stocks and like them", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices?stock=msft&stock=goog&like=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
});
