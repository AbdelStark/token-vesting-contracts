const Web3 = require("web3");
const web3 = new Web3();

module.exports = {
  networks: {
    dev: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545,
      confirmations: 5,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  db: {
    enabled: false,
  },
};
