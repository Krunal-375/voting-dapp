import React from 'react';
import { Election } from '../types';
import './ElectionList.css';

interface ElectionListProps {
    elections: Election[];
    onSelectElection: (electionId: number) => void;
    onDeleteElection: (electionId: number) => Promise<void>;
    isAdmin: boolean;
    currentAccount: string;
    votedElections: {[key: number]: boolean};
  }
  
  const ElectionList: React.FC<ElectionListProps> = ({
    elections,
    onSelectElection,
    onDeleteElection,
    isAdmin,
    currentAccount,
    votedElections
  }) => {
    return (
      <div className="elections-list">
        <h2>Available Elections</h2>
        {elections.length === 0 ? (
          <p className="no-elections">No elections available</p>
        ) : (
          <div className="elections-grid">
            {elections.map(election => (
              <div key={election.id} className="election-card">
                <h3>{election.name}</h3>
                <p>Candidates: {election.candidates.length}</p>
                <p>Total Votes: {election.totalVotes}</p>
                <p className="creator-info">
                  Created by: {election.createdBy === currentAccount ? 'You' : 
                    `${election.createdBy.slice(0, 6)}...${election.createdBy.slice(-4)}`}
                </p>
                {votedElections[election.id] && (
                  <p className="voted-indicator">You have voted in this election</p>
                )}
                <div className="election-actions">
                  <button
                    onClick={() => onSelectElection(election.id)}
                    className="view-button"
                  >
                    View Details
                  </button>
                  {/* Show delete button for both admin and election creator */}
                  {(isAdmin || election.createdBy.toLowerCase() === currentAccount.toLowerCase()) && (
                    <button
                      onClick={() => onDeleteElection(election.id)}
                      className="delete-button"
                      title={isAdmin ? "Delete as admin" : "Delete your election"}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default ElectionList;