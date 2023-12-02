//require("hardhat-waffle")
require("hardhat-contract-sizer")

require("@nomicfoundation/hardhat-chai-matchers")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("@nomicfoundation/hardhat-ethers")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomicfoundation/hardhat-verify")

require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    //defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        local: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
            blockConfirmations: 1,
            loggingEnabled: true,
        },
    },
    solidity: {
        compilers: [
            { version: "0.8.20" },
            { version: "0.8.8" },
            { version: "0.7.0" },
        ],
    },

    etherscan: {
        apiKey: process.env.ETHERSCAN_API,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: process.env.CMC_API,
        token: "ETH",
    },
}
