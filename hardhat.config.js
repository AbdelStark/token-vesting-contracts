require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("hardhat-abi-exporter");
require("hardhat-docgen");
require("hardhat-tracer");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: goerliNetworkConfig(),
  },
  abiExporter: {
    path: "./build/abi",
    clear: true,
    flat: true,
    spacing: 2,
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
};

function goerliNetworkConfig() {
  let url = "https://goerli.infura.io/v3/";
  let accountPrivateKey = "0x";
  if (process.env.GOERLI_ENDPOINT) {
    url = `${process.env.GOERLI_ENDPOINT}`;
  }

  if (process.env.GOERLI_PRIVATE_KEY) {
    accountPrivateKey = `${process.env.GOERLI_PRIVATE_KEY}`;
  }

  return {
    url: url,
    accounts: [accountPrivateKey],
  };
}
