//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20_6dec.sol";

contract testToken6dec is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol_) {
        _mint(msg.sender, 1000000 * 10 ** 6); // Mint 1 million tokens to the deployer
    }
}
