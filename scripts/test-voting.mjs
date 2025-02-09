import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  try {
    // Get the contract instance
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();

    console.log("Test 1: Deploying contract...");
    await voting.waitForDeployment();
    const address = await voting.getAddress();
    console.log("Contract deployed to:", address);

    console.log("\nTest 2: Registering a new candidate...");
    const tx = await voting.registerCandidate("Alice");
    await tx.wait();
    console.log("Candidate registered successfully");

    console.log("\nTest 3: Getting candidate details...");
    const candidate = await voting.getCandidate(1);
    console.log("Candidate details:", {
      id: candidate[0],
      name: candidate[1],
      voteCount: candidate[2]
    });

    console.log("\nTest 4: Checking candidates count...");
    const count = await voting.candidatesCount();
    console.log("Total candidates:", count.toString());

    console.log("\nAll tests passed! ✅");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });