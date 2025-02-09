// filepath: src/components/CandidateForm.tsx
import React, { useState } from 'react';
import './CandidateForm.css';

interface CandidateFormProps {
  onAddCandidate: (name: string) => Promise<boolean>;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onAddCandidate }) => {
  const [name, setName] = useState('');
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const success = await onAddCandidate(name);
        if (success) {
          setAddMessage(`Successfully added candidate: ${name}`);
          setName('');
          setTimeout(() => setAddMessage(null), 3000);
        }
      } catch (error) {
        console.error('Failed to add candidate:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Candidate Name"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Candidate'}
      </button>
      {addMessage && <p className="add-message">{addMessage}</p>}
    </form>
  );
};

export default CandidateForm;