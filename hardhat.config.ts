import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers"; 
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

// Ladda .env filen
dotenv.config();

const PRIVATE_KEY =
  process.env.SEPOLIA_PRIVATE_KEY ||
  process.env.PRIVATE_KEY ||
  "";

const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "";

const BASE_SEPOLIA_RPC_URL =
  process.env.BASE_SEPOLIA_RPC_URL ||
  "";

const networks: HardhatUserConfig["networks"] = {
  hardhatMainnet: {
    type: "edr-simulated",
    chainType: "l1",
  },
  hardhatOp: {
    type: "edr-simulated",
    chainType: "op",
  },
};

if (SEPOLIA_RPC_URL) {
  networks.sepolia = {
    type: "http",
    chainType: "l1",
    url: SEPOLIA_RPC_URL,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  };
}

if (BASE_SEPOLIA_RPC_URL) {
  networks.baseSepolia = {
    type: "http",
    chainType: "op",
    url: BASE_SEPOLIA_RPC_URL,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  };
}

const config: HardhatUserConfig = { 
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatVerify], 
  solidity: { 
    profiles: { 
      default: { 
        version: "0.8.30", 
      }, 
      production: { 
        version: "0.8.30", 
        settings: { 
          optimizer: { 
            enabled: true, 
            runs: 200, 
          }, 
        }, 
      }, 
    }, 
  }, 
  verify: { 
    etherscan: { 
      apiKey: process.env.ETHERSCAN_API_KEY || "", 
    }, 
  }, 
  networks, 
};
export default config;