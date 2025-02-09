# Voting DApp

A decentralized voting application built on Ethereum blockchain that enables secure and transparent voting processes.

## Project Description

This Voting DApp is a blockchain-based voting system that allows:
- Administrators to create and manage candidates
- Voters to cast their votes securely
- Real-time vote counting and result display
- Transparent and immutable voting records
- Single vote verification per wallet address

## Key Features

- **Secure Authentication**: MetaMask wallet integration for user authentication
- **Role-Based Access**:
  - Admin: Can add candidates and manage the voting process
  - Voters: Can cast one vote per wallet address
- **Real-Time Updates**: Instant vote count updates and candidate status
- **Transparent Voting**: All transactions are recorded on the blockchain
- **User-Friendly Interface**: Simple and intuitive UI for voting and candidate management
- **Vote Verification**: Built-in mechanisms to prevent double voting
- **Smart Contract Security**: Solidity-based secure voting contract

## Technology Stack

### Frontend
- React.js with TypeScript
- Vite for build tooling
- ethers.js for blockchain interactions
- CSS for styling

### Backend/Blockchain
- Solidity ^0.8.18 for smart contracts
- Hardhat for development environment
- Ganache for local blockchain testing
- Ethereum blockchain

### Testing & Development
- Chai for testing
- Hardhat for contract deployment
- TypeScript for type safety
- ESLint for code quality

## Prerequisites

### Node.js/npm Requirements
- Node.js version 16.x or higher
- npm version 8.x or higher

To check your versions:
```bash
node --version
npm --version
```

