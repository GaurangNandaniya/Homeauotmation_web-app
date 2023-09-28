const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const {
  generateWebpackAliasesFromJsConfig,
} = require("../Scripts/generateWebpackPathResolve");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
    //https://ui.dev/react-router-cannot-get-url-refresh
    //https://webpack.js.org/guides/public-path/
    publicPath: "/",
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
  resolve: {
    modules: ["../src", "node_modules"],
    extensions: [".js", ".jsx", "..."],
    alias: {
      ...generateWebpackAliasesFromJsConfig(),
    },
  },
};
