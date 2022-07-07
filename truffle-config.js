require('dotenv').config();

const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.MNEMONIC_GOERLI;
const infuraAccessKey = process.env.INFURA_ACCESS_KEY;
const etherscanKey = process.env.ETHERSCAN_API_KEY;

module.exports = {
   // See <http://truffleframework.com/docs/advanced/configuration>
   // to customize your Truffle configuration!
   contracts_build_directory: path.join(__dirname, "client/src/abi"),
   networks: {
      development: {
         network_id: "*",
         host: 'localhost',
         port: 8545,
         gas: 6721975,
         gasPrice: 20000000000
      },
      goerli: {
         provider: function() {
         return new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/" + infuraAccessKey)
         },
         network_id: 5
      }
   },
   compilers: {
      solc: {
         version: "0.8.7",
         optimizer: {
            enabled: true,
            runs: 200
         }
      }
   },
   plugins: [
      'truffle-plugin-verify'
    ],
   api_keys: {
      etherscan: etherscanKey
   }
};