### MetaMask Installation
1. Install MetaMask from [official website](https://metamask.io/download/)
2. Create or import a wallet
3. Configure network settings:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

### Local Blockchain Setup (Ganache)
1. Install Ganache globally:
```bash
npm install -g ganache
```

2. Required configurations:
   - Port: 8545
   - Network ID: 1337
   - Number of accounts: 10
   - Default balance: 1000 ETH

3. Verify installation:
```bash
ganache --version
```

Note: The project includes a setup script (`scripts/start-local.sh`) that automatically configures these requirements.

## Installation & Configuration

### Repository Cloning
1. Clone the repository:
```bash
git clone https://github.com/Krunal-375/voting-dapp.git
cd voting-dapp
```

### Dependencies Installation
1. Install project dependencies:
```bash
npm install
```

2. Verify installations:
```bash
npx hardhat --version
npm list ethers
npm list @vitejs/plugin-react
```

### Environment Setup
1. Create a development environment file:
```bash
touch .env.local
```

2. Add required environment variables:
```env
# filepath: .env.local
VITE_CHAIN_ID=1337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_NETWORK_NAME="Ganache Local"
```

3. Create configuration directory:
```bash
mkdir -p public
```

4. Initial contract configuration:
```bash
touch public/contractConfig.json
```

5. Verify project structure:
```bash
ls -la
```

Your project structure should look like:
```
voting-dapp/
├── contracts/
├── public/
├── scripts/
├── src/
├── test/
├── .env.local
├── hardhat.config.cjs
├── package.json
└── README.md
```

Note: Make sure all files have appropriate permissions:
```bash
chmod +x scripts/start-local.sh
```

## Local Development

### Starting Local Blockchain
1. Run the provided setup script:
```bash
./scripts/start-local.sh
```
This script will:
- Start Ganache local blockchain
- Generate test accounts
- Configure network settings
- Deploy smart contracts

### Test Accounts Setup
After running the setup script, you'll have access to:

1. **Admin Account (Contract Owner)**
- Can add candidates and vote
- Balance: 1000 ETH
- Account details will be displayed in terminal

2. **Client Test Accounts (Voters)**
- 3 test accounts for voting
- Each with 1000 ETH balance
- Private keys displayed in terminal

### MetaMask Configuration
1. Import test accounts using private keys:
   - Admin account for managing candidates
   - Client accounts for testing voting

### Contract Deployment
The setup script automatically:
1. Deploys the voting contract
2. Saves configuration to `public/contractConfig.json`
3. Sets up admin permissions

### Frontend Development Server
1. The setup script automatically starts the development server
2. Access the application at: `http://localhost:5173`

To manually start the development server:
```bash
npm run dev
```

Note: Make sure MetaMask is connected to Ganache Local network (http://127.0.0.1:8545) before interacting with the dApp.

## Smart Contract Details

### Contract Functionality
The voting smart contract (`contracts/Voting.sol`) implements:
- Secure candidate registration system
- One-vote-per-address mechanism
- Role-based access control
- Real-time vote tracking
- Transparent vote counting

### Core Features

1. **Admin Controls**
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can perform this action");
    _;
}
```
- Owner designation at deployment
- Exclusive candidate registration rights
- System administration capabilities

2. **Candidate Management**
```solidity
struct Candidate {
    uint256 id;
    string name;
    uint256 voteCount;
    bool exists;
}
```
- Unique candidate identification
- Vote count tracking
- Existence verification

3. **Voting System**
- Single vote per address enforcement
- Vote status tracking
- Real-time vote counting

### Events and Functions

1. **Events**
```solidity
event CandidateRegistered(uint256 indexed candidateId, string name);
event RegistrationError(string message);
event VoteCast(address indexed voter, uint256 indexed candidateId);
event VoteError(string message);
```

2. **Key Functions**
- **Registration**
```solidity
function registerCandidate(string memory _name) public onlyOwner
```

- **Voting**
```solidity
function vote(uint256 _candidateId) public
```

- **Query Functions**
```solidity
function getCandidate(uint256 _candidateId) public view returns (uint256, string memory, uint256)
function hasAddressVoted(address _voter) public view returns (bool)
function candidatesCount() public view returns (uint256)
```

## Usage Guide

### MetaMask Configuration
1. **Network Setup**
   ```
   Network Name: Ganache Local
   RPC URL: http://127.0.0.1:8545
   Chain ID: 1337
   Currency Symbol: ETH
   ```

2. **Account Import**
   - Import admin account for managing candidates
   - Import test accounts for voting simulation
   - Ensure sufficient ETH balance (automatically set to 1000 ETH)

### Adding Candidates (Admin Only)
1. **Connect Admin Wallet**
   - Use MetaMask to connect with admin account
   - Verify connection status in UI

2. **Register Candidates**
   - Click "Add Candidate" button
   - Enter candidate name
   - Confirm transaction in MetaMask
   - Wait for blockchain confirmation

### Voting Process
1. **Connect Voter Wallet**
   - Switch to voter account in MetaMask
   - Connect wallet through dApp interface

2. **Cast Vote**
   - Select desired candidate from list
   - Click "Vote" button
   - Confirm transaction in MetaMask
   - Wait for vote confirmation

3. **Voting Rules**
   - One vote per wallet address
   - Cannot vote for non-existent candidates
   - Cannot vote twice from same address

### Checking Results
1. **View Live Results**
   - Real-time vote count display
   - Percentage distribution
   - Total votes cast

2. **Verify Transactions**
   - Check vote status in UI
   - View transaction history in MetaMask
   - Verify on local blockchain explorer

Note: All transactions require MetaMask confirmation and may take a few seconds to be processed on the blockchain.

## Testing

### Running Tests
1. **Unit Tests**
```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/voting.test.mjs

# Run tests with console output
npm test -- --verbose
```

### Test Coverage
1. **Generate Coverage Report**
```bash
npx hardhat coverage
```

Coverage includes:
- Contract methods
- Function execution paths
- Event emissions
- Modifier validations

2. **View Coverage Results**
```
-------------------|----------|----------|----------|----------|
File              |  % Stmts |  % Branch|  % Funcs |  % Lines|
-------------------|----------|----------|----------|----------|
 contracts/       |    100.0 |    100.0 |    100.0 |    100.0|
  Voting.sol      |    100.0 |    100.0 |    100.0 |    100.0|
-------------------|----------|----------|----------|----------|
```

### Test Scenarios

1. **Contract Deployment**
```javascript
describe("Deployment", () => {
  it("Should set the right owner")
  it("Should initialize with zero candidates")
});
```

2. **Candidate Management**
```javascript
describe("Candidate Registration", () => {
  it("Should allow owner to register a candidate")
  it("Should not allow empty candidate names")
  it("Should prevent duplicate candidates")
});
```

3. **Voting Process**
```javascript
describe("Voting Process", () => {
  it("Should allow a voter to cast a vote")
  it("Should prevent double voting")
  it("Should track voting status correctly")
});
```

4. **Access Control**
```javascript
describe("Access Control", () => {
  it("Should restrict candidate registration to owner")
  it("Should allow any address to vote")
  it("Should prevent voting for invalid candidates")
});
```

### Running Manual Tests
Use the test script for manual verification:
```bash
node scripts/test-voting.mjs
```

This will:
- Deploy test contract
- Register sample candidate
- Perform test votes
- Display results

## Project Structure

### Directory Layout
```
voting-dapp/
├── contracts/          # Smart contract source files
│   └── Voting.sol      # Main voting contract
├── public/            # Static assets and configurations
│   └── contractConfig.json  # Deployed contract details
├── scripts/           # Deployment and utility scripts
│   ├── deploy.mjs     # Contract deployment script
│   └── start-local.sh # Local environment setup
├── src/              # Frontend application source
│   ├── components/    # React components
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
└── test/             # Test files
    └── voting.test.mjs # Contract test suite
```

### Key Files

1. **Smart Contract**
- `contracts/Voting.sol`: Main voting contract implementation
- `hardhat.config.cjs`: Hardhat configuration for contract development

2. **Frontend**
- `src/App.tsx`: Main application component
- `src/components/*`: Reusable UI components
- `src/index.css`: Global styles
- `vite.config.ts`: Vite build configuration

3. **Scripts**
- `scripts/deploy.mjs`: Contract deployment logic
- `scripts/start-local.sh`: Local development setup
- `scripts/test-voting.mjs`: Manual testing script

### Configuration Files

1. **Environment Setup**
```env
# .env.local
VITE_CHAIN_ID=1337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_NETWORK_NAME="Ganache Local"
```

2. **Contract Configuration**
```json
// public/contractConfig.json
{
  "votingContractAddress": "0x...",
  "deployerAccount": "0x...",
  "deploymentNetwork": "localhost",
  "deploymentDate": "..."
}
```

3. **Build Configuration**
- `tsconfig.json`: TypeScript configuration
- `hardhat.config.cjs`: Blockchain development setup
- `vite.config.ts`: Frontend build settings
- `package.json`: Project dependencies and scripts

## Contributing

### Contribution Guidelines
1. **Fork & Clone**
```bash
# Fork via GitHub UI
git clone https://github.com/Krunal-375/voting-dapp.git
cd voting-dapp
git checkout -b feature/your-feature-name
```

2. **Development Standards**
- Follow existing code style and formatting
- Add comments for complex logic
- Update tests for new features
- Maintain type safety with TypeScript
- Follow clean code principles

3. **Testing Requirements**
```bash
# Run all checks before submitting
npm test
npm run lint
npx hardhat coverage
```

### Code of Conduct

1. **Community Standards**
- Be respectful and inclusive
- Use welcoming language
- Focus on constructive feedback
- Accept constructive criticism
- Put project quality first

2. **Technical Standards**
- Write self-documenting code
- Maintain test coverage
- Update documentation
- Follow security best practices
- Keep dependencies updated

### Pull Request Process

1. **Preparation**
```bash
# Ensure your branch is updated
git fetch origin
git rebase origin/main
```

2. **PR Requirements**
- Clear description of changes
- Reference related issues
- Update documentation
- Add/update tests
- Pass all CI checks

3. **Review Process**
- Address review comments
- Maintain clean commit history
- Follow up with requested changes
- Update branch when needed

4. **Merge Checklist**
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Conflicts resolved
- [ ] PR approved by maintainers

## Additional Documentation

### License
```text
MIT License

Copyright (c) 2025 Voting DApp Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Acknowledgments

- **Open Source Libraries**
  - React.js for the frontend framework
  - ethers.js for blockchain interactions
  - Hardhat for smart contract development
  - Chai for testing framework
  - Vite for build tooling

- **Developer Tools**
  - MetaMask for wallet integration
  - Ganache for local blockchain
  - Visual Studio Code
  - Git & GitHub

- **Community Resources**
  - Ethereum Developer Documentation
  - Solidity Documentation
  - React Documentation
  - ethers.js Documentation

### Contact Information

- **Project Maintainer**
  - Name: [Krunal Dhapodkar]
  - Email: [krunaldhapodkar24@gmail.com]
  - GitHub: [@Krunal-375](https://github.com/Kruanl-375)

- **Bug Reports**
  - Submit issues via [GitHub Issues](https://github.com/Krunal-375/voting-dapp/issues)
  - Include detailed description and steps to reproduce

- **Feature Requests**
  - Use GitHub Issues with label "enhancement"
  - Provide use case and implementation ideas

- **Security Issues**
  - Report security vulnerabilities to [krunaldhapodkar24@gmail.com]
  - Use PGP encryption when possible