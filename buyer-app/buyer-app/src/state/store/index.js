import "regenerator-runtime/runtime";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./ProdStore");
} else {
  module.exports = require("./DevStore");
}
