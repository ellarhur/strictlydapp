import { Contract } from 'ethers';
import { STRICTLY_CONTRACT_ADDRESS, STRICTLY_ABI } from '../utils/contractConfig';
import { JsonRpcSigner } from 'ethers';


export const useStrictlyContract = (signer: JsonRpcSigner | null) => {
  if (!signer) {
    console.log('⚠️ Ingen signer - användaren inte ansluten');
    return null;
  }

  const contract = new Contract(
    STRICTLY_CONTRACT_ADDRESS,
    STRICTLY_ABI,                
    signer
  );

  console.log('✅ Strictly contract redo på:', STRICTLY_CONTRACT_ADDRESS);
  
  return contract;
};
