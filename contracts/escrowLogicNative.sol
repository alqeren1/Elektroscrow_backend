//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error LogicNative__NotInParties();
error LogicNative__AlreadyInitialized();
error LogicNative__NotPossibleAfterInitialize();
error LogicNative__NotInitializedYet();
error LogicNative__EscrowComplete();
error LogicNative__UseInitialize();
error LogicNative__NotParticipant();
error LogicNative__AlreadyDeposited();
error LogicNative__MsgValueZero();
error LogicNative__ZeroAddress();

contract EscrowLogicNative {
    enum Decision {
        DECLINE,
        ACCEPT,
        REFUND
    }

    address payable public immutable i_buyer;
    address payable public immutable i_seller;
    address public immutable i_factory;
    uint256 public immutable i_amount;
    bool public s_isInitialized = false;
    bool public s_buyerDeposited = false;
    bool public s_sellerDeposited = false;
    bool public s_escrowComplete = false;
    Decision public s_buyerDecision;
    Decision public s_sellerDecision;

    modifier onlyParties() {
        // require(msg.sender == owner);
        if ((msg.sender != i_buyer) && (msg.sender != i_seller))
            revert LogicNative__NotInParties();
        _;
    }

    constructor(
        address payable buyer,
        address payable seller,
        uint256 amount,
        address factory
    ) {
        i_buyer = buyer;
        i_seller = seller;
        i_amount = amount;

        i_factory = factory;
    }

    function initialize() public payable onlyParties {
        if (s_isInitialized) {
            revert LogicNative__AlreadyInitialized();
        }
        if (
            ((msg.sender == i_buyer) && (s_buyerDeposited)) ||
            ((msg.sender == i_seller) && (s_sellerDeposited))
        ) {
            revert LogicNative__AlreadyDeposited();
        }
        if (msg.value == 0) {
            revert LogicNative__MsgValueZero();
        }

        if ((msg.sender == i_buyer)) {
            require(msg.value == 2 * i_amount, "Wrong amount");

            s_buyerDeposited = true;
        }
        if ((msg.sender == i_seller)) {
            require(msg.value == i_amount, "Wrong amount");
            s_sellerDeposited = true;
        }

        if ((s_sellerDeposited && s_buyerDeposited)) {
            s_isInitialized = true;
        }
    }

    function withdraw() external onlyParties {
        if (s_isInitialized) {
            revert LogicNative__NotPossibleAfterInitialize();
        }
        if (s_escrowComplete) {
            revert LogicNative__EscrowComplete();
        }
        if ((msg.sender == i_buyer) && (s_buyerDeposited)) {
            s_buyerDeposited = false;
            (bool callSuccess, ) = payable(msg.sender).call{
                value: i_amount * 2
            }("");
            require(callSuccess, "Transfer failed");
        }
        if ((msg.sender == i_seller) && (s_sellerDeposited)) {
            s_sellerDeposited = false;
            (bool callSuccess, ) = payable(msg.sender).call{value: i_amount}(
                ""
            );
            require(callSuccess, "Transfer failed");
        }
    }

    // 0 = DECLINE, 1 = ACCEPT, 2 = REFUND
    function finishEscrow(Decision decision) external onlyParties {
        if (!s_isInitialized) {
            revert LogicNative__NotInitializedYet();
        }
        if (s_escrowComplete) {
            revert LogicNative__EscrowComplete();
        }
        if ((!s_sellerDeposited) || (!s_buyerDeposited)) {
            revert LogicNative__EscrowComplete();
        }
        if (msg.sender == i_buyer) {
            s_buyerDecision = decision;
        }
        if (msg.sender == i_seller) {
            s_sellerDecision = decision;
        }

        if (
            (s_buyerDecision == Decision.ACCEPT) &&
            (s_sellerDecision == Decision.ACCEPT)
        ) {
            s_escrowComplete = true;
            s_sellerDeposited = false;
            s_buyerDeposited = false;
            (bool callSuccess, ) = i_seller.call{value: i_amount * 2}("");
            require(callSuccess, "Transfer failed");

            (bool callSuccess2, ) = i_buyer.call{value: i_amount}("");
            require(callSuccess2, "Transfer failed");
        }
        if (
            (s_buyerDecision == Decision.REFUND) &&
            (s_sellerDecision == Decision.REFUND)
        ) {
            s_escrowComplete = true;
            s_sellerDeposited = false;
            s_buyerDeposited = false;
            (bool callSuccess, ) = i_seller.call{value: i_amount}("");
            require(callSuccess, "Transfer failed");

            (bool callSuccess2, ) = i_buyer.call{value: i_amount * 2}("");
            require(callSuccess2, "Transfer failed");
        }
    }

    function rescueERC20(address tokenAddress) external {
        IERC20 token = IERC20(tokenAddress);
        uint256 amount = token.balanceOf(address(this));
        require(token.transfer(i_factory, amount), "Transfer failed");
    }

    function getDecisions() public view returns (Decision, Decision) {
        return (s_buyerDecision, s_sellerDecision);
    }

    function getAmount() public view returns (uint256) {
        return (i_amount);
    }

    function checkPayment(address account) public view returns (uint256) {
        if ((account == i_seller) && (s_sellerDeposited)) {
            return i_amount;
        }
        if ((account == i_buyer) && (s_buyerDeposited)) {
            return i_amount * 2;
        } else {
            revert LogicNative__NotParticipant();
        }
    }

    function getInitilizeState() public view returns (bool) {
        return s_isInitialized;
    }

    function getEscrowState() public view returns (bool) {
        return s_escrowComplete;
    }

    fallback() external payable {
        initialize();
    }

    receive() external payable {
        initialize();
    }
}
