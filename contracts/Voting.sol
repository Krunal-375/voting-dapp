// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }

    struct Election {
        uint256 id;
        string name;
        address createdBy;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        uint256 candidatesCount;
        mapping(address => bool) hasVoted;
    }

    // State variables
    mapping(uint256 => Election) public elections;
    uint256 public electionsCount;
    address public owner;
    // Remove these as they're now handled per election
    // mapping(address => bool) public hasRegistered;
    // mapping(address => bool) public hasVoted;

    // Events
    event ElectionCreated(uint256 indexed electionId, string name, address createdBy);
    event ElectionDeleted(uint256 indexed electionId);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event CandidateDeleted(uint256 indexed electionId, uint256 indexed candidateId);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 indexed candidateId);
    event VoteError(string message);

    constructor() {
        owner = msg.sender;
        electionsCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyElectionCreator(uint256 _electionId) {
        require(elections[_electionId].createdBy == msg.sender, "Only election creator can perform this action");
        _;
    }

    function createElection(string memory _name, string[] memory _candidates) public {
        require(bytes(_name).length > 0, "Election name cannot be empty");
        require(_candidates.length >= 2, "Minimum 2 candidates required");

        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;
        election.createdBy = msg.sender;
        election.isActive = true;
        election.candidatesCount = 0;

        // Add candidates
        for (uint i = 0; i < _candidates.length; i++) {
            election.candidatesCount++;
            election.candidates[election.candidatesCount] = Candidate({
                id: election.candidatesCount,
                name: _candidates[i],
                voteCount: 0,
                exists: true
            });
        }

        emit ElectionCreated(electionsCount, _name, msg.sender);
    }

    function getElections() public view returns (uint256[] memory) {
        uint256[] memory electionIds = new uint256[](electionsCount);
        uint256 activeCount = 0;
        
        for (uint256 i = 1; i <= electionsCount; i++) {
            if (elections[i].isActive) {
                electionIds[activeCount] = i;
                activeCount++;
            }
        }
        
        return electionIds;
    }

    function getElection(uint256 _electionId) public view returns (
        uint256 id,
        string memory name,
        address createdBy,
        bool isActive
    ) {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.name,
            election.createdBy,
            election.isActive
        );
    }

    function getElectionCandidate(uint256 _electionId, uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        uint256 voteCount
    ) {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        Election storage election = elections[_electionId];
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Invalid candidate ID");
        Candidate storage candidate = election.candidates[_candidateId];
        require(candidate.exists, "Candidate does not exist");
        
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getElectionCandidatesCount(uint256 _electionId) public view returns (uint256) {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        return elections[_electionId].candidatesCount;
    }

    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        Election storage election = elections[_electionId];
        require(election.isActive, "Election is not active");
        require(!election.hasVoted[msg.sender], "You have already voted in this election");
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Invalid candidate ID");
        require(election.candidates[_candidateId].exists, "Candidate does not exist");

        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;

        emit VoteCast(_electionId, msg.sender, _candidateId);
    }

    function hasAddressVotedInElection(uint256 _electionId, address _voter) public view returns (bool) {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        return elections[_electionId].hasVoted[_voter];
    }

    function deleteElection(uint256 _electionId) public {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        require(elections[_electionId].isActive, "Election already deleted");
        // Allow both admin and election creator to delete
        require(
            msg.sender == owner || elections[_electionId].createdBy == msg.sender,
            "Only admin or election creator can delete"
        );
    
        elections[_electionId].isActive = false;
        emit ElectionDeleted(_electionId);
    }

    function deleteCandidate(uint256 _electionId, uint256 _candidateId) public {
        require(_electionId > 0 && _electionId <= electionsCount, "Invalid election ID");
        Election storage election = elections[_electionId];
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Invalid candidate ID");
        require(election.candidates[_candidateId].exists, "Candidate does not exist");
        require(election.candidates[_candidateId].voteCount == 0, "Cannot delete candidate with votes");
        // Allow both admin and election creator to delete
        require(
            msg.sender == owner || election.createdBy == msg.sender,
            "Only admin or election creator can delete"
        );

        election.candidates[_candidateId].exists = false;
        emit CandidateDeleted(_electionId, _candidateId);
    }
}