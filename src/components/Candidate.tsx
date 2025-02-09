import React, { useState } from 'react';
import './Candidate.css';

interface CandidateProps {
  id: number;
  name: string;
  voteCount: number;
  onVote: (id: number) => Promise<void>;
  canVote: boolean;
  hasVoted: boolean;
}

const Candidate: React.FC<CandidateProps> = ({ id, name, voteCount, onVote, canVote, hasVoted }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleVote = async () => {
    if (!canVote) {
      setMessageType('error');
      setVoteMessage(hasVoted ? 'You have already voted' : 'You cannot vote at this time');
      setTimeout(() => setVoteMessage(null), 3000);
      return;
    }

    try {
      setIsVoting(true);
      setVoteMessage(null);
      await onVote(id);
      setMessageType('success');
      setVoteMessage(`Successfully voted for ${name}`);
    } catch (error: any) {
      setMessageType('error');
      setVoteMessage(error.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
      setTimeout(() => setVoteMessage(null), 3000);
    }
  };

  return (
    <div className="candidate">
      <h2>{name}</h2>
      <p>Votes: {voteCount}</p>
      <button 
        onClick={handleVote} 
        disabled={!canVote || isVoting}
        className={`vote-button ${!canVote ? 'disabled' : ''}`}
      >
        {isVoting ? 'Voting...' : hasVoted ? 'Already Voted' : 'Vote'}
      </button>
      {voteMessage && (
        <p className={`vote-message ${messageType}`}>
          {voteMessage}
        </p>
      )}
    </div>
  );
};

export default Candidate;