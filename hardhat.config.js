require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: `${process.env.GOERLI_ENDPOINT}`,
      accounts: [`${process.env.GOERLI_PRIVATE_KEY}`],
    },
  },
};
