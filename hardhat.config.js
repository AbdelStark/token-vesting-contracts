require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require('hardhat-abi-exporter');

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
  abiExporter: {
    path: './build/abi',
    clear: true,
    flat: true,
    spacing: 2
  }
};
