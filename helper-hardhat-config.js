const networkConfig = {

    11155111: {
        name: "sepolia",
        vrfCoordinatorV2:"0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        EntranceFee:  ethers.parseEther("0.01"),
        LinkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        callbackGasLimit:"500000",
        interval:"30",
        
    },

    137: {
        name:"polygon",
        vrfCoordinatorV2:"0xAE975071Be8F8eE67addBC1A82488F1C24858067",
        EntranceFee:  ethers.parseEther("0.1"),
    },
    31337:{

        name:"hardhat",
        EntranceFee: ethers.parseEther("0.01"),
        LinkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        callbackGasLimit:"500000",
        interval:"30",
    }
}
const developmentChains = ["hardhat", "local"]

module.exports = {
    networkConfig,
    developmentChains,
}