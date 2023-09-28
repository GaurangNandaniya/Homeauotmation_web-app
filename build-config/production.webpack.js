const { merge } = require("webpack-merge");
const common = require("./common.config");

const config = {
  mode: "production",
  devtool: "source-map",
};

module.exports = merge(common, config);
