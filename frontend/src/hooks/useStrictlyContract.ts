import { useMemo } from 'react';
import { Contract } from 'ethers';
import { STRICTLY_CONTRACT_ADDRESS, STRICTLY_ABI } from '../utils/contractConfig';
import { JsonRpcSigner } from 'ethers';


export const useStrictlyContract = (signer: JsonRpcSigner | null) => {
  const contract = useMemo(() => {
    if (!signer) {
      console.log('⚠️ Ingen signer - användaren inte ansluten');
      return null;
    }

    if (!STRICTLY_CONTRACT_ADDRESS || !STRICTLY_CONTRACT_ADDRESS.startsWith('0x')) {
      console.log('⚠️ Ingen giltig kontraktsadress satt (VITE_STRICTLY_CONTRACT_ADDRESS saknas).');
      return null;
    }

    const newContract = new Contract(
      STRICTLY_CONTRACT_ADDRESS,
      STRICTLY_ABI,                
      signer
    );

    console.log('✅ Strictly contract redo på:', STRICTLY_CONTRACT_ADDRESS);
    
    return newContract;
  }, [signer]); // Skapa bara nytt contract när signer ändras!

  return contract;
};
