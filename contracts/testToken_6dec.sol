//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20_6dec.sol";

contract testToken_6dec is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, 1000000 * 10 ** 6); // Mint 1 million tokens to the deployer
    }
}
