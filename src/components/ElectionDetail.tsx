import React, { useState } from 'react';
import { Election } from '../types';
import './ElectionDetail.css';

interface ElectionDetailProps {
  election: Election;
  onVote: (electionId: number, candidateId: number) => Promise<void>;
  onDeleteCandidate: (electionId: number, candidateId: number) => Promise<void>;
  onBack: () => void;
  isAdmin: boolean;
  hasVoted: boolean;
  currentAccount: string;
}

const ElectionDetail: React.FC<ElectionDetailProps> = ({
  election,
  onVote,
  onDeleteCandidate,
  onBack,
  isAdmin,
  hasVoted,
  currentAccount
}) => {
  const [votingInProgress, setVotingInProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (candidateId: number) => {
    try {
      setVotingInProgress(candidateId);
      setError(null);
      await onVote(election.id, candidateId);
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote');
    } finally {
      setVotingInProgress(null);
    }
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    try {
      setError(null);
      await onDeleteCandidate(election.id, candidateId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete candidate');
    }
  };

  // Check if user can manage candidates (admin or election creator)
  const canManageCandidates = isAdmin || 
    election.createdBy.toLowerCase() === currentAccount.toLowerCase();

  return (
    <div className="election-detail">
      <div className="election-header">
        <button onClick={onBack} className="back-button">
          ← Back to Elections
        </button>
        <h2>{election.name}</h2>
        <p className="election-info">
          Created by: {election.createdBy.slice(0, 6)}...{election.createdBy.slice(-4)}
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="election-stats">
        <div className="stat-item">
          <span className="stat-label">Total Candidates:</span>
          <span className="stat-value">{election.candidates.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Votes:</span>
          <span className="stat-value">{election.totalVotes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className={`status-badge ${election.isActive ? 'active' : 'inactive'}`}>
            {election.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="candidates-list">
        {election.candidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <h3>{candidate.name}</h3>
            <div className="vote-stats">
              <p>Votes: {candidate.voteCount}</p>
              <p className="vote-percentage">
                {election.totalVotes > 0
                  ? `(${((candidate.voteCount / election.totalVotes) * 100).toFixed(1)}%)`
                  : '(0%)'}
              </p>
            </div>
            <div className="vote-progress">
              <div 
                className="progress-bar"
                style={{
                  width: election.totalVotes > 0
                    ? `${(candidate.voteCount / election.totalVotes) * 100}%`
                    : '0%'
                }}
              />
            </div>
            <div className="candidate-actions">
              {!hasVoted && election.isActive && (
                <button 
                  onClick={() => handleVote(candidate.id)}
                  className={`vote-button ${votingInProgress === candidate.id ? 'voting' : ''}`}
                  disabled={hasVoted || votingInProgress !== null}
                >
                  {votingInProgress === candidate.id ? 'Voting...' : 'Vote'}
                </button>
              )}
              {canManageCandidates && (
                <button
                  onClick={() => handleDeleteCandidate(candidate.id)}
                  className="delete-button"
                  disabled={candidate.voteCount > 0}
                  title={candidate.voteCount > 0 ? 
                    "Cannot delete candidate with votes" : 
                    "Delete candidate"}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionDetail;