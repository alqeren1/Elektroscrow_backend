const {ethers} = require("hardhat")
async function blockwait(blocks) {
    const currentblock = await ethers.provider.getBlockNumber()
    while ((await ethers.provider.getBlockNumber()) != currentblock + blocks) {
        //console.clear()
        console.log(
            "Current block:           " +
                ((await ethers.provider.getBlockNumber()) +
                    "\nCode will wait till:     " +
                    (currentblock + blocks)),
        )
        await sleep(2000)
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {blockwait}