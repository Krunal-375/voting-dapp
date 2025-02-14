import { useState } from 'react';
import { ElectionFormData } from '../types';
import './ElectionForm.css';

interface ElectionFormProps {
  onSubmit: (data: ElectionFormData) => Promise<void>;
  onCancel: () => void;
}

const ElectionForm: React.FC<ElectionFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['', '']);
  const [error, setError] = useState('');

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Election name is required');
      return;
    }
    
    const validCandidates = candidates.filter(c => c.trim());
    if (validCandidates.length < 2) {
      setError('At least 2 candidates are required');
      return;
    }

    await onSubmit({ name, candidates: validCandidates });
  };

  return (
    <div className="election-form-container">
      <h2>Create New Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Election Name:</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter election name"
          />
        </div>

        <div className="candidates-section">
          <h3>Candidates</h3>
          {candidates.map((candidate, index) => (
            <div key={index} className="candidate-input">
              <input
                type="text"
                value={candidate}
                onChange={(e) => {
                  const newCandidates = [...candidates];
                  newCandidates[index] = e.target.value;
                  setCandidates(newCandidates);
                }}
                placeholder={`Candidate ${index + 1}`}
              />
              {candidates.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveCandidate(index)}
                  className="remove-button"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddCandidate}
            className="add-button"
          >
            + Add Candidate
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Election
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ElectionForm;