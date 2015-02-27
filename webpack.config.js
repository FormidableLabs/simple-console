/**
 * Webpack configuration
 */
var path = require("path");

module.exports = {
  cache: true,
  context: __dirname,
  entry: "./simple-console.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "simple-console.umd.js",
    libraryTarget: "umd"
  }
};
