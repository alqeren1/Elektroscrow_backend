const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const { assert, expect } = require("chai")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    const sendValue = await ethers.parseEther("1")
    console.log(
        "Funding contract..." + (await ethers.provider.getBalance(fundMe))
    )
    const transactionResponse = await fundMe.fund({ value: sendValue })
    await transactionResponse.wait(1)
    console.log("Funded:" + (await ethers.provider.getBalance(fundMe)))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
