import { useMemo } from 'react';
import { Contract } from 'ethers';
import { STRICTLY_CONTRACT_ADDRESS, STRICTLY_ABI } from '../utils/contractConfig';
import { JsonRpcSigner } from 'ethers';


export const useStrictlyContract = (signer: JsonRpcSigner | null) => {
  const contract = useMemo(() => {
    if (!signer) {
      console.log('No signer — user is not connected.');
      return null;
    }

    if (!STRICTLY_CONTRACT_ADDRESS || !STRICTLY_CONTRACT_ADDRESS.startsWith('0x')) {
      console.log('No valid contract address set (missing VITE_STRICTLY_CONTRACT_ADDRESS).');
      return null;
    }

    const newContract = new Contract(
      STRICTLY_CONTRACT_ADDRESS,
      STRICTLY_ABI,                
      signer
    );

    console.log('Strictly contract ready at:', STRICTLY_CONTRACT_ADDRESS);
    
    return newContract;
  }, [signer]);

  return contract;
};
