const { merge } = require("webpack-merge");
const common = require("./common.config");

const config = {
  mode: "production",
  devtool: false,
};

module.exports = merge(common, config);
