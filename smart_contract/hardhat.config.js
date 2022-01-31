// https://eth-ropsten.alchemyapi.io/v2/gO32FgmnLjxgnxFus2Ho7-K4euwxCoyx

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url : 'https://eth-ropsten.alchemyapi.io/v2/gO32FgmnLjxgnxFus2Ho7-K4euwxCoyx',
      accounts: ['bb672460c02fc77c4932a04134bb444fbab69821307eea1c053d82eae6a33c55']
    }
  }
};

// once config file is ready with contract written in solidity and deploy script,
// just run the below command to get the deploy key
// npx hardhat run scripts/deploy.js --network ropsten