const { network, run } = require("hardhat")


const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
const {blockwait} = require("../utils/blockwait")
module.exports = async ({getNamedAccounts, deployments}) => {

    const {deploy,log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log("Chainid:---------------"+chainId)
    let vrfCoordinatorV2Address
    if(chainId == 31337){
        console.log("Local network detected. Deploying mocks...");
        const vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.address
        console.log(`Mock Deployed at ${vrfCoordinatorV2Address}`);
        console.log("--------------------------------");
    }else{
         vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    }
    //on localhost i can use a mock
    const entranceFee= networkConfig[chainId]["EntranceFee"]
    const LinkToken= networkConfig[chainId]["LinkToken"]
    const callbackGasLimit= networkConfig[chainId]["callbackGasLimit"]
    const interval= networkConfig[chainId]["interval"]


    const args = [vrfCoordinatorV2Address,LinkToken,entranceFee,callbackGasLimit,interval]

    const raffle = await deploy("Raffle",{

        from: deployer,
        args:  args ,//price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations,

    })
    //if (chainId != 31337){} 
    console.log("------------------------")
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API){
        await blockwait(3)
        await verify(raffle.address, args)

    }
}

module.exports.tags = ["all","raffle"]