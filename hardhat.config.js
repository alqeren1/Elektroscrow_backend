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
        ethereum: {
            url: process.env.ETHEREUM_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 1,
            blockConfirmations: 6,
        },
        bsc: {
            url: process.env.BSC_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 56,
            blockConfirmations: 6,
        },
        polygon: {
            url: process.env.POLYGON_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 137,
            blockConfirmations: 6,
        },
        avax: {
            url: process.env.AVAX_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 43114,
            blockConfirmations: 6,
        },
        op: {
            url: process.env.OP_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 10,
            blockConfirmations: 6,
        },
        arb: {
            url: process.env.ARB_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 42161,
            blockConfirmations: 6,
        },
        base: {
            url: process.env.BASE_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 8453,
            blockConfirmations: 6,
        },
        celo: {
            url: process.env.CELO_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 42220,
            blockConfirmations: 6,
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        bscTest: {
            url: process.env.BSCTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 97,
            blockConfirmations: 6,
        },
        polygonTest: {
            url: process.env.POLYGONTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 80001,
            blockConfirmations: 6,
        },
        arbitrumTest: {
            url: process.env.ARBITRUMTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 421614,
            blockConfirmations: 6,
        },
        avaxTest: {
            url: process.env.AVAXTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 43113,
            blockConfirmations: 6,
        },
        opTest: {
            url: process.env.OPTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155420,
            blockConfirmations: 6,
        },
        baseTest: {
            url: process.env.BASETESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 84532,
            blockConfirmations: 6,
        },
        celoTest: {
            url: process.env.CELOTESTNET_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 44787,
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
            {
                version: "0.8.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    // Additional settings
                },
            },
            {
                version: "0.8.8",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    // Additional settings
                },
            },
            {
                version: "0.7.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    // Additional settings
                },
            },
            // Add any additional versions and their settings here
        ],
    },
    sourcify: {
        enabled: true,
        // Optional: specify a different Sourcify server
        apiUrl: "https://sourcify.dev/server",
        // Optional: specify a different Sourcify repository
        browserUrl: "https://repo.sourcify.dev",
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API,
            sepolia: process.env.ETHERSCAN_API,
            bsc: process.env.BSCSCAN_API,
            bscTestnet: process.env.BSCSCAN_API,
            polygon: process.env.POLYGON_API,
            polygonMumbai: process.env.POLYGON_API,
            ARB: process.env.ARBITRUM_API,
            arbitrumTest: process.env.ARBITRUM_API,
            avaxTest: process.env.AVAX_API,
            avax: "avax",
            celoTest: process.env.CELO_API,
            opTest: process.env.OP_API,
            baseTest: process.env.BASE_API,
            OP: process.env.OP_API,
            base: process.env.BASE_API,
            celo: process.env.CELO_API,
        },
        customChains: [
            {
                network: "arbitrumTest",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io/",
                },
            },
            {
                network: "opTest",
                chainId: 11155420,
                urls: {
                    apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
                    browserURL: "https://sepolia-optimism.etherscan.io/",
                },
            },
            {
                network: "OP",
                chainId: 10,
                urls: {
                    apiURL: "https://api-optimistic.etherscan.io/api",
                    browserURL: "https://optimistic.etherscan.io/",
                },
            },
            {
                network: "ARB",
                chainId: 42161,
                urls: {
                    apiURL: "https://api.arbiscan.io/api",
                    browserURL: "https://arbiscan.io/",
                },
            },
            {
                network: "base",
                chainId: 8453,
                urls: {
                    apiURL: "https://api.basescan.org/api",
                    browserURL: "https://basescan.org/",
                },
            },
            {
                network: "baseTest",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org/",
                },
            },
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io/",
                },
            },
            {
                network: "celoTest",
                chainId: 44787,
                urls: {
                    apiURL: "https://api-alfajores.celoscan.io/api",
                    browserURL: "https://alfajores.celoscan.io/",
                },
            },
            {
                network: "avax",
                chainId: 43114,
                urls: {
                    apiURL: "https://api.avascan.info/v2/network/mainnet/evm/43114/etherscan",
                    browserURL: "https://avascan.info/",
                },
            },
        ],
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
        gasPrice: 1,
    },
}
//change ETH to BNB or other native tokens to see other chain fees.
