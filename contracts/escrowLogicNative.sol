//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Logic__NotCreator();
error Logic__AlreadyInitialized();
error Logic__NotPossibleAfterInitialize();
error Logic__NotInitializedYet();
error Logic__ConflictBetweenParties();
error Logic__EscrowComplete();
error Logic__UseInitialize();

contract EscrowLogicNative {
    enum Decision {
        DECLINE,
        ACCEPT,
        REFUND
    }

    address public immutable i_buyer;
    address public immutable i_seller;
    IERC20 public immutable i_tokenContract;
    uint256 public immutable i_amount;
    bool public s_isInitialized = false;
    bool public s_buyerDeposited = false;
    bool public s_sellerDeposited = false;
    bool public s_escrowComplete = false;
    Decision private s_buyerDecision;
    Decision private s_sellerDecision;

    modifier onlyCreator() {
        // require(msg.sender == owner);
        if (msg.sender != i_buyer && msg.sender != i_seller)
            revert Logic__NotCreator();
        _;
    }

    constructor(
        address buyer,
        address seller,
        uint256 amount,
        address tokenContract
    ) {
        i_buyer = buyer;
        i_seller = seller;
        i_amount = amount;
        i_tokenContract = IERC20(tokenContract);
    }

    fallback() external payable {
        revert Logic__UseInitialize();
    }

    receive() external payable {
        revert Logic__UseInitialize();
    }

    function initialize() external onlyCreator {
        if (s_isInitialized == true) {
            revert Logic__AlreadyInitialized();
        }

        if ((msg.sender == i_buyer) && (s_buyerDeposited == false)) {
            require(
                i_tokenContract.transferFrom(
                    msg.sender,
                    address(this),
                    (2 * i_amount)
                ),
                "Transfer failed"
            );
            s_buyerDeposited = true;
        }
        if ((msg.sender == i_seller) && (s_sellerDeposited == false)) {
            require(
                i_tokenContract.transferFrom(
                    msg.sender,
                    address(this),
                    i_amount
                ),
                "Transfer failed"
            );
            s_sellerDeposited = true;
        }

        if ((s_sellerDeposited && s_buyerDeposited) == true) {
            s_isInitialized = true;
        }
        if (s_isInitialized == true) {
            revert Logic__AlreadyInitialized();
        }
    }

    function withdraw() external payable onlyCreator {
        if (s_isInitialized == true) {
            revert Logic__NotPossibleAfterInitialize();
        }
        if (msg.sender == i_buyer) {
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    msg.sender,
                    (2 * i_amount)
                ),
                "Transfer failed"
            );
        }
        if (msg.sender == i_seller) {
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    msg.sender,
                    (i_amount)
                ),
                "Transfer failed"
            );
        }
    }

    // 0 = DECLINE, 1 = ACCEPT, 2 = REFUND
    function finishEscrow(Decision decision) external payable onlyCreator {
        if (s_isInitialized == false) {
            revert Logic__NotInitializedYet();
        }
        if (s_escrowComplete == true) {
            revert Logic__EscrowComplete();
        }
        if (msg.sender == i_buyer) {
            s_buyerDecision = decision;
        }
        if (msg.sender == i_seller) {
            s_sellerDecision = decision;
        }
        if (
            (s_buyerDecision == Decision.DECLINE) ||
            (s_sellerDecision == Decision.DECLINE)
        ) {
            revert Logic__ConflictBetweenParties();
        }
        if (
            (s_buyerDecision == Decision.ACCEPT) &&
            (s_sellerDecision == Decision.ACCEPT)
        ) {
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    i_buyer,
                    (i_amount)
                ),
                "Transfer failed"
            );
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    i_seller,
                    (2 * i_amount)
                ),
                "Transfer failed"
            );
            s_escrowComplete = true;
        }
        if (
            (s_buyerDecision == Decision.REFUND) &&
            (s_sellerDecision == Decision.REFUND)
        ) {
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    i_buyer,
                    (2 * i_amount)
                ),
                "Transfer failed"
            );
            require(
                i_tokenContract.transferFrom(
                    address(this),
                    i_seller,
                    (i_amount)
                ),
                "Transfer failed"
            );
            s_escrowComplete = true;
        } else {
            revert Logic__ConflictBetweenParties();
        }
    }

    function checkBalance() external view returns (uint256) {
        return i_tokenContract.balanceOf(address(this));
    }

    function getDecisions() public view returns (Decision, Decision) {
        return (s_buyerDecision, s_sellerDecision);
    }
}
