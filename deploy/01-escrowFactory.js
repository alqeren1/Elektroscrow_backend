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
        log: true,
        waitConfirmations: network.config.blockConfirmations,
        //gasPrice: ethers.parseUnits("0.1", "gwei"),
        //gasLimit: 6000000,
    })
    if (chainId == 31337) {
        const escrowDeployed = await ethers.getContract("escrow", deployer)
        await escrowDeployed.updateFeeWallet(
            "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
        )
        console.log("Fee wallet updated")
    }

    console.log("------------------------")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        //await blockwait(3)
        await verify(escrow.address, args)
    }
}

module.exports.tags = ["all", "escrowfactory", "escrow"]
