const { network, run } = require("hardhat")

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { blockwait } = require("../utils/blockwait")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log("Chainid:---------------" + chainId)

    const args = []

    const escrow = await deploy("escrow", {
        from: deployer,
        args: [], //price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    //if (chainId != 31337){}

    console.log("------------------------")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        await blockwait(3)
        await verify(escrow.address, args)
    }
}

module.exports.tags = ["all", "escrowfactory", "escrow"]
