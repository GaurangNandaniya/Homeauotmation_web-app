const devConfig = require("./dev.webpack");
const prodConfig = require("./production.webpack");

//https://stackoverflow.com/questions/43046885/what-does-do-when-running-an-npm-command
module.exports = ({ mode } = { mode: "production" }) => {
  console.log(`mode is ${mode}`);
  return mode == "production" ? prodConfig : devConfig;
};
