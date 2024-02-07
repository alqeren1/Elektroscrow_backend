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
    const args = ["testToken", "TT"]
    const testToken = await deploy("testToken", {
        from: deployer,
        args: args, //price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
        //gasPrice: ethers.parseUnits("5", "gwei"),
    })
    token = await deployments.get("testToken")
    tokenAddress = await token.address
    const Token = await ethers.getContractFactory("testToken")
    token = await Token.attach(tokenAddress)

    connect = await token.connect(accounts[0])
    await connect.transfer(accounts[1].address, "1000000000000000000000")
    /*await connect.transfer(
        "0xd3aA0A9100ef0e7125c7F91B5cbAd96d949EFFD0",
        "1000000000000000000000",
    )*/
}

module.exports.tags = ["all", "escrow", "token", "token1"]
