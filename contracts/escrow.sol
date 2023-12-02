//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./escrowLogic.sol";

error Factory__NotOwner();

contract escrow {
    event EscrowCreated(
        address indexed buyer,
        address indexed seller,
        address escrowContract
    );

    address public s_owner;

    mapping(address => address[]) public s_buyerToEscrowAddy;
    mapping(address => address[]) public s_sellerToEscrowAddy;

    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != s_owner) revert Factory__NotOwner();
        _;
    }

    constructor() {
        s_owner = msg.sender;
    }

    function escrowFactory(
        address seller,
        uint256 amount,
        address tokenContract
    ) external {
        address buyer = msg.sender;
        EscrowLogic child = new EscrowLogic(
            buyer,
            seller,
            amount,
            tokenContract,
            address(this)
        );
        s_buyerToEscrowAddy[buyer].push(address(child));
        s_sellerToEscrowAddy[seller].push(address(child));
        emit EscrowCreated(buyer, seller, address(child));
    }

    function updateOwner(address account) external onlyOwner {
        s_owner = account;
    }

    function rescueERC20(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 amount = token.balanceOf(address(this));
        require(token.transfer(s_owner, amount), "Transfer failed");
    }

    function getBuyerEscrows(
        address buyer
    ) public view returns (address[] memory) {
        return s_buyerToEscrowAddy[buyer];
    }

    function getSellerEscrows(
        address seller
    ) public view returns (address[] memory) {
        return s_sellerToEscrowAddy[seller];
    }
}
