#!/bin/bash

# Kill any existing Ganache instances
pkill -f ganache || true

# Create logs directory if it doesn't exist
mkdir -p logs

# Start Ganache and capture its output
echo "Starting Ganache..."
ganache > logs/ganache.log 2>&1 &

# Wait for Ganache to start and log to initialize
sleep 5

# Print separator for better readability
echo "
╔════════════════════════════════════════════════════════════════╗
║                   VOTING DAPP - TEST ACCOUNTS                   ║
╚════════════════════════════════════════════════════════════════╝"

# Extract account details from Ganache logs (1 admin + 3 clients)
ADMIN_ADDRESS=$(grep "0x" logs/ganache.log | head -n 1 | awk '{print $2}')
ADMIN_KEY=$(grep "0x" logs/ganache.log | head -n 11 | tail -n 1 | awk '{print $2}')

CLIENT1_ADDRESS=$(grep "0x" logs/ganache.log | head -n 2 | tail -n 1 | awk '{print $2}')
CLIENT1_KEY=$(grep "0x" logs/ganache.log | head -n 12 | tail -n 1 | awk '{print $2}')

CLIENT2_ADDRESS=$(grep "0x" logs/ganache.log | head -n 3 | tail -n 1 | awk '{print $2}')
CLIENT2_KEY=$(grep "0x" logs/ganache.log | head -n 13 | tail -n 1 | awk '{print $2}')

CLIENT3_ADDRESS=$(grep "0x" logs/ganache.log | head -n 4 | tail -n 1 | awk '{print $2}')
CLIENT3_KEY=$(grep "0x" logs/ganache.log | head -n 14 | tail -n 1 | awk '{print $2}')

# Print Network Configuration
echo "
📡 NETWORK CONFIGURATION
-------------------------
• Network Name: Ganache Local
• RPC URL: http://127.0.0.1:8545
• Chain ID: 1337
• Currency Symbol: ETH"

# Print Admin Account Details
echo "
👑 ADMIN ACCOUNT (Contract Owner)
-------------------------
• Address: $ADMIN_ADDRESS
• Private Key: $ADMIN_KEY
• Balance: 1000 ETH
• Permissions: Can add candidates and vote"

# Print Client Account Details
echo "
👥 CLIENT ACCOUNTS (Voters)
-------------------------
🗳️ CLIENT 1
• Address: $CLIENT1_ADDRESS
• Private Key: $CLIENT1_KEY
• Balance: 1000 ETH
• Permissions: Can only vote

🗳️ CLIENT 2
• Address: $CLIENT2_ADDRESS
• Private Key: $CLIENT2_KEY
• Balance: 1000 ETH
• Permissions: Can only vote

🗳️ CLIENT 3
• Address: $CLIENT3_ADDRESS
• Private Key: $CLIENT3_KEY
• Balance: 1000 ETH
• Permissions: Can only vote"

echo "
╔════════════════════════════════════════════════════════════════╗
║                     METAMASK SETUP STEPS                        ║
╚════════════════════════════════════════════════════════════════╝

1. Add Ganache Network in MetaMask:
   • Network Name: Ganache Local
   • RPC URL: http://127.0.0.1:8545
   • Chain ID: 1337
   • Currency Symbol: ETH

2. Import Admin Account:
   • Use the ADMIN private key to import the contract owner account

3. Import Client Accounts:
   • Import any of the CLIENT private keys to test voting functionality
   • Each client can vote only once
   • You can test multiple voters by importing different client accounts

Note: Import different client accounts to simulate multiple voters
"

# Deploy the contract
echo "Deploying contract with ADMIN account..."
npx hardhat run scripts/deploy.mjs --network localhost

# Display deployment information
echo "
Contract deployment completed! ✨
Configuration saved to public/contractConfig.json

Starting development server...
"

# Start the development server
npm run dev