const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./common.config");

const config = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    open: true,
    static: path.resolve(__dirname, "../dist"), // Set the directory to serve static assets
    hot: true, // Enable hot module replacement
    historyApiFallback: true, // Enable HTML5 routing
    host: "0.0.0.0",
    port: 3000,
    client: {
      progress: true,
    },
  },
  //it will watch for changes in file and recompile
  watch: true,
  watchOptions: {
    aggregateTimeout: 2000,
    poll: 5000,
    ignored: /node_modules/,
  },
  stats: {
    env: true,
    colors: true,
    builtAt: true,
    errorDetails: true,
  },
};

module.exports = merge(common, config);
