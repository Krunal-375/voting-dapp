import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Candidate from './components/Candidate';
import CandidateForm from './components/CandidateForm';
import { getContractConfig } from './utils/contractUtils';
import './App.css';

// Import the contract ABI
const VotingABI = [
  "function candidatesCount() public view returns (uint256)",
  "function getCandidate(uint256 _candidateId) public view returns (uint256 id, string memory name, uint256 voteCount)",
  "function registerCandidate(string memory _name) public",
  "function owner() public view returns (address)",
  "function vote(uint256 _candidateId) public",
  "function hasAddressVoted(address _voter) public view returns (bool)",
  "event VoteCast(address indexed voter, uint256 indexed candidateId)",
  "event VoteError(string message)"
];

// Add this interface before the App component
interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}


function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

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
    </div>
  );

  const MainScreen = () => {
    const totalVotes = candidates.reduce((total, candidate) => total + candidate.voteCount, 0);

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

        {isAdmin && <CandidateForm onAddCandidate={handleAddCandidate} />}

        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Candidates</h3>
            <p>{candidates.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Votes</h3>
            <p>{totalVotes}</p>
          </div>
        </div>

        <div className="candidates-section">
          {totalVotes === 0 && (
            <p className="no-votes-message">No votes have been cast yet.</p>
          )}
          
          {candidates.length === 0 ? (
            <p className="no-candidates-message">
              No candidates available. {isAdmin && 'Please add a candidate.'}
            </p>
          ) : (
            <div className="candidates-grid">
              {candidates.map(candidate => (
                <Candidate
                  key={candidate.id}
                  id={candidate.id}
                  name={candidate.name}
                  voteCount={candidate.voteCount}
                  onVote={handleVote}
                  canVote={!isAdmin && !hasVoted && !!account}
                  hasVoted={hasVoted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const checkVotingStatus = async (address: string) => {
    if (contract) {
      try {
        const voted = await contract.hasAddressVoted(address);
        setHasVoted(voted);
      } catch (error) {
        console.error("Error checking voting status:", error);
      }
    }
  };

  // Add effect to monitor account changes and check voting status
  useEffect(() => {
    if (account && contract) {
      checkVotingStatus(account);
    }
  }, [account, contract]);

  const refreshCandidates = async () => {
    if (contract) {
      try {
        const count = await contract.candidatesCount();
        const candidatesList: Candidate[] = [];
        for (let i = 1; i <= count; i++) {
          const candidate = await contract.getCandidate(i);
          candidatesList.push({
            id: Number(candidate[0]),
            name: candidate[1],
            voteCount: Number(candidate[2])
          });
        }
        setCandidates(candidatesList);
      } catch (error) {
        console.error("Error refreshing candidates:", error);
      }
    }
  };

  const handleVote = async (candidateId: number) => {
      if (!contract || !account) {
          setErrorMessage("Please connect your wallet first");
          return;
      }

      await checkVotingStatus(account);

      if (hasVoted) {
        setErrorMessage("You have already voted");
        return;
      }

      try {
          setLoading(true);
           const tx = await contract.vote(candidateId);
           console.log("Transaction sent:", tx.hash);
           await tx.wait();
          console.log("Vote confirmed");
            // Update voting status
           await checkVotingStatus(account);
           await refreshCandidates();
            
            // Refresh candidate list
            const updatedCandidate = await contract.getCandidate(candidateId);
            setCandidates(candidates.map(c => 
                c.id === candidateId 
                    ? {...c, voteCount: Number(updatedCandidate[2])} 
                    : c
            ));
            
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
        setContract(votingContract);

       // Load candidates
       const count = await votingContract.candidatesCount();
       console.log("Total candidates:", count.toString());
       
       const candidatesList: Candidate[] = [];
       for (let i = 1; i <= count; i++) {
         const candidate = await votingContract.getCandidate(i);
         candidatesList.push({
           id: Number(candidate[0]),
           name: candidate[1],
           voteCount: Number(candidate[2])
         });
       }
       setCandidates(candidatesList);
       // Check if user has voted
       if (currentAccount) {
        await checkVotingStatus(currentAccount);
      }
       setLoading(false);
     } catch (error) {
       console.error("Contract initialization error:", error);
       setErrorMessage("Failed to initialize contract");
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

  const handleAddCandidate = async (name: string): Promise<boolean> => {
    if (!contract || !account) {
      setErrorMessage("Please connect your wallet first");
      return false;
    }
  
    try {
      setLoading(true);
      const contractConfig = await getContractConfig();
      
      // Check if connected account is the owner
      if (account.toLowerCase() !== contractConfig.deployerAccount.toLowerCase()) {
        setErrorMessage("Only the contract owner can register candidates");
        setLoading(false);
        return false;
      }
  
      const tx = await contract.registerCandidate(name);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      
      // Refresh candidates list
      const count = await contract.candidatesCount();
      const candidate = await contract.getCandidate(count);
      setCandidates([...candidates, {
        id: Number(candidate[0]),
        name: candidate[1],
        voteCount: Number(candidate[2])
      }]);
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error adding candidate:", error);
      setErrorMessage(error.reason || error.message || "Failed to add candidate");
      setLoading(false);
      return false;
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