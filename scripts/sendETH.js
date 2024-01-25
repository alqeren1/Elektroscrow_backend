const ethers = require("ethers")

async function sendEth() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const senderPrivateKey =
        "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" // Replace with one of the private keys
    const receiverAddress = "0xcBA42C3AE9b38142aa247c7Ebc0faA3abFD01B51" // Replace with the receiver's address

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
