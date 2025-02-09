// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    // Structure for Candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }

    // State variables
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;
    address public owner;
    mapping(address => bool) public hasRegistered;
    mapping(address => bool) public hasVoted;

    // Events
    event CandidateRegistered(uint256 indexed candidateId, string name);
    event RegistrationError(string message);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VoteError(string message);

    // Constructor
    constructor() {
        owner = msg.sender;
        candidatesCount = 0;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Function to register a new candidate
    function registerCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            voteCount: 0,
            exists: true
        });

        emit CandidateRegistered(candidatesCount, _name);
    }

    // Function to get candidate details
    function getCandidate(uint256 _candidateId) 
        public 
        view 
        returns (uint256 id, string memory name, uint256 voteCount) 
    {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        Candidate storage candidate = candidates[_candidateId];
        require(candidate.exists, "Candidate does not exist");
        
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    // Function to vote for a candidate
    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    // Function to check if an address has voted
    function hasAddressVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }
}