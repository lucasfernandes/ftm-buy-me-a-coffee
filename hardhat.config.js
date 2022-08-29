require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const goerliUrl = process.env.GOERLI_URL;
const polygonUrl = process.env.POLYGON_URL;
const mnemonic = process.env.MNEMONIC;
const etherscanKey = process.env.ETHERSCAN_API_KEY;
const operaKey = process.env.FTMSCAN_API_KEY;

module.exports = {
  solidity: "0.8.7",
  networks: {
    goerli: {
      url: goerliUrl,
      accounts: [mnemonic],
    },
    opera: {
      url: "https://rpc.fantom.network",
      accounts: [mnemonic],
      chainId: 250,
    },
  },
  etherscan: {
    apiKey: {
      goerli: etherscanKey,
      opera: operaKey,
    },
  },
};
