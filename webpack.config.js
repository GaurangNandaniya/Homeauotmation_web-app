const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        /*
    https://medium.com/@rajithaeye/what-is-babel-8dcfdf84ea3e
    Babel is a JavaScript transpiler that converts edge JavaScript(ES6) 
    into plain old ES5 JavaScript that can run in any browser even in 
    the old ones.
*/
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]", // Include name, local, and hash
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"), // Set the directory to serve static assets
    hot: true, // Enable hot module replacement
    historyApiFallback: true, // Enable HTML5 routing
    port: 3000,
  },
};
