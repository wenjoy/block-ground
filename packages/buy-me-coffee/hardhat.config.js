require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

const GOERLI_URL = "https://eth-goerli.g.alchemy.com/v2/YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo"
const GOERLI_API_KEY = "YA4l5t9NnZlEYLOF0MqW5Dtmn8xKUOAo"
const PRIVATE_KEY = "4634444da39bce7d78d742f4b2b6160823469fd3c84cc7d6a7b50278510fdd68"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
