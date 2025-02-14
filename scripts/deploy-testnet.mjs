import pkg from 'hardhat';
import fs from 'fs';
import path from 'path';
const { ethers } = pkg;

const updateContractConfig = (config) => {
  const configPath = path.join(process.cwd(), 'public', 'contractConfig.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Contract configuration updated successfully');
  } catch (error) {
    console.error('Error writing contract configuration:', error);
  }
};

async function main() {
  // Deploy to testnet
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const contractConfig = {
    votingContractAddress: await voting.getAddress(),
    deployerAccount: deployer.address,
    deploymentNetwork: 'sepolia', // or your chosen testnet
    deploymentDate: new Date().toISOString()
  };

  updateContractConfig(contractConfig);
  console.log("Contract deployed to:", await voting.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });