import StrictlyABI from './StrictlyABI.json';

// Default-kontrakt (kan override:as via VITE_STRICTLY_CONTRACT_ADDRESS)
export const STRICTLY_CONTRACT_ADDRESS = (
  import.meta.env.VITE_STRICTLY_CONTRACT_ADDRESS ||
  "0xED11ACa1512Abd30b3b2f8a258d642fe6756F570"
).trim();
export const NETWORK_CHAIN_ID = Number(import.meta.env.VITE_NETWORK_CHAIN_ID || "11155111"); // Ethereum Sepolia (default)
export const NETWORK_NAME = (import.meta.env.VITE_NETWORK_NAME || "Ethereum Sepolia").trim();
export const STRICTLY_ABI = StrictlyABI;