import pkg from 'hardhat';
const { ethers } = pkg;
import { expect } from "chai";

describe("Voting Contract", function() {
  let voting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function() {
    // Get signers
    [owner, voter1, voter2] = await ethers.getSigners();
    
    // Deploy contract
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = await VotingFactory.deploy();
    await voting.waitForDeployment();
    console.log("Contract deployed to:", await voting.getAddress());
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero candidates", async function() {
      expect(await voting.candidatesCount()).to.equal(0n);
    });
  });

  describe("Candidate Registration", function() {
    it("Should allow owner to register a candidate", async function() {
      await expect(voting.registerCandidate("Alice"))
        .to.emit(voting, "CandidateRegistered")
        .withArgs(1n, "Alice");

      const candidate = await voting.getCandidate(1);
      expect(candidate[1]).to.equal("Alice");
      expect(candidate[2]).to.equal(0n);
    });

    it("Should not allow empty candidate names", async function() {
      await expect(voting.registerCandidate(""))
        .to.be.revertedWith("Candidate name cannot be empty");
    });
  });

  describe("Voting Process", function() {
    beforeEach(async function() {
      await voting.registerCandidate("Alice");
    });

    it("Should allow a voter to cast a vote", async function() {
      await expect(voting.connect(voter1).vote(1))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 1n);

      const candidate = await voting.getCandidate(1);
      expect(candidate[2]).to.equal(1n);
    });

    it("Should prevent double voting", async function() {
      await voting.connect(voter1).vote(1);
      await expect(voting.connect(voter1).vote(1))
        .to.be.revertedWith("You have already voted");
    });

    it("Should track voting status correctly", async function() {
      expect(await voting.hasAddressVoted(voter1.address)).to.be.false;
      await voting.connect(voter1).vote(1);
      expect(await voting.hasAddressVoted(voter1.address)).to.be.true;
    });
  });
});