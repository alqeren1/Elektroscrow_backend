const {task} = require ("hardhat/config")

task ("block-number", "Prints the current block number").setAction(

    async (taskArgs, hre) => {

        const BL = await hre.ethers.provider.getBlockNumber()
        console.log("Current block number: "+ BL)

    }



)

module.exports = {}