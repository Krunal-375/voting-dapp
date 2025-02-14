export interface Election {
    id: number;
    name: string;
    createdBy: string;
    candidates: Candidate[];
    isActive: boolean;
    totalVotes: number;
  }
  
  export interface Candidate {
    id: number;
    name: string;
    voteCount: number;
  }
  
  export interface ElectionFormData {
    name: string;
    candidates: string[];
  }