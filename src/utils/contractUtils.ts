export interface ContractConfig {
    votingContractAddress: string;
    deployerAccount: string;
    deploymentNetwork: string;
    deploymentDate: string;
  }
  
  export const getContractConfig = async (): Promise<ContractConfig> => {
    try {
      const response = await fetch('/contractConfig.json');
      if (!response.ok) {
        throw new Error('Failed to load contract configuration');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading contract configuration:', error);
      throw error;
    }
  };