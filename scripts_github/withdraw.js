const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const { assert, expect } = require("chai")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    const contractBalanceBefore = await ethers.provider.getBalance(fundMe)
    console.log(
        "Contract balance before withdrawing: ",
        ethers.formatEther(contractBalanceBefore)
    )
    console.log("Withdrawing from contract...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    const contractBalanceAfter = await ethers.provider.getBalance(fundMe)
    console.log(
        "Contract balance after withdrawing: ",
        ethers.formatEther(contractBalanceAfter)
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
