import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Election, Candidate, ElectionFormData } from './types';
import { getContractConfig } from './utils/contractUtils';
import './App.css';
import ElectionForm from './components/ElectionForm';
import ElectionList from './components/ElectionList';
import ElectionDetail from './components/ElectionDetail';

// Import the contract ABI
const VotingABI = [
  "function candidatesCount() public view returns (uint256)",
  "function getCandidate(uint256 _candidateId) public view returns (uint256 id, string memory name, uint256 voteCount)",
  "function registerCandidate(string memory _name) public",
  "function owner() public view returns (address)",
  "function vote(uint256 _electionId, uint256 _candidateId) public", // Updated
  "function createElection(string memory _name, string[] memory _candidates) public",
  "function getElections() public view returns (uint256[])",
  "function getElection(uint256 _electionId) public view returns (uint256 id, string memory name, address createdBy, bool isActive)",
  "function deleteElection(uint256 _electionId) public",
  "function deleteCandidate(uint256 _electionId, uint256 _candidateId) public",
  "function hasAddressVotedInElection(uint256 _electionId, address _voter) public view returns (bool)",
  "function getElectionCandidate(uint256 _electionId, uint256 _candidateId) public view returns (uint256 id, string memory name, uint256 voteCount)",
  "function getElectionCandidatesCount(uint256 _electionId) public view returns (uint256)",
  "event ElectionCreated(uint256 indexed electionId, string name, address createdBy)",
  "event ElectionDeleted(uint256 indexed electionId)",
  "event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name)",
  "event CandidateDeleted(uint256 indexed electionId, uint256 indexed candidateId)",
  "event VoteCast(uint256 indexed electionId, address indexed voter, uint256 indexed candidateId)",
  "event VoteError(string message)"
];


