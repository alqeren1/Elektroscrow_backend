const ethers = require("ethers")

async function sendEth() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const senderPrivateKey = "" // Replace with one of the hardhat private keys
    const receiverAddress = "" // Replace with the hardhat receiver's address

    const wallet = new ethers.Wallet(senderPrivateKey, provider)
    const tx = {
        to: receiverAddress,
        value: ethers.parseEther("1.0"),
    }

    const transaction = await wallet.sendTransaction(tx)
    await transaction.wait()
    console.log(`Transaction hash: ${transaction.hash}`)
}

sendEth().catch(console.error)
