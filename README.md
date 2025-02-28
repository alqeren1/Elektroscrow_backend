# Elektroscrow Backend

![Elektroscrow Banner](assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Audit: SolidProof](https://img.shields.io/badge/Audit-SolidProof-green.svg)](https://solidproof.io)

Elektroscrow is the first fully decentralized escrow service built to operate across multiple blockchain networks. This repository contains the backend implementation—comprising Solidity smart contracts and comprehensive test suites—that powers the Elektroscrow platform.

Elektroscrow eliminates reliance on centralized intermediaries by leveraging immutable, self-executing smart contracts. It provides secure, trustless, and private escrow transactions where funds are only released when both parties reach a consensus.

## Project's Development

This project is a solo effort developed by [@alqeren1](https://github.com/alqeren1).

## Social Links
- Decentralized Application: [elektroscrow.com](https://elektroscrow.com)
- X (Twitter): [x.com/elektroscrow](https://x.com/elektroscrow)

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
  - [Escrow Process Overview](#escrow-process-overview)
  - [Decentralization & Security](#decentralization--security)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Compiling Contracts](#compiling-contracts)
  - [Running Tests](#running-tests)
  - [Deployment](#deployment)
- [Deployment & Testing Commands](#deployment--testing-commands)
- [Audit and KYC](#audit-and-kyc)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Decentralized Escrow Service:**  
  Fully trustless and autonomous contracts that remove the need for third-party moderators.

- **Enhanced Privacy:**  
  Users only need to share their wallet addresses. No personal data is stored, and transaction purposes remain confidential.

- **Automated Dispute Resolution:**  
  The escrow funds are only released when both buyer and seller agree on the outcome—either to complete the transaction or refund.

- **Safety Deposit Mechanism:**  
  Both parties are required to deposit safety funds (equal to the escrow amount) to enforce commitment and enable secure fund management.

- **Multi-Network Support:**  
  Primarily deployed on the BNB network, with compatibility on various Ethereum derivative networks.

- **Immutable Smart Contracts:**  
  Once deployed, the contracts are unalterable, ensuring consistent and secure operation.

- **Audited & Verified:**  
  Code audited and developers KYC verified by [SolidProof](https://x.com/SolidProof_io/status/1763958258165764441).

---

## How It Works

### Escrow Process Overview

Elektroscrow is designed to facilitate secure escrow transactions with the following steps:

1. **Initiate Escrow:**  
   - **Buyer:** Initiates a new escrow by providing the seller’s wallet address, token type, and transaction amount.  
   - **Data Entry:** The buyer fills out the escrow details through the user interface and creates a new escrow contract.

2. **Funding & Approvals:**  
   - Both parties must deposit the required funds into the escrow contract.  
   - **Safety Deposit:** Each party deposits a safety deposit equal to the escrow amount.  
   - **Token Approval:** The contract is authorized to spend the specified tokens from the user’s wallet.

3. **Escrow Decisions:**  
   - Once fully funded, both buyer and seller are prompted with three options: `Accept`, `Decline`, and `Refund`.  
   - The contract executes the transaction only when both parties agree on either releasing funds (upon a successful transaction) or refunding the deposits (in case of disputes).

4. **Finalization:**  
   - **Successful Transaction:** Funds (minus protocol fees) are transferred to the seller, and safety deposits are refunded.  
   - **Refund:** Both parties retrieve their deposits, adjusted for any protocol fee.  
   - **Pending Resolution:** If either party declines, funds remain in the contract until a mutual decision is made.

### Decentralization & Security

- **Trustless Execution:**  
  Smart contracts enforce all rules without human intervention, eliminating risks associated with centralized control.

- **Immutable Code:**  
  Once deployed, the contracts cannot be altered, guaranteeing consistent behavior and integrity of the escrow process.

- **User Autonomy:**  
  Users maintain control over their funds until a consensus is reached, ensuring privacy and reducing exposure to fraud.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js (>= 14.x)](https://nodejs.org/)
- npm or yarn package manager
- [Hardhat](https://hardhat.org/)
- Solidity compiler (version >= 0.8.x)
- Access to an Ethereum-compatible network (e.g., BNB Chain, Ethereum testnets)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/Elektroscrow_v1.git
cd Elektroscrow_v1
npm install
# or, if you prefer yarn:
# yarn install
```


## Configuration

### Prerequisites

- **Network Settings**:  
  Edit the `hardhat.config.js` file to set up your desired networks (e.g., testnet, mainnet).

- **Environment Variables**:  
  Create a `.env` file for sensitive configurations such as private keys and RPC URLs.  
  *Tip: Use the provided `.env.example` file as a reference.*



## Usage

### Compiling Contracts
Compile the Solidity contracts with the following command:

```bash
npx hardhat compile
```
### Running Tests
Ensure all contracts behave as expected by running the test suite:

```bash
npx hardhat test
```
Tests cover all core functionalities of the escrow process, including:

- Contract creation and initialization

- Token approval and funding

- Escrow decision logic (`Accept`, `Decline`, `Refund`)

- Withdrawal mechanisms before contract initialization
  

### Deployment 
Deploy the contracts to your desired network with the command below:

```bash
npx hardhat deploy --tags <tag-name> --network <network-name>
```
Replace `<network-name>` with the appropriate network identifier from your configuration.

Replace `<tag-name>` with the appropriate deploy script tag you want to run.

Ensure your network configuration is updated with the correct parameters in `hardhat.config.js`.



## Deployment & Testing Commands
For quick reference, here are the essential Hardhat commands:

### Compile Contracts:
```bash
npx hardhat compile
```
### Run Tests:
```bash
npx hardhat test
```
### Deploy Contracts:
```bash
npx hardhat deploy --tags <tag-name> --network <network-name>
```



## Audit and KYC
Elektroscrow's smart contracts have been audited and the development team is KYC verified by **SolidProof**. This enhances project credibility and assures users of the security and integrity of the platform. Detailed audit reports can be found via the provided [SolidProof](https://x.com/SolidProof_io/status/1763958258165764441) tweet.



  

## License
This project is licensed under the MIT License.


## Contact

For any inquiries or further information, please reach out at [alqeren1@gmail.com](mailto:alqeren1@gmail.com).


## Disclaimer
*Always perform due diligence when interacting with smart contracts and using custom tokens. Elektroscrow is designed to provide a secure and decentralized escrow solution; however, users are responsible for ensuring they fully understand the risks and mechanics of blockchain transactions.*