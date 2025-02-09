import pkg from 'hardhat';
import fs from 'fs';
import path from 'path';
const { ethers } = pkg;

const updateContractConfig = (config) => {
  const configPath = path.join(process.cwd(), 'public', 'contractConfig.json');
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'));
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Contract configuration updated successfully');
  } catch (error) {
    console.error('Error writing contract configuration:', error);
  }
};

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();

    await voting.waitForDeployment();
    const address = await voting.getAddress();
    
    const contractConfig = {
      votingContractAddress: address,
      deployerAccount: deployer.address,
      deploymentNetwork: 'localhost',
      deploymentDate: new Date().toISOString()
    };

    updateContractConfig(contractConfig);

    console.log("Voting contract deployed to:", address);
    console.log("Contract configuration saved to public/contractConfig.json");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });