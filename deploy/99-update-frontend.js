const { ethers, deployments, network } = require("hardhat")
const fs = require("fs")

const FRONTEND_ADDRESSES_FILE =
    "../escrow_project_frontend/constants1/escrowAddress.json"

const FRONTEND_ABI_FILE =
    "../escrow_project_frontend/constants1/abi_factory.json"
const FRONTEND_ABI_FILE2 =
    "../escrow_project_frontend/constants1/abi_logic.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        await updateFactoryAddress()

        await updateContractABI()
    }
}

async function updateContractABI() {
    const factoryArtifact = await artifacts.readArtifact("escrow")
    const logicArtifact = await artifacts.readArtifact("EscrowLogic")

    fs.writeFileSync(
        FRONTEND_ABI_FILE,
        JSON.stringify(factoryArtifact.abi, null, 2),
    )
    fs.writeFileSync(
        FRONTEND_ABI_FILE2,
        JSON.stringify(logicArtifact.abi, null, 2),
    )
}

async function updateFactoryAddress() {
    const escrow = await deployments.get("escrow")
    const escrowAddress = await escrow.address
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(
        fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf8"),
    )

    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(escrowAddress)) {
            currentAddresses[chainId].push(escrowAddress)
        }
    } else {
        currentAddresses[chainId] = [escrowAddress]
    }
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend", "escrowfactory"]
