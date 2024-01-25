const {
    deployments,
    getNamedAccounts,
    ethers,
    network,
    run,
} = require("hardhat")

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { blockwait } = require("../utils/blockwait")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const chainId = network.config.chainId
    console.log("Chainid:---------------" + chainId)
    const args = ["testToken_6dec", "TT6"]
    const testToken = await deploy("testToken_6dec", {
        from: deployer,
        args: args, //price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    token = await deployments.get("testToken_6dec")
    tokenAddress = await token.address
    const Token = await ethers.getContractFactory("testToken_6dec")
    token = await Token.attach(tokenAddress)

    connect = await token.connect(accounts[0])
    await connect.transfer(accounts[1].address, "3000000000")
}

module.exports.tags = ["all", "escrow", "token"]