function App() {
  const [] = useState<Candidate[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [hasVoted] = useState<boolean>(false);
  const [elections, setElections] = useState<Election[]>([]);
  const [votedElections, setVotedElections] = useState<{[key: number]: boolean}>({});

  const handleCreateElection = async (data: ElectionFormData) => {
    if (!contract || !account) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
  
    try {
      setLoading(true);
      const tx = await contract.createElection(data.name, data.candidates);
      await tx.wait();
      
      // Refresh elections list
      await refreshElections();
      setLoading(false);
    } catch (error: any) {
      console.error("Error creating election:", error);
      setErrorMessage(error.reason || error.message || "Failed to create election");
      setLoading(false);
    }
  };
  
  const handleDeleteElection = async (electionId: number) => {
    if (!contract || !account) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
  
    try {
      setLoading(true);
      const tx = await contract.deleteElection(electionId);
      await tx.wait();
      
      // Refresh elections list
      await refreshElections();
      setLoading(false);
    } catch (error: any) {
      console.error("Error deleting election:", error);
      setErrorMessage(error.reason || error.message || "Failed to delete election");
      setLoading(false);
    }
  };
  
  const handleDeleteCandidate = async (electionId: number, candidateId: number) => {
    if (!contract || !account) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
  
    try {
      setLoading(true);
      const tx = await contract.deleteCandidate(electionId, candidateId);
      await tx.wait();
      
      // Refresh elections list
      await refreshElections();
      setLoading(false);
    } catch (error: any) {
      console.error("Error deleting candidate:", error);
      setErrorMessage(error.reason || error.message || "Failed to delete candidate");
      setLoading(false);
    }
  };
  
  const refreshElections = async () => {
    if (!contract) return;
  
    try {
      const electionIds = await contract.getElections();
      const electionsList: Election[] = [];
  
      for (const id of electionIds) {
        const election = await contract.getElection(id);
        const candidates: Candidate[] = [];
        
        // Get candidates for this election
        const candidateCount = await contract.getElectionCandidatesCount(id);
        
        // Start from index 0 since arrays are zero-based
        for (let i = 0; i < Number(candidateCount); i++) {
          try {
            const candidate = await contract.getElectionCandidate(id, i + 1); // Add 1 to match contract indexing
            candidates.push({
              id: i + 1, // Use 1-based indexing for candidates
              name: candidate.name,
              voteCount: Number(candidate.voteCount)
            });
          } catch (error) {
            console.error(`Error fetching candidate ${i} for election ${id}:`, error);
          }
        }
  
        electionsList.push({
          id: Number(id),
          name: election.name,
          createdBy: election.createdBy,
          candidates: candidates,
          isActive: election.isActive,
          totalVotes: candidates.reduce((sum, c) => sum + c.voteCount, 0)
        });
      }
  
      setElections(electionsList);
    } catch (error) {
      console.error("Error refreshing elections:", error);
    }
  };

  const IntroScreen = () => (
    <div className="intro-screen">
      <h1>Welcome to Voting DApp</h1>
      <p className="intro-description">
        A secure and transparent blockchain-based voting system
      </p>
      
      <div className="connect-wallet-section">
        <button className="connect-button" onClick={connectWallet}>
          Connect with MetaMask
        </button>
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure Voting</h3>
            <p>MetaMask authentication ensures secure voting process</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Real-time Updates</h3>
            <p>Instant vote counting and result updates</p>
          </div>
          <div className="feature-card">
            <h3>📊 Transparent</h3>
            <p>All votes are recorded on the blockchain</p>
          </div>
          <div className="feature-card">
            <h3>✨ User-Friendly</h3>
            <p>Simple and intuitive voting interface</p>
          </div>
        </div>
      </div>
      <div className="demo-section">
      <button 
        className="demo-button"
        onClick={() => window.location.href = 'http://localhost:5173'} // Local development URL
      >
        Try Demo (Local)
      </button>
    </div>
    </div>
  );

  const MainScreen = () => {
    const [showElectionForm, setShowElectionForm] = useState(false);
    const [selectedElection, setSelectedElection] = useState<Election | null>(null);
    return (
      <div className="main-screen">
        <div className="header-section">
          <h1>Voting DApp</h1>
          <div className="account-info">
            <p className="address">Connected as: {account}</p>
            <p className="role-indicator">
              Role: {isAdmin ? (
                <span className="admin-role">Admin</span>
              ) : (
                <span className="voter-role">
                  Voter {hasVoted && '(Already Voted)'}
                </span>
              )}
            </p>
          </div>
        </div>
        {showElectionForm ? (
        <ElectionForm
          onSubmit={handleCreateElection}
          onCancel={() => setShowElectionForm(false)}
        />
      ) : selectedElection ? (
        <ElectionDetail
          election={selectedElection}
          onVote={handleVote}
          onDeleteCandidate={handleDeleteCandidate}
          onBack={() => setSelectedElection(null)}
          isAdmin={isAdmin}
          hasVoted={votedElections[selectedElection.id] || false}
          currentAccount={account || ''}
        />
      ) : (
        <>
          <div className="actions-section">
            <button 
              className="create-election-button"
              onClick={() => setShowElectionForm(true)}
            >
              Create New Election
            </button>
          </div>

          <ElectionList
      elections={elections}
      onSelectElection={(id) => {
        const election = elections.find(e => e.id === id);
        if (election) setSelectedElection(election);
      }}
      onDeleteElection={handleDeleteElection}
      isAdmin={isAdmin}
      currentAccount={account || ''}
      votedElections={votedElections}
    />
        </>
      )}
    </div>
  );
};

const checkVotingStatus = async (address: string) => {
  if (!contract) return;
  try {
    const electionIds = await contract.getElections();
    const votedStatus: {[key: number]: boolean} = {};
    
    // Check voting status for each election
    for (const id of electionIds) {
      const election = await contract.getElection(id);
      if (election.isActive) {
        const hasVoted = await contract.hasAddressVotedInElection(id, address);
        votedStatus[Number(id)] = hasVoted;
      }
    }
    
    setVotedElections(votedStatus);
  } catch (error) {
    console.error("Error checking voting status:", error);
  }
};

  // Add effect to monitor account changes and check voting status
  useEffect(() => {
    if (account && contract) {
      checkVotingStatus(account);
    }
  }, [account, contract]);


  const handleVote = async (electionId: number, candidateId: number) => {
    if (!contract || !account) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
  
    try {
      setLoading(true);
      const tx = await contract.vote(electionId, candidateId);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Vote confirmed");
      
      // Update voting status
      await checkVotingStatus(account);
      await refreshElections();
      setLoading(false);
    } catch (error: any) {
      console.error("Error voting:", error);
      setErrorMessage(error.reason || error.message || "Failed to vote");
      setLoading(false);
    }
  };

  const initializeContract = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractConfig = await getContractConfig();
        
        const currentAccount = await signer.getAddress();
        setIsAdmin(currentAccount.toLowerCase() === contractConfig.deployerAccount.toLowerCase());
  
        console.log("Initializing contract with address:", contractConfig.votingContractAddress);
        const votingContract = new ethers.Contract(
          contractConfig.votingContractAddress,
          VotingABI,
          signer
        );
        
        // Verify contract deployment
        const owner = await votingContract.owner();
        console.log("Contract owner:", owner);
        
        setContract(votingContract);
        await refreshElections(); // Move this here
        
        if (currentAccount) {
          await checkVotingStatus(currentAccount);
        }
        setLoading(false);
      } catch (error) {
        console.error("Contract initialization error:", error);
        setErrorMessage("Failed to initialize contract. Please make sure you're connected to the correct network.");
        setLoading(false);
      }
    }
  };

  const connectWallet = async () => {
    setErrorMessage(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await initializeContract();
      } catch (error: any) {
        console.error("MetaMask connection failed", error);
        setErrorMessage("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      setErrorMessage("MetaMask is not installed. Please install MetaMask.");
    }
  };
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await initializeContract();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
      setLoading(false);
    };

    checkWalletConnection();
  }, []);

  // Add this effect after the existing effects in App.tsx
useEffect(() => {
  if (contract && account) {
    refreshElections();
  }
}, [contract, account]);

  return (
    <div className="app-container">
      {loading ? (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : account ? (
        <MainScreen />
      ) : (
        <IntroScreen />
      )}
    </div>
  );
}

export default App